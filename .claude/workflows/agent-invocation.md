# Agent Invocation Workflow

**How to spawn, track, and coordinate named agents.**

---

## Named Agent Invocation

### Detection Patterns

| Pattern | Example | Action |
|---------|---------|--------|
| Direct name | "Have Tyler implement..." | Spawn Tyler-TypeScript |
| Role reference | "Ask the reviewer" | Spawn Rex-Reviewer |
| Shorthand | "@diana" | Spawn Diana-Debugger |
| Capability query | "Who can help with Python?" | Suggest Peter-Python |
| Status query | "What is Tyler working on?" | Check agent-status |

### Invocation Protocol

```
1. DETECT: Parse user input for agent reference
2. LOOKUP: Find agent in _registry.md
3. MAP: Get base agent type (e.g., typescript-pro)
4. SPAWN: Use Task tool with that subagent_type
5. REGISTER: Store status in agent-status namespace
6. TRACK: Monitor via progress-monitor.md
```

---

## Spawning Named Agents

### Using Task Tool

To spawn a named agent, use the Task tool with the corresponding `subagent_type`:

| Named Agent | subagent_type |
|-------------|---------------|
| Marcus-Orchestrator | workflow-orchestrator |
| Tyler-TypeScript | typescript-pro |
| Rex-Reviewer | code-reviewer |
| Diana-Debugger | debugger |
| Archie-Architect | backend-architect |
| Tessa-Tester | test-automator |
| Petra-DevOps | deployment-engineer |
| Helena-Memory | context-manager |
| Sage-Security | security-auditor |
| Otto-Observer | observability-engineer |
| Peter-Python | python-pro |
| Dana-Database | database-architect |
| Fiona-Frontend | frontend-developer |
| Adam-API | api-documenter |
| Kirk-Kubernetes | kubernetes-architect |
| Morgan-Marketing | (custom prompt) |
| Sophie-Social | social-media-agent |
| Scarlett-Script | (custom prompt) |
| Gina-Guide | how-to-guide-agent |
| Bella-Branding | branding-agent |

### Example Invocation

```javascript
// User says: "Have Tyler fix the TypeScript errors"

Task({
  description: "Fix TypeScript errors",
  prompt: "Fix all TypeScript errors in the project. Run tsc --noEmit first to identify errors, then fix them systematically.",
  subagent_type: "typescript-pro"
})
```

---

## Agent Registration

### On Agent Spawn

Every spawned agent should register itself:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-status",
  key: "Tyler-TypeScript",
  value: {
    agentName: "Tyler-TypeScript",
    status: "working",
    currentTask: "Fixing TypeScript errors",
    filesLocked: [],
    startedAt: "{timestamp}",
    lastHeartbeat: "{timestamp}"
  },
  ttl: 300
})
```

### Status Values

| Status | Meaning |
|--------|---------|
| `idle` | Available for work |
| `working` | Actively on a task |
| `blocked` | Waiting on dependency |
| `completed` | Task finished |
| `failed` | Task failed |
| `stale` | No heartbeat >5 min |

---

## Status Tracking

### Check Agent Status

```javascript
// Query single agent
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "agent-status",
  key: "Tyler-TypeScript"
})

// List all active agents
mcp__claude-flow__memory_search({
  pattern: "*",
  namespace: "agent-status"
})
```

### Heartbeat Protocol

Active agents update status every 30 seconds:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-status",
  key: "{agent-name}",
  value: {
    ...previousStatus,
    lastHeartbeat: "{current-timestamp}",
    progress: "Step 3 of 5"
  },
  ttl: 300
})
```

### Stale Detection

Agent is considered stale if:
- `lastHeartbeat` is >5 minutes old
- Status hasn't changed in >10 minutes

On stale detection:
1. Mark as `stale`
2. Log to recovery namespace
3. Notify user of possible issue
4. Offer to restart or abandon

---

## File Locking

### Before Editing Files

Agent must acquire lock:

```javascript
// Check if file is locked
const lock = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "file-locks",
  key: "src/auth.ts"
})

if (lock) {
  // File is locked by another agent
  // Wait or report conflict
} else {
  // Acquire lock
  mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "file-locks",
    key: "src/auth.ts",
    value: {
      lockedBy: "Tyler-TypeScript",
      since: "{timestamp}",
      expiresAt: "{timestamp + 30 min}"
    },
    ttl: 1800
  })
}
```

### Release Lock

After editing complete:

```javascript
mcp__claude-flow__memory_usage({
  action: "delete",
  namespace: "file-locks",
  key: "src/auth.ts"
})
```

---

## Multi-Agent Coordination

### Spawning Multiple Agents

For complex tasks requiring multiple agents:

```javascript
// Spawn agents in parallel
Task({ description: "Design API", subagent_type: "backend-architect" })
Task({ description: "Implement API", subagent_type: "typescript-pro" })
Task({ description: "Write tests", subagent_type: "test-automator" })
```

### Coordination Protocol

1. **Before spawning**: Create checkpoint in recovery namespace
2. **During execution**: Each agent updates agent-status
3. **On dependency**: Agent checks status of dependent agent
4. **On completion**: Agent broadcasts result to agent-broadcast
5. **After all complete**: Aggregate results, update history

### Inter-Agent Communication

```javascript
// Agent A broadcasts completion
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-broadcast",
  key: "msg_Tyler_Rex",
  value: {
    from: "Tyler-TypeScript",
    to: "Rex-Reviewer",
    type: "ready-for-review",
    files: ["src/auth.ts", "src/types.ts"],
    timestamp: "{timestamp}"
  },
  ttl: 3600
})

// Agent B checks for messages
mcp__claude-flow__memory_search({
  pattern: "msg_*_Rex",
  namespace: "agent-broadcast"
})
```

---

## Error Handling

### Agent Failure

If agent fails:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-status",
  key: "{agent-name}",
  value: {
    status: "failed",
    error: "{error message}",
    lastTask: "{task description}",
    failedAt: "{timestamp}"
  },
  ttl: 300
})
```

### Recovery Options

1. **Retry**: Spawn same agent with same task
2. **Escalate**: Spawn Diana-Debugger to investigate
3. **Skip**: Mark task as skipped, continue workflow
4. **Abort**: Cancel entire workflow, restore checkpoint

---

## Natural Language Queries

### Status Queries

| User Says | Action |
|-----------|--------|
| "What is Tyler working on?" | Check Tyler's agent-status |
| "Is Rex available?" | Check Rex's status == idle |
| "Who's working on auth?" | Search agent-status for auth task |
| "Show all active agents" | List all non-idle agents |

### Capability Queries

| User Says | Action |
|-----------|--------|
| "Who can help with Python?" | Return Peter-Python |
| "Which agent handles testing?" | Return Tessa-Tester |
| "Find someone for security" | Return Sage-Security |

### Task Assignment

| User Says | Action |
|-----------|--------|
| "Have Tyler implement auth" | Spawn Tyler with auth task |
| "Ask Rex to review" | Spawn Rex with review task |
| "Marcus, coordinate this" | Spawn Marcus as orchestrator |

---

## Best Practices

1. **Always register** - Every agent registers on spawn
2. **Heartbeat regularly** - Update status every 30s
3. **Lock before edit** - Acquire file locks
4. **Release on done** - Clean up locks and status
5. **Broadcast completion** - Let other agents know
6. **Handle failures** - Update status on error
