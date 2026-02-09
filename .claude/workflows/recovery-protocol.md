# Workflow Recovery Protocol

**CRITICAL: Always checkpoint before multi-agent workflows to enable recovery after connection loss.**

## Recovery Commands

| Command | What It Does |
|---------|--------------|
| `/cf-checkpoint` | Save current state (auto-runs before agents) |
| `/cf-recover` | Check for & resume interrupted work |
| `/cf-status` | View active agents and their progress |

## Before Starting Multi-Agent Work

**ALWAYS save checkpoint BEFORE spawning any agents:**

1. Create checkpoint:
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="recovery",
     key="active-workflow",
     value="{checkpoint object}",
     ttl=14400  // 4 hours
   )
   ```

2. Also save to local file (redundancy):
   ```
   /root/.claude-flow/recovery/active-workflow.json
   ```

## Agent Progress Tracking

Each agent writes progress updates to shared memory:

```json
{
  "agentId": "agent-{type}-{timestamp}",
  "status": "running|completed|failed|stalled",
  "lastHeartbeat": "{ISO timestamp}",
  "progress": {
    "currentStep": "Implementing feature X",
    "stepsCompleted": 3,
    "stepsTotal": 7,
    "filesModified": ["file1.ts", "file2.ts"],
    "blockers": []
  }
}
```

**Progress update frequency:**
- Every significant step completion
- Every 5 minutes if still working
- Immediately on error/blocker

**Track with:**
```
mcp__claude-flow__memory_usage(action="store", namespace="agents", key="agent-{id}-progress", value="{progress}", ttl=3600)
```

## Enhanced Checkpoint Format

```json
{
  "checkpointId": "cp_{timestamp}",
  "createdAt": "{ISO timestamp}",
  "expiresAt": "{ISO timestamp + 4 hours}",
  "status": "in_progress|completed|abandoned",

  "workflow": {
    "id": "wf_{timestamp}",
    "type": "swarm|task-agents|hive",
    "description": "What we're doing",
    "startedAt": "{ISO timestamp}"
  },

  "agents": [
    {
      "id": "agent-coder-123",
      "type": "coder",
      "task": "Implement feature X",
      "status": "completed|running|pending|failed",
      "progress": "3/5 steps",
      "output": "Summary of what was done",
      "lastUpdate": "{ISO timestamp}"
    }
  ],

  "context": {
    "project": "PieDrive-AI",
    "branch": "feature/new-api",
    "keyFiles": ["src/api.ts", "src/types.ts"],
    "decisions": ["Using REST over GraphQL", "PostgreSQL for storage"],
    "todoList": [{"task": "...", "status": "..."}]
  },

  "pendingWork": [
    "Deploy to staging",
    "Run integration tests",
    "Update documentation"
  ],

  "recoveryInstructions": "Natural language: What was done, what's left, how to continue"
}
```

## Recovery Files Location

| File | Purpose | TTL |
|------|---------|-----|
| `recovery/active-workflow.json` | Current in-progress work | Until complete |
| `recovery/checkpoints.jsonl` | History of checkpoints | 7 days |
| `recovery/agent-logs/` | Individual agent outputs | 24 hours |

## Stale Detection

If an agent hasn't updated in >10 minutes:
1. Mark as "stalled"
2. Log the last known state
3. On recovery, offer to: retry, skip, or investigate

## Quick Recovery Flow

```
User reconnects after connection loss
         │
         ▼
   Check active-workflow
         │
    Found? ──┼── No → Normal session
         │
        Yes
         │
         ▼
   Show recovery prompt
   with agent status
         │
    Resume? ──┼── No → Mark abandoned
         │
        Yes
         │
         ▼
   Load checkpoint context
   Check agent progress
   Continue pending work
```
