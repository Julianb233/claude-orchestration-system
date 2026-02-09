# Agent Reconnection Workflow

**Protocol for agents resuming after disconnection.**

---

## Reconnection Triggers

An agent reconnects when:
- Terminal session resumes after network interruption
- User restarts Claude Code in same project
- Agent is manually respawned after failure
- Swarm coordinator requests agent rejoin

---

## Reconnection Protocol

### Step 1: Identify Self

```javascript
// Check if this agent was previously active
const previousState = await mcp__claude-flow__memory_search({
  pattern: `*${agentName}*`,
  namespace: "recovery"
})

const wasDisconnected = previousState.find(s =>
  s.value.agentName === agentName &&
  s.value.disconnectedAt
)
```

### Step 2: Check Task Status

```javascript
async function checkReconnectionStatus(agentName) {
  // Was my task reassigned?
  const reassignment = await mcp__claude-flow__memory_search({
    pattern: `reassigned-*`,
    namespace: "task-queue"
  })

  const myTaskReassigned = reassignment.find(r =>
    r.value.previousAgent === agentName
  )

  if (myTaskReassigned) {
    return {
      status: "task_reassigned",
      newOwner: myTaskReassigned.value.assignedTo,
      task: myTaskReassigned.value.task
    }
  }

  // Is my task still pending?
  const recovery = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "recovery",
    key: `disconnected-${agentName}-*`
  })

  if (recovery.found) {
    return {
      status: "task_available",
      task: recovery.value.task,
      progress: recovery.value.progress,
      filesModified: recovery.value.filesModified
    }
  }

  return { status: "no_pending_task" }
}
```

### Step 3: Resume or Get New Assignment

```javascript
async function handleReconnection(agentName, reconnectionStatus) {
  switch (reconnectionStatus.status) {
    case "task_available":
      // Resume previous task
      return await resumePreviousTask(agentName, reconnectionStatus)

    case "task_reassigned":
      // Request new assignment
      return await requestNewAssignment(agentName)

    case "no_pending_task":
      // Check swarm for available work
      return await joinSwarmIfActive(agentName)
  }
}
```

---

## Resume Previous Task

When task is still available for the reconnecting agent:

```javascript
async function resumePreviousTask(agentName, taskState) {
  // 1. Re-register as active
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "agents",
    key: `${agentName}-status`,
    value: {
      agentName: agentName,
      status: "active",
      task: taskState.task,
      progress: taskState.progress,
      reconnectedAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString()
    },
    ttl: 3600
  })

  // 2. Re-acquire file locks
  for (const file of taskState.filesModified) {
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "file-locks",
      key: file,
      value: {
        lockedBy: agentName,
        lockedAt: new Date().toISOString(),
        purpose: "Resuming interrupted work"
      },
      ttl: 1800
    })
  }

  // 3. Clear recovery entry
  await mcp__claude-flow__memory_usage({
    action: "delete",
    namespace: "recovery",
    key: `disconnected-${agentName}-*`
  })

  // 4. Broadcast reconnection
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "agent-broadcast",
    key: `agent-reconnected-${Date.now()}`,
    value: {
      event: "agent_reconnected",
      agentName: agentName,
      resumingTask: taskState.task,
      timestamp: new Date().toISOString()
    },
    ttl: 3600
  })

  return {
    action: "resume",
    task: taskState.task,
    startFrom: taskState.progress
  }
}
```

---

## Handle Reassigned Task

When the agent's task was given to another agent:

```javascript
async function requestNewAssignment(agentName) {
  // 1. Re-register as idle
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "agents",
    key: `${agentName}-status`,
    value: {
      agentName: agentName,
      status: "idle",
      reconnectedAt: new Date().toISOString(),
      availableFor: "new_assignment",
      lastHeartbeat: new Date().toISOString()
    },
    ttl: 3600
  })

  // 2. Check swarm for available tasks
  const pendingTasks = await mcp__claude-flow__memory_search({
    pattern: "*-pending",
    namespace: "task-queue"
  })

  if (pendingTasks.length > 0) {
    const task = pendingTasks[0]
    // Claim the task
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "task-queue",
      key: task.key.replace("-pending", "-claimed"),
      value: {
        ...task.value,
        claimedBy: agentName,
        claimedAt: new Date().toISOString()
      }
    })

    return {
      action: "new_task",
      task: task.value.description
    }
  }

  return {
    action: "wait",
    message: "No tasks available, waiting for assignment"
  }
}
```

---

## Rejoin Active Swarm

```javascript
async function joinSwarmIfActive(agentName) {
  const swarm = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "swarms",
    key: "active-swarms"
  })

  if (swarm.found && swarm.value.status === "active") {
    // Add agent back to swarm
    const agents = swarm.value.agents || []
    if (!agents.includes(agentName)) {
      agents.push(agentName)
    }

    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "swarms",
      key: "active-swarms",
      value: {
        ...swarm.value,
        agents: agents
      }
    })

    // Notify swarm coordinator
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "agent-broadcast",
      key: `swarm-rejoin-${Date.now()}`,
      value: {
        event: "agent_rejoined_swarm",
        agentName: agentName,
        swarmId: swarm.value.id,
        timestamp: new Date().toISOString()
      },
      ttl: 3600
    })

    return {
      action: "rejoined_swarm",
      swarmId: swarm.value.id
    }
  }

  return {
    action: "no_swarm",
    message: "No active swarm to join"
  }
}
```

---

## User Display on Reconnection

```
Agent Reconnected: {agent-name}

Previous Session:
  - Disconnected: {disconnect-time}
  - Task: {task-name}
  - Progress: {progress}

Reconnection Status:
  [ ] Task still available - RESUMING
  [ ] Task reassigned to {other-agent}
  [ ] No pending work

Action: {resume|new_assignment|waiting}
```

---

## Quick Reconnection Check

For agents to run on startup:

```
// RECONNECTION CHECK - Run on agent startup
const status = await checkReconnectionStatus("{MY-NAME}")
if (status.status === "task_available") {
  console.log("Resuming: " + status.task + " from: " + status.progress)
} else if (status.status === "task_reassigned") {
  console.log("Task given to: " + status.newOwner + ", requesting new work")
}
```

---

## Integration Points

| Workflow | Relationship |
|----------|--------------|
| `agent-checkin.md` | Initial vs reconnection logic |
| `agent-disconnection.md` | Creates recovery state |
| `progress-monitor.md` | Heartbeat resumption |
| `recovery-protocol.md` | State restoration |
