# Auto-Recovery Workflow

**Purpose:** Automatically recover from context compaction failures and session interruptions.

---

## Trigger Conditions

1. **Compaction Failure** - Context window auto-compaction fails
2. **Session Disconnect** - Unexpected terminal disconnection
3. **Manual Recovery** - User triggers "Bubba, I'm back"

---

## Recovery Protocol

### Phase 1: Detection
```
Hook: /root/.claude/hooks/context-recovery.sh compaction_failed
Marker: /root/.claude/.recovery-pending
```

### Phase 2: State Retrieval
```javascript
// Retrieve last checkpoint
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "recovery",
  key: "swarm-checkpoint"
})

// Get active agent states
mcp__claude-flow__memory_search({
  pattern: "*-status",
  namespace: "agents"
})

// Get pending broadcasts
mcp__claude-flow__memory_search({
  pattern: "msg_*",
  namespace: "agent-broadcast"
})
```

### Phase 3: Swarm Restoration
1. Parse swarm checkpoint data
2. Re-initialize swarm with same topology
3. Spawn agents with their previous task context
4. Restore file locks if any were active
5. Resume task execution

### Phase 4: Verification
- Confirm all agents responsive
- Verify memory namespaces accessible
- Check no duplicate tasks running
- Log successful recovery

---

## Checkpoint Format

```json
{
  "timestamp": "ISO-8601",
  "swarmId": "swarm_xxx",
  "topology": "hierarchical",
  "agents": [
    {
      "name": "Tyler-TypeScript",
      "type": "typescript-pro",
      "task": "current task description",
      "progress": 75,
      "project": "/root/github-repos/PieDrive-AI",
      "status": "active"
    }
  ],
  "fileLocks": [
    {
      "path": "/root/github-repos/PieDrive-AI/src/video.ts",
      "lockedBy": "Tyler-TypeScript",
      "expires": "ISO-8601"
    }
  ],
  "pendingTasks": [
    {
      "id": "task_xxx",
      "assignedTo": "Rex-Reviewer",
      "description": "Review PR #123",
      "priority": "high"
    }
  ]
}
```

---

## Session Startup Integration

On every session start, check for recovery:

```javascript
// Check for pending recovery
const marker = await readFile('/root/.claude/.recovery-pending');
if (marker) {
  // Load recovery checkpoint
  const checkpoint = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "recovery",
    key: "swarm-checkpoint"
  });

  // Execute recovery
  await executeRecoveryProtocol(checkpoint);

  // Clear marker
  await deleteFile('/root/.claude/.recovery-pending');
}
```

---

## Manual Recovery Trigger

Say: **"Bubba, I'm back"** or **"Bubba, restore session"**

This triggers:
1. Check recovery namespace for latest checkpoint
2. Display what was being worked on
3. Offer to restore swarm or start fresh

---

## Checkpoint Schedule

| Event | Action |
|-------|--------|
| Every 5 minutes | Light checkpoint (agent status only) |
| Every 30 minutes | Full checkpoint (swarm + tasks + locks) |
| Before complex operation | Pre-op checkpoint |
| After major milestone | Post-milestone checkpoint |

---

## Memory Namespace TTLs for Recovery

| Key | TTL | Purpose |
|-----|-----|---------|
| `swarm-checkpoint` | 4 hours | Full swarm state |
| `agent-checkpoint-{name}` | 2 hours | Individual agent state |
| `task-queue` | 4 hours | Pending task list |
| `file-locks-snapshot` | 1 hour | Active file locks |

---

## Error Handling

### If checkpoint is stale (> 4 hours)
- Notify user of data age
- Offer partial recovery or fresh start
- Log warning

### If memory namespace unreachable
- Fall back to local file checkpoint at `/root/.claude/.local-checkpoint.json`
- Attempt memory reconnection
- Continue with degraded state

### If agents fail to spawn
- Retry with backoff (1s, 2s, 4s)
- After 3 failures, spawn remaining agents only
- Report failed agents to user

---

## Logging

All recovery events logged to:
- `/root/.claude/logs/recovery-YYYYMMDD.log`
- Memory namespace: `metrics` with key `recovery-events`

---

*Part of Bubba's Autonomous Operations System*
