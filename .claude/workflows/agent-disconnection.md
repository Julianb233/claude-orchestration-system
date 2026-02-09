# Agent Disconnection Workflow

**Detection and handling of disconnected/stale agents.**

---

## Disconnection Detection

### Staleness Thresholds

| Duration | Status | Action |
|----------|--------|--------|
| 0-3 min | Active | Normal operation |
| 3-5 min | Warning | Log warning, continue monitoring |
| 5-10 min | Stale | Mark stale, prepare for reassignment |
| 10-15 min | Disconnected | Release locks, reassign tasks |
| >15 min | Offline | Remove from registry, full cleanup |

### Detection Script

Run this check every 60 seconds from orchestrator:

```javascript
async function detectDisconnectedAgents() {
  // Get all agent statuses
  const agents = await mcp__claude-flow__memory_search({
    pattern: "*-status",
    namespace: "agents"
  })

  const now = new Date()
  const disconnected = []

  for (const agent of agents) {
    const lastHeartbeat = new Date(agent.value.lastHeartbeat)
    const minutesSinceUpdate = (now - lastHeartbeat) / 60000

    if (minutesSinceUpdate > 5) {
      disconnected.push({
        agentName: agent.value.agentName,
        lastSeen: agent.value.lastHeartbeat,
        minutesStale: minutesSinceUpdate,
        task: agent.value.task,
        filesLocked: agent.value.filesModified || []
      })
    }
  }

  return disconnected
}
```

---

## Handling Disconnection

### Step 1: Mark Agent as Disconnected

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agents",
  key: "{agent-name}-status",
  value: {
    ...existingStatus,
    status: "disconnected",
    disconnectedAt: "{timestamp}",
    lastKnownTask: "{task}",
    lastKnownProgress: "{progress}"
  },
  ttl: 3600
})
```

### Step 2: Release File Locks

```javascript
// Find all locks held by this agent
const locks = await mcp__claude-flow__memory_search({
  pattern: "*",
  namespace: "file-locks"
})

for (const lock of locks) {
  if (lock.value.lockedBy === disconnectedAgentName) {
    // Release the lock
    await mcp__claude-flow__memory_usage({
      action: "delete",
      namespace: "file-locks",
      key: lock.key
    })

    // Log the release
    console.log(`Released lock on ${lock.key} from ${disconnectedAgentName}`)
  }
}
```

### Step 3: Save Task State for Recovery

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "recovery",
  key: `disconnected-${agentName}-${timestamp}`,
  value: {
    agentName: agentName,
    task: lastKnownTask,
    progress: lastKnownProgress,
    filesModified: filesModified,
    disconnectedAt: timestamp,
    recoveryOptions: ["reassign", "resume", "abandon"],
    priority: taskPriority
  },
  ttl: 14400  // 4 hours
})
```

### Step 4: Notify Swarm (if applicable)

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-broadcast",
  key: `agent-disconnected-${timestamp}`,
  value: {
    event: "agent_disconnected",
    agentName: agentName,
    task: lastKnownTask,
    availableForReassignment: true,
    requiredCapabilities: agentCapabilities,
    timestamp: timestamp
  },
  ttl: 3600
})
```

---

## Task Reassignment

### Automatic Reassignment

When an agent disconnects with an incomplete task:

```javascript
async function reassignTask(disconnectedAgent) {
  // Get the incomplete task
  const recovery = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "recovery",
    key: `disconnected-${disconnectedAgent.agentName}-*`
  })

  // Find available agent with matching capabilities
  const availableAgents = await mcp__claude-flow__memory_search({
    pattern: "*-status",
    namespace: "agents"
  })

  const candidate = availableAgents.find(a =>
    a.value.status === "idle" &&
    a.value.capabilities.includes(recovery.value.requiredCapabilities[0])
  )

  if (candidate) {
    // Assign task to new agent
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "task-queue",
      key: `reassigned-${recovery.value.task}`,
      value: {
        task: recovery.value.task,
        assignedTo: candidate.value.agentName,
        previousAgent: disconnectedAgent.agentName,
        progress: recovery.value.progress,
        filesModified: recovery.value.filesModified,
        priority: "high",
        reassignedAt: new Date().toISOString()
      }
    })

    return candidate.value.agentName
  }

  return null  // No available agent
}
```

### Manual Reassignment Options

Present to user when auto-reassignment fails:

```
Agent {name} disconnected while working on: {task}

Progress: {progress}
Files modified: {files}

Options:
[1] Reassign to {available-agent}
[2] Queue for next available agent
[3] Wait for agent to reconnect (max 15 min)
[4] Abandon task
```

---

## Cleanup Protocol

After 15 minutes with no reconnection:

```javascript
async function cleanupOfflineAgent(agentName) {
  // 1. Remove from agent registry
  await mcp__claude-flow__memory_usage({
    action: "delete",
    namespace: "agents",
    key: `${agentName}-status`
  })

  // 2. Remove from active swarm
  const swarm = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "swarms",
    key: "active-swarms"
  })

  if (swarm.found) {
    const updatedAgents = swarm.value.agents.filter(a => a !== agentName)
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "swarms",
      key: "active-swarms",
      value: { ...swarm.value, agents: updatedAgents }
    })
  }

  // 3. Log to history
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "history",
    key: `agent-offline-${agentName}-${Date.now()}`,
    value: {
      event: "agent_went_offline",
      agentName: agentName,
      offlineAt: new Date().toISOString(),
      taskStatus: "incomplete"
    },
    ttl: 604800  // 7 days
  })
}
```

---

## Integration Points

| Workflow | Relationship |
|----------|--------------|
| `agent-checkin.md` | Initial registration |
| `progress-monitor.md` | Heartbeat source |
| `agent-reconnection.md` | Resume after disconnect |
| `recovery-protocol.md` | State recovery |
