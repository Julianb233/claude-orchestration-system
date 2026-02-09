# Agent Check-in Workflow

**Mandatory check-in protocol when agents spawn or resume.**

---

## On Agent Spawn

Every agent MUST execute this check-in immediately upon spawning:

### Step 1: Register in Agent Registry

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agents",
  key: "{agent-name}-status",
  value: {
    agentName: "{agent-name}",
    agentType: "{base-agent-type}",
    status: "active",
    spawnedAt: "{timestamp}",
    terminal: "{terminal-id}",
    project: "{current-project}",
    task: "{assigned-task}",
    capabilities: ["{capability1}", "{capability2}"],
    lastHeartbeat: "{timestamp}"
  },
  ttl: 3600
})
```

### Step 2: Acquire File Locks (if editing)

```javascript
// Before editing any file
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "file-locks",
  key: "{filepath}",
  value: {
    lockedBy: "{agent-name}",
    lockedAt: "{timestamp}",
    purpose: "{editing-reason}"
  },
  ttl: 1800
})
```

### Step 3: Check for Active Swarms

```javascript
// Join existing swarm if one exists for this project
const swarms = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "swarms",
  key: "active-swarms"
})

if (swarms.found && swarms.value.project === currentProject) {
  // Register with swarm
  mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "swarms",
    key: `${swarms.value.id}-agents`,
    value: {
      ...existingAgents,
      [agentName]: { status: "joined", joinedAt: timestamp }
    }
  })
}
```

### Step 4: Check for Pending Tasks

```javascript
// Check if there are tasks waiting for this agent type
const pendingTasks = await mcp__claude-flow__memory_search({
  pattern: `*-waiting-${agentType}`,
  namespace: "task-queue"
})

if (pendingTasks.length > 0) {
  // Claim the first matching task
  const task = pendingTasks[0]
  mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "task-queue",
    key: task.key,
    value: { ...task.value, claimedBy: agentName, claimedAt: timestamp }
  })
}
```

---

## Heartbeat Loop

After check-in, agent must send heartbeats every 30 seconds:

```javascript
// Every 30 seconds during active work
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-status",
  key: "{agent-name}",
  value: {
    agentName: "{agent-name}",
    status: "working",
    currentTask: "{task-description}",
    progress: "{current-progress}",
    filesModified: ["{files}"],
    lastHeartbeat: "{current-timestamp}"
  },
  ttl: 300
})
```

---

## Check-in Validation

Before accepting an agent into a swarm, validate:

| Check | Validation |
|-------|------------|
| Name unique | No duplicate agent names in registry |
| Capabilities match | Agent can perform assigned task |
| No conflicts | Files agent needs aren't locked |
| Swarm capacity | Swarm hasn't reached max agents |

---

## Quick Check-in Template

For agents to copy-paste on spawn:

```
// AGENT CHECK-IN - Copy and execute on spawn
mcp__claude-flow__memory_usage(action="store", namespace="agents", key="{MY-NAME}-status", value={"agentName": "{MY-NAME}", "status": "active", "project": "{PROJECT}", "task": "{TASK}", "terminal": "Tx", "spawnedAt": "{NOW}", "lastHeartbeat": "{NOW}"}, ttl=3600)
```

---

## Integration Points

| Workflow | Relationship |
|----------|--------------|
| `progress-monitor.md` | Validates heartbeats |
| `agent-disconnection.md` | Handles missed heartbeats |
| `agent-reconnection.md` | Resume protocol after disconnect |
| `recovery-protocol.md` | Recovery from failures |
