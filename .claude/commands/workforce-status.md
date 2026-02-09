# Workforce Status Command

Display the current status of all agents in the workforce.

## Instructions

1. Query all agent statuses from memory:
```
mcp__claude-flow__memory_search(pattern="*-status", namespace="agents")
```

2. Check for stale agents (no heartbeat > 5 minutes)

3. Display status table:

| Agent | Status | Task | Progress | Last Heartbeat |
|-------|--------|------|----------|----------------|

4. Show summary:
- Active: X
- Idle: X
- Blocked: X
- Stale: X
- Total: X

5. If stale agents found, offer options:
- Ping agent
- Mark as disconnected
- Reassign tasks

6. Check active swarms:
```
mcp__claude-flow__memory_usage(action="retrieve", namespace="swarms", key="active-swarms")
```

7. Show swarm status if active

## Output Format

```
## Workforce Status

| Agent | Status | Task | Progress | Heartbeat |
|-------|--------|------|----------|-----------|
| Tyler-TypeScript | working | Fix errors | 7/10 | 30s ago |
| Rex-Reviewer | idle | - | - | 1m ago |
| Diana-Debugger | blocked | Debug auth | Step 3 | 45s ago |

Summary: 3 agents (1 working, 1 idle, 1 blocked)

Active Swarm: {swarm-name} - {task}
```
