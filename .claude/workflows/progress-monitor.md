# Progress Monitor Workflow

**Agent heartbeat tracking and stall detection for multi-agent coordination.**

---

## Purpose

This workflow defines how to:
1. Track agent progress during tasks
2. Detect stalled or failed agents
3. Trigger recovery when needed
4. Aggregate results from multiple agents

---

## Heartbeat Protocol

### Agent Responsibility

Every active agent must update status every **30 seconds**:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-status",
  key: "{agent-name}",
  value: {
    agentName: "{agent-name}",
    status: "working",
    currentTask: "Implementing feature X",
    progress: "Step 3 of 7",
    filesModified: ["src/auth.ts"],
    lastHeartbeat: "{current-timestamp}",
    startedAt: "{original-start-time}"
  },
  ttl: 300
})
```

### Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| `idle` | Available for work | Can assign tasks |
| `working` | Actively on task | Monitor heartbeat |
| `blocked` | Waiting on dependency | Check blocker |
| `completed` | Task finished | Collect results |
| `failed` | Task failed | Trigger recovery |
| `stale` | No heartbeat >5 min | Investigate |

---

## Stale Detection

### Thresholds

| Threshold | Duration | Action |
|-----------|----------|--------|
| Warning | 3 minutes | Log warning |
| Stale | 5 minutes | Mark as stale |
| Offline | 15 minutes | Assume dead, cleanup |

### Detection Logic

```
1. Check lastHeartbeat timestamp
2. Calculate time since last update
3. If > 5 minutes:
   - Mark agent as stale
   - Log to recovery namespace
   - Alert user
   - Offer to restart or abandon
```

### Checking for Stale Agents

```javascript
// Get all agent statuses
const agents = await mcp__claude-flow__memory_search({
  pattern: "*",
  namespace: "agent-status"
})

// Check each for staleness
for (const agent of agents) {
  const lastHeartbeat = new Date(agent.value.lastHeartbeat)
  const now = new Date()
  const minutesSinceUpdate = (now - lastHeartbeat) / 60000

  if (minutesSinceUpdate > 5) {
    // Agent is stale
    console.log(`STALE: ${agent.value.agentName} - no update for ${minutesSinceUpdate} minutes`)
  }
}
```

---

## Progress Tracking

### Progress Update Format

Agents report progress with:

```json
{
  "agentName": "Tyler-TypeScript",
  "status": "working",
  "currentTask": "Fix TypeScript errors",
  "progress": "3/10 files fixed",
  "filesModified": [
    "src/auth.ts",
    "src/types.ts",
    "src/api.ts"
  ],
  "blockers": [],
  "lastHeartbeat": "2025-12-17T12:00:00Z"
}
```

### Tracking Multiple Agents

For swarm/multi-agent work, aggregate progress:

```javascript
// Get all active agents
const activeAgents = await mcp__claude-flow__memory_search({
  pattern: "*",
  namespace: "agent-status"
})

// Build progress summary
const summary = {
  total: activeAgents.length,
  working: 0,
  completed: 0,
  blocked: 0,
  failed: 0,
  stale: 0,
  agents: []
}

for (const agent of activeAgents) {
  summary[agent.value.status]++
  summary.agents.push({
    name: agent.value.agentName,
    status: agent.value.status,
    task: agent.value.currentTask,
    progress: agent.value.progress
  })
}
```

---

## Blocker Detection

### When Agent is Blocked

Agent reports blocker:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-status",
  key: "{agent-name}",
  value: {
    agentName: "{agent-name}",
    status: "blocked",
    currentTask: "Implement auth",
    blockedBy: "Waiting for schema from Dana-Database",
    blockerType: "dependency",
    blockedSince: "{timestamp}",
    lastHeartbeat: "{timestamp}"
  },
  ttl: 300
})
```

### Blocker Types

| Type | Description | Resolution |
|------|-------------|------------|
| `dependency` | Waiting on another agent | Check dependent agent |
| `resource` | File locked, resource busy | Wait or override |
| `error` | Encountered error | Diana-Debugger |
| `input` | Needs user input | Prompt user |
| `external` | External service down | Retry later |

### Blocker Resolution

When blocker is resolved, broadcast to unblock waiting agents:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-broadcast",
  key: "blocker-resolved-{timestamp}",
  value: {
    blocker: "Database schema ready",
    resolvedBy: "Dana-Database",
    unblockedAgents: ["Tyler-TypeScript"],
    timestamp: "{timestamp}"
  },
  ttl: 3600
})
```

---

## Result Collection

### On Task Completion

Agent stores results:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "results",
  key: "{agent-name}-{task-id}",
  value: {
    agentName: "{agent-name}",
    taskId: "{task-id}",
    status: "completed",
    summary: "Fixed all TypeScript errors",
    filesModified: ["src/auth.ts", "src/types.ts"],
    duration: "15 minutes",
    completedAt: "{timestamp}"
  },
  ttl: 604800
})
```

### Aggregating Swarm Results

After all agents complete:

```javascript
// Collect all results
const results = await mcp__claude-flow__memory_search({
  pattern: "*-task-{taskId}",
  namespace: "results"
})

// Aggregate
const aggregated = {
  taskId: "{taskId}",
  totalAgents: results.length,
  successful: 0,
  failed: 0,
  filesModified: [],
  summaries: []
}

for (const result of results) {
  if (result.value.status === "completed") {
    aggregated.successful++
  } else {
    aggregated.failed++
  }
  aggregated.filesModified.push(...result.value.filesModified)
  aggregated.summaries.push(result.value.summary)
}
```

---

## Recovery Triggers

### When to Trigger Recovery

| Condition | Action |
|-----------|--------|
| Agent stale >5 min | Mark stale, offer restart |
| Agent failed | Log error, offer retry |
| All agents blocked | Deadlock detection |
| Swarm incomplete after timeout | Partial recovery |

### Recovery Actions

```javascript
// Store recovery checkpoint
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "recovery",
  key: "stalled-agent-{agent-name}",
  value: {
    agentName: "{agent-name}",
    lastKnownState: {...agentStatus},
    stalledAt: "{timestamp}",
    pendingWork: ["Step 4", "Step 5"],
    recoveryOptions: ["retry", "skip", "abandon"]
  },
  ttl: 14400
})
```

---

## Display Format

### Progress Dashboard (for user)

```
## Agent Progress

| Agent | Status | Task | Progress |
|-------|--------|------|----------|
| Tyler-TypeScript | working | Fix errors | 7/10 |
| Rex-Reviewer | idle | - | - |
| Dana-Database | completed | Schema | Done |
| Tessa-Tester | blocked | Tests | Waiting |

Active: 2 | Completed: 1 | Blocked: 1 | Total: 4

Last update: 30 seconds ago
```

### Stale Warning

```
⚠️ STALE AGENT DETECTED

Agent: Tyler-TypeScript
Last heartbeat: 7 minutes ago
Last task: Fix TypeScript errors
Progress: 5/10 files

Options:
[1] Restart agent with same task
[2] Skip and continue
[3] Abandon workflow
```

---

## Implementation Notes

1. **Heartbeat is agent's responsibility** - Each spawned agent must update its status
2. **Check heartbeats periodically** - Main orchestrator should poll every minute
3. **TTL ensures cleanup** - Stale entries auto-expire after 5 minutes
4. **Broadcast completions** - So dependent agents can unblock
5. **Log to recovery** - For crash recovery scenarios
