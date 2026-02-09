# Rate Limit Handler Workflow

**Auto-switch to organization API when personal rate limits are hit.**

---

## Purpose

This workflow handles:
1. Detection of rate limit errors (429)
2. Automatic switching to organization API
3. Seamless continuation of work
4. Switching back when personal limits recover

---

## Rate Limit Detection

### Trigger Patterns

| Pattern | Source | Action |
|---------|--------|--------|
| `429 Too Many Requests` | HTTP response | Switch API |
| `rate limit exceeded` | Error message | Switch API |
| `quota exceeded` | Error message | Wait or switch |
| `try again later` | Error message | Implement backoff |

---

## API Switching Protocol

### Configuration

Store rate limit config in Claude Flow:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "config",
  key: "rate-limit-config",
  value: {
    primary: "personal",
    fallback: "organization",
    autoSwitch: true,
    notifyOnSwitch: true,
    personalLimitResetHours: 24
  }
})
```

### On Rate Limit Hit

```
1. Detect 429 or rate limit error
2. Check if autoSwitch is enabled
3. If enabled:
   a. Store current API mode to memory
   b. Switch to organization API credentials
   c. Log switch event
   d. Continue work seamlessly
4. If not enabled:
   a. Notify user of rate limit
   b. Suggest waiting or manual switch
```

### Switching Logic

```javascript
// On rate limit hit
async function handleRateLimit() {
  // Get current config
  const config = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "config",
    key: "rate-limit-config"
  })

  if (!config.autoSwitch) {
    // Notify user
    console.log("Rate limit hit. Auto-switch disabled.")
    return
  }

  // Store that we've switched
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "config",
    key: "current-api-mode",
    value: {
      mode: "organization",
      switchedAt: new Date().toISOString(),
      reason: "rate_limit",
      previousMode: "personal"
    }
  })

  // Log the switch
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "session",
    key: "rate-limit-event",
    value: {
      event: "switched_to_org",
      timestamp: new Date().toISOString()
    },
    ttl: 86400
  })

  // Continue with organization API
  // (Claude Code handles this internally)
}
```

---

## Credential Management

### Personal API

- Primary account credentials
- Used by default
- Has daily/hourly limits

### Organization API

- Fallback credentials
- Higher limits
- Used when personal exhausted

### Fetching Organization Credentials

If not already configured, fetch from Notion:

```javascript
// Search Notion for org credentials
mcp__notion__API-post-search({
  query: "Claude organization API key"
})
```

---

## Recovery Protocol

### Checking If Personal Limits Recovered

```javascript
// Check every hour if personal limits might be recovered
async function checkPersonalRecovery() {
  const config = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "config",
    key: "current-api-mode"
  })

  if (config.mode !== "organization") return

  const switchedAt = new Date(config.switchedAt)
  const now = new Date()
  const hoursSinceSwitch = (now - switchedAt) / 3600000

  // Most rate limits reset after 24 hours
  if (hoursSinceSwitch >= 24) {
    // Try switching back
    await switchToPersonal()
  }
}
```

### Switching Back to Personal

```javascript
async function switchToPersonal() {
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "config",
    key: "current-api-mode",
    value: {
      mode: "personal",
      switchedAt: new Date().toISOString(),
      reason: "recovery"
    }
  })

  console.log("Switched back to personal API")
}
```

---

## Backoff Strategy

When rate limited and cannot switch:

| Attempt | Wait Time |
|---------|-----------|
| 1 | 1 minute |
| 2 | 5 minutes |
| 3 | 15 minutes |
| 4 | 1 hour |
| 5+ | Notify user |

### Implementation

```javascript
async function backoffRetry(attempt = 1) {
  const waitTimes = [60, 300, 900, 3600] // seconds
  const waitTime = waitTimes[Math.min(attempt - 1, 3)]

  console.log(`Rate limited. Waiting ${waitTime}s before retry...`)

  // Store backoff state
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "session",
    key: "rate-limit-backoff",
    value: {
      attempt,
      waitUntil: new Date(Date.now() + waitTime * 1000).toISOString()
    },
    ttl: waitTime + 60
  })

  // Wait
  await new Promise(resolve => setTimeout(resolve, waitTime * 1000))

  // Retry
  return true
}
```

---

## User Notification

### When Switching to Org

```
Rate limit hit on personal API.
Automatically switching to organization API.
Work will continue seamlessly.
```

### When Cannot Switch

```
⚠️ Rate Limit Hit

Personal API limit reached.
Organization API not configured.

Options:
[1] Wait 15 minutes and retry
[2] Configure organization API
[3] Continue with reduced functionality
```

---

## Memory Keys

| Key | Namespace | Purpose |
|-----|-----------|---------|
| `rate-limit-config` | config | Switch settings |
| `current-api-mode` | config | Which API is active |
| `rate-limit-event` | session | Log of switches |
| `rate-limit-backoff` | session | Backoff state |

---

## Integration Points

1. **Trigger detection** - Monitor all API responses for 429
2. **Credential fetch** - Get org credentials from Notion if needed
3. **Seamless switch** - Continue work without interruption
4. **Auto recovery** - Switch back when limits reset
5. **Logging** - Track all switches for debugging

---

## Best Practices

1. **Always have org API configured** as fallback
2. **Monitor usage** to predict limits
3. **Batch operations** to reduce API calls
4. **Cache results** where possible
5. **Log switches** for debugging
