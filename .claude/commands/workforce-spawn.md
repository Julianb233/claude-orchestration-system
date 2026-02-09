# Workforce Spawn Command

Spawn a new agent into the workforce with proper check-in.

## Usage

/workforce-spawn {agent-name} {task-description}

## Instructions

1. Parse agent name and task from input

2. Validate agent name exists in registry:
```
Read /root/.claude/agents/_registry.md
```

3. Check for conflicts:
- Is agent already active?
- Are required files locked?

4. Spawn the agent using Task tool with appropriate subagent_type

5. Register agent in workforce:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="agents",
  key="{agent-name}-status",
  value={
    "agentName": "{agent-name}",
    "status": "active",
    "task": "{task}",
    "spawnedAt": "{timestamp}",
    "lastHeartbeat": "{timestamp}"
  },
  ttl=3600
)
```

6. If swarm is active, register agent with swarm

7. Confirm spawn to user:
```
Spawned: {agent-name}
Task: {task}
Status: Active
Swarm: {swarm-id or "None"}
```

## Example

User: /workforce-spawn Tyler-TypeScript "Fix all TypeScript errors in src/"

Output:
```
Spawned: Tyler-TypeScript
Task: Fix all TypeScript errors in src/
Status: Active
Registered in workforce at {timestamp}
```
