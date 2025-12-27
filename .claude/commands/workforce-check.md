# Workforce Health Check Command

Run a comprehensive health check on the agent workforce.

## Instructions

1. Get all agent statuses:
```
mcp__claude-flow__memory_search(pattern="*-status", namespace="agents")
```

2. For each agent, check:
   - Heartbeat freshness (< 5 min = healthy)
   - Task progress (advancing = healthy)
   - Blocker status (none = healthy)

3. Check memory namespace health:
   - agents namespace accessible
   - file-locks namespace accessible
   - swarms namespace accessible
   - recovery namespace accessible

4. Check for orphaned locks:
   - Locks held by offline agents
   - Locks older than 30 minutes

5. Check swarm health:
   - All phases have assigned agents
   - No stalled phases

6. Generate health report:

```
## Workforce Health Report

### Agent Health
| Agent | Heartbeat | Progress | Blockers | Health |
|-------|-----------|----------|----------|--------|
| Tyler | 30s ago | Advancing | None | OK |
| Rex | 8m ago | - | - | STALE |

### Memory Systems
- agents: OK
- file-locks: OK
- swarms: OK
- recovery: OK

### Issues Found
1. Rex-Reviewer is stale (8 minutes without heartbeat)
2. Orphaned lock on src/auth.ts (agent offline)

### Recommended Actions
1. Check Rex-Reviewer status or mark disconnected
2. Release orphaned lock on src/auth.ts
```

7. Offer to auto-fix issues if found
