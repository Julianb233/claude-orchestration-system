# Unified State Preservation Protocol

**SINGLE SOURCE OF TRUTH for all checkpoint, recovery, and state persistence operations.**

---

## Overview

This workflow replaces the fragmented checkpoint logic previously scattered across:
- recovery-protocol.md
- session-startup.md
- auto-recovery.md
- night-shift.md
- progress-monitor.md

**One format. One TTL. One namespace key pattern.**

---

## Canonical Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| TTL | 4 hours (14400s) | Covers extended sessions |
| Namespace | `state` | Consolidated from `recovery`, `results` |
| Checkpoint Frequency | On-demand + every 30m | Balance between safety and overhead |
| Format | JSON v2 | Standardized below |

---

## When to Checkpoint

**ALWAYS checkpoint before:**
- Spawning 2+ agents (multi-agent work)
- High-risk operations (deployments, migrations)
- Night shift / sleep mode activation
- User explicitly requests (`/cf-checkpoint`)

**SKIP checkpointing for:**
- Single-agent tasks on 1-2 files
- Read-only operations
- Quick queries / research

```javascript
// Decision logic
const shouldCheckpoint = (task) => {
  if (task.agentCount > 1) return true;
  if (task.type === 'deploy' || task.type === 'migration') return true;
  if (task.mode === 'night-shift') return true;
  if (task.filesAffected > 5) return true;
  return false;
};
```

---

## Checkpoint Format (v2)

```json
{
  "version": "2.0",
  "checkpointId": "cp_{timestamp}",
  "createdAt": "{ISO timestamp}",
  "expiresAt": "{ISO timestamp + 4h}",
  "status": "active|completed|abandoned",

  "workflow": {
    "id": "wf_{timestamp}",
    "type": "swarm|task|hive|night-shift",
    "description": "Brief description",
    "startedAt": "{ISO timestamp}",
    "project": "{project-name}",
    "branch": "{git-branch}"
  },

  "agents": [
    {
      "name": "Tyler-TypeScript",
      "status": "running|completed|pending|failed",
      "task": "Implement feature X",
      "progress": "3/5 steps",
      "lastUpdate": "{ISO timestamp}",
      "output": "Summary of completed work"
    }
  ],

  "context": {
    "keyFiles": ["src/api.ts", "src/types.ts"],
    "decisions": ["Using REST over GraphQL"],
    "blockers": [],
    "todoList": []
  },

  "pendingWork": [
    "Deploy to staging",
    "Run integration tests"
  ],

  "recoveryInstructions": "Natural language continuation instructions"
}
```

---

## Memory Operations

### Create Checkpoint

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "state",
  key: "checkpoint-active",
  value: JSON.stringify(checkpointData),
  ttl: 14400  // 4 hours - CANONICAL
});

// Also store to history (append-only)
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "state",
  key: `checkpoint-${Date.now()}`,
  value: JSON.stringify(checkpointData),
  ttl: 604800  // 7 days for history
});
```

### Retrieve Active Checkpoint

```javascript
const checkpoint = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "state",
  key: "checkpoint-active"
});
```

### Mark Checkpoint Complete

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "state",
  key: "checkpoint-active",
  value: JSON.stringify({ ...checkpoint, status: "completed" }),
  ttl: 3600  // Keep for 1 hour after completion
});
```

### Clear Stale Checkpoints

```javascript
// On session start, check for abandoned work
const active = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "state",
  key: "checkpoint-active"
});

if (active && active.status === "active") {
  // Show recovery prompt
  const timeSince = Date.now() - new Date(active.createdAt).getTime();
  if (timeSince > 4 * 60 * 60 * 1000) {
    // Expired, mark as abandoned
    active.status = "abandoned";
  }
}
```

---

## Recovery Flow

```
Session Start
     │
     ▼
Check state/checkpoint-active
     │
  Found? ──── No → Normal session
     │
    Yes
     │
     ▼
Check status
     │
  "active"? ─── No → Clear and continue
     │
    Yes
     │
     ▼
Display recovery summary:
- What was being done
- Agent progress
- Pending work
     │
     ▼
Options:
1. Resume - Load context, continue
2. Abandon - Mark complete, start fresh
3. Review - Show full checkpoint details
```

---

## Agent Progress Updates

Agents update their status through the unified `agent-coordinator` namespace (not separate namespaces).

```javascript
// Agent reports progress
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-coordinator",
  key: `agent-${agentName}`,
  value: JSON.stringify({
    name: agentName,
    status: "working",
    task: "Current task description",
    progress: "3/5 steps",
    filesLocked: ["src/file.ts"],
    lastHeartbeat: new Date().toISOString(),
    checkpointRef: "cp_1234567890"  // Links to parent checkpoint
  }),
  ttl: 900  // 15 minutes, refreshed on heartbeat
});
```

---

## Stale Detection

An agent or checkpoint is considered stale if:
- Agent: No heartbeat update in 10 minutes
- Checkpoint: No agent updates in 15 minutes

```javascript
const isStale = (lastUpdate) => {
  const tenMinutes = 10 * 60 * 1000;
  return Date.now() - new Date(lastUpdate).getTime() > tenMinutes;
};
```

---

## Commands

| Command | Action |
|---------|--------|
| `/cf-checkpoint` | Create checkpoint now |
| `/cf-recover` | Check for and resume interrupted work |
| `/cf-status` | View active checkpoint and agent progress |
| `/cf-clear` | Clear active checkpoint (mark abandoned) |

---

## Migration from Old System

The following old keys are deprecated:

| Old Location | New Location |
|--------------|--------------|
| `recovery/active-workflow` | `state/checkpoint-active` |
| `recovery/checkpoints` | `state/checkpoint-{timestamp}` |
| `agents/{name}-progress` | `agent-coordinator/agent-{name}` |
| `agent-status/{name}` | `agent-coordinator/agent-{name}` |
| `results/task-{id}` | `state/result-{id}` |

---

## File Backup (Redundancy)

For critical operations, also write to local file:

```
/root/.claude-flow/state/checkpoint-active.json
/root/.claude-flow/state/checkpoints/  (historical)
```

This provides recovery even if memory namespace fails.

---

## Integration Points

### Bubba Orchestrator
Calls `createCheckpoint()` before spawning agents.

### Night Shift
Calls `createCheckpoint()` every 30 minutes during autonomous operation.

### Progress Monitor
Reads from `agent-coordinator` namespace (unified) instead of multiple namespaces.

### Session Startup
Checks `state/checkpoint-active` on connect.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Memory ops per checkpoint | 2 (active + history) |
| Duplicate checkpoint writes | 0 |
| Recovery success rate | >95% |
| Namespace count for state | 2 (state, agent-coordinator) |
