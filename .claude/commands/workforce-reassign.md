# Workforce Reassign Command

Reassign a task from one agent to another.

## Usage

/workforce-reassign {from-agent} {to-agent}

## Instructions

1. Get current task from source agent:
```
mcp__claude-flow__memory_usage(
  action="retrieve",
  namespace="agents",
  key="{from-agent}-status"
)
```

2. Validate target agent is available:
```
mcp__claude-flow__memory_usage(
  action="retrieve",
  namespace="agents",
  key="{to-agent}-status"
)
```
   - Must be "idle" or not exist (will spawn)

3. Transfer file locks:
```
# Find locks held by source agent
mcp__claude-flow__memory_search(pattern="*", namespace="file-locks")

# Update each lock to new agent
mcp__claude-flow__memory_usage(
  action="store",
  namespace="file-locks",
  key="{filepath}",
  value={"lockedBy": "{to-agent}", ...}
)
```

4. Update source agent status:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="agents",
  key="{from-agent}-status",
  value={...existingStatus, "status": "idle", "task": null}
)
```

5. Update target agent status:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="agents",
  key="{to-agent}-status",
  value={
    "agentName": "{to-agent}",
    "status": "active",
    "task": "{transferred-task}",
    "progress": "{current-progress}",
    "reassignedFrom": "{from-agent}"
  }
)
```

6. Log reassignment:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="history",
  key="reassignment-{timestamp}",
  value={
    "from": "{from-agent}",
    "to": "{to-agent}",
    "task": "{task}",
    "reason": "manual"
  }
)
```

7. Confirm to user:
```
Task Reassigned:
  From: {from-agent}
  To: {to-agent}
  Task: {task-description}
  Progress: {progress}
  File locks transferred: {count}
```
