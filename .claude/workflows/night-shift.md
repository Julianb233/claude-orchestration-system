# Night Shift Mode

**Autonomous 8-hour operation for unattended task completion.**

**Invoke:** `/night-shift` or "Going to Sleep"

---

## Overview

Night Shift is a fully autonomous operational mode designed for:
- **8 hours** of unattended operation
- **Zero intervention** required - all permissions pre-approved
- **Parallel task execution** with intelligent pacing
- **Context protection** via continuous monitoring
- **Slow and steady** approach to prevent overload

---

## Core Principles

### 1. Full Permission Bypass
All agents spawn with complete execution authority:
- File read/write: APPROVED
- Bash commands: APPROVED
- Git operations: APPROVED
- Agent spawning: APPROVED
- Tool execution: APPROVED

### 2. Context Protection
Context-Coach (Cassie) runs continuously:
- Monitor context usage every 2 minutes
- Checkpoint every 15 minutes
- Auto-compact when reaching 60% capacity
- Preserve critical state through compaction

### 3. Slow and Steady Pacing
- Maximum 3 concurrent agents
- 30-second cooldown between task completions
- Sequential task pickup (no task flooding)
- Energy conservation mode for long-running operations

### 4. Self-Healing
- Auto-retry failed tasks (max 3 attempts)
- Auto-cleanup stale agents after 10 minutes
- Auto-resume from checkpoints on any issue
- Graceful degradation under load

---

## Activation Protocol

### Pre-Flight Checks

```javascript
// 1. Verify task queue exists
const tasks = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "night-shift",
  key: "task-queue"
});

// 2. Initialize if not exists
if (!tasks) {
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "night-shift",
    key: "task-queue",
    value: { tasks: [], status: "empty" },
    ttl: 32400  // 9 hours
  });
}

// 3. Store night shift configuration
await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "night-shift",
  key: "config",
  value: {
    mode: "night-shift",
    startedAt: new Date().toISOString(),
    duration: "8h",
    maxConcurrentAgents: 3,
    permissionMode: "full-bypass",
    contextThreshold: 60,
    checkpointInterval: 900,  // 15 minutes
    cooldownMs: 30000,
    maxRetries: 3,
    owner: "Julian"
  },
  ttl: 32400
});

// 4. Activate context coach
await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "night-shift",
  key: "context-coach-active",
  value: { active: true, lastCheck: new Date().toISOString() },
  ttl: 32400
});
```

### Memory Namespaces

| Namespace | Key | Purpose | TTL |
|-----------|-----|---------|-----|
| `night-shift` | `config` | Mode configuration | 9h |
| `night-shift` | `task-queue` | Pending tasks | 9h |
| `night-shift` | `progress` | Current progress | 9h |
| `night-shift` | `completed` | Finished tasks | 24h |
| `night-shift` | `errors` | Error log | 24h |
| `night-shift` | `checkpoints` | Recovery points | 9h |
| `night-shift` | `context-coach-active` | Coach status | 9h |

---

## Task Queue Management

### Adding Tasks

Before sleeping, queue all tasks:

```javascript
await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "night-shift",
  key: "task-queue",
  value: {
    tasks: [
      {
        id: "task-001",
        description: "Fix all TypeScript errors in project X",
        priority: "high",
        agent: "Tyler-TypeScript",
        project: "/root/github-repos/project-x",
        status: "pending",
        retries: 0
      },
      {
        id: "task-002",
        description: "Write unit tests for auth module",
        priority: "medium",
        agent: "Tessa-Tester",
        project: "/root/github-repos/project-x",
        status: "pending",
        retries: 0
      }
      // ... more tasks
    ],
    totalTasks: 2,
    completedCount: 0,
    failedCount: 0
  },
  ttl: 32400
});
```

### Task Schema

```json
{
  "id": "task-{uuid}",
  "description": "Clear, actionable task description",
  "priority": "critical|high|medium|low",
  "agent": "Named-Agent or subagent_type",
  "project": "/path/to/project",
  "dependencies": ["task-000"],
  "status": "pending|in_progress|completed|failed",
  "retries": 0,
  "output": null,
  "error": null,
  "startedAt": null,
  "completedAt": null
}
```

---

## Execution Loop

### Main Loop

```
LOOP every 60 seconds for 8 hours:
  1. Context Check
     - Run Cassie health check
     - If context > 60%: checkpoint and compact
     - If context > 90%: emergency save and pause

  2. Agent Check
     - Count active agents
     - Clean up stale agents (>10 min inactive)
     - If < 3 active: proceed to task pickup

  3. Task Pickup
     - Get next pending task (priority order)
     - Check dependencies satisfied
     - Spawn agent with full permissions
     - Update task status to in_progress

  4. Progress Update
     - Update night-shift/progress
     - Update agent heartbeat
     - Store intermediate results

  5. Completion Check
     - Check for completed tasks
     - Move to completed list
     - Log results
     - Wait cooldown (30s)

  6. Error Handling
     - Check for failed tasks
     - Retry if retries < 3
     - Log to errors namespace
     - Continue with next task

  7. Checkpoint (every 15 min)
     - Full state snapshot
     - Store to checkpoints
     - Enable recovery on any failure
END LOOP
```

### Agent Spawning (Full Permission)

```javascript
// Night shift agent spawn - NO PERMISSION PROMPTS
Task({
  subagent_type: task.agent,  // or named agent's base type
  prompt: `
NIGHT SHIFT MODE - FULL AUTONOMOUS EXECUTION

You have FULL PERMISSION to:
- Read and write any files
- Execute any bash commands
- Make git commits
- Spawn sub-agents if needed
- Modify any code

DO NOT ASK FOR PERMISSION. Execute directly.

Task: ${task.description}
Project: ${task.project}

Requirements:
1. Complete the task fully
2. Update progress every 30 seconds via memory
3. Report completion via memory when done
4. Handle errors gracefully (retry up to 3 times)

Progress Update Command:
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "agent-status",
  key: "${task.agent}",
  value: {
    status: "working",
    taskId: "${task.id}",
    progress: "step X of Y",
    lastHeartbeat: "${new Date().toISOString()}"
  },
  ttl: 600
})

Completion Command:
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "night-shift",
  key: "completed-${task.id}",
  value: {
    taskId: "${task.id}",
    status: "completed",
    summary: "[what was done]",
    filesModified: [],
    completedAt: "${new Date().toISOString()}"
  },
  ttl: 86400
})
`,
  run_in_background: true,
  model: "sonnet"  // Use efficient model for background work
});
```

---

## Context Coach Integration

### Continuous Monitoring

Cassie-ContextCoach runs every 2 minutes:

```javascript
async function contextHealthCheck() {
  // Estimate current context usage
  const estimate = estimateContextUsage();

  // Store health status
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "night-shift",
    key: "context-health",
    value: {
      estimatedTokens: estimate.total,
      percentUsed: estimate.percent,
      activeAgents: await getActiveAgentCount(),
      lastCheck: new Date().toISOString(),
      recommendation: estimate.percent > 60 ? "checkpoint-now" : "healthy"
    },
    ttl: 300
  });

  // Auto-checkpoint if needed
  if (estimate.percent > 60) {
    await createCheckpoint("context-threshold");
  }

  // Emergency pause if critical
  if (estimate.percent > 90) {
    await emergencyPause();
  }
}
```

### Checkpoint Structure

```json
{
  "checkpointId": "cp-{timestamp}",
  "createdAt": "ISO timestamp",
  "trigger": "scheduled|context-threshold|emergency",
  "state": {
    "taskQueue": [...],
    "completedTasks": [...],
    "activeAgents": [...],
    "errorLog": [...],
    "currentProgress": {...}
  },
  "contextEstimate": 45000,
  "recoveryInstructions": "Resume from task-003, agents Tyler and Tessa were active"
}
```

### Compaction Recovery

When context compaction occurs:

```javascript
async function recoverFromCompaction() {
  // 1. Load latest checkpoint
  const checkpoint = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "night-shift",
    key: "checkpoint-latest"
  });

  // 2. Restore task queue
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "night-shift",
    key: "task-queue",
    value: checkpoint.state.taskQueue,
    ttl: 32400
  });

  // 3. Resume execution
  console.log(`Recovered from checkpoint: ${checkpoint.checkpointId}`);
  console.log(`Resuming: ${checkpoint.recoveryInstructions}`);

  // 4. Continue main loop
  resumeMainLoop();
}
```

---

## Progress Dashboard

### View Progress

Retrieve at any time with:

```javascript
const progress = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "night-shift",
  key: "progress"
});
```

### Progress Format

```
=============================================
       NIGHT SHIFT PROGRESS REPORT
=============================================

Mode: Active
Started: 11:00 PM
Elapsed: 4h 23m
Remaining: 3h 37m

Tasks:
  Total:     15
  Completed: 8  [========>    ] 53%
  In Progress: 2
  Pending:   4
  Failed:    1

Active Agents:
  - Tyler-TypeScript: Fixing types (task-009)
  - Tessa-Tester: Writing tests (task-010)

Context Health:
  Usage: 42% [====       ]
  Last Checkpoint: 12 min ago
  Status: HEALTHY

Recent Completions:
  [03:15] task-008: Refactored auth module
  [02:48] task-007: Updated dependencies
  [02:22] task-006: Fixed API endpoints

Errors:
  [01:15] task-005: Build failed (retry 2/3)

=============================================
```

---

## Error Handling

### Retry Logic

```javascript
async function handleTaskError(task, error) {
  task.retries++;

  // Log error
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "night-shift",
    key: `error-${task.id}-${task.retries}`,
    value: {
      taskId: task.id,
      error: error.message,
      attempt: task.retries,
      timestamp: new Date().toISOString()
    },
    ttl: 86400
  });

  if (task.retries < 3) {
    // Retry with exponential backoff
    const delay = task.retries * 60000;  // 1, 2, 3 minutes
    await sleep(delay);
    task.status = "pending";
    return "retry";
  } else {
    // Mark as failed, continue with others
    task.status = "failed";
    return "failed";
  }
}
```

### Critical Errors

For critical errors that could affect the whole shift:
1. Emergency checkpoint
2. Pause new task pickup
3. Store detailed error report
4. Send notification (if configured)
5. Attempt graceful recovery

---

## Shutdown Conditions

Night Shift ends when:
1. **8 hours elapsed** - Graceful shutdown
2. **All tasks completed** - Early success
3. **Critical error** - Emergency stop with checkpoint
4. **User intervention** - Manual stop command

### Graceful Shutdown

```javascript
async function gracefulShutdown() {
  // 1. Stop picking new tasks
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "night-shift",
    key: "status",
    value: "shutting-down",
    ttl: 3600
  });

  // 2. Wait for active agents to complete (max 30 min)
  await waitForAgents(1800);

  // 3. Final checkpoint
  await createCheckpoint("shutdown");

  // 4. Generate summary report
  const report = await generateSummaryReport();

  // 5. Store final status
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "night-shift",
    key: "final-report",
    value: report,
    ttl: 86400
  });

  console.log("Night Shift completed. Good morning!");
}
```

---

## Commands

| Command | Action |
|---------|--------|
| `/night-shift start` | Begin Night Shift mode |
| `/night-shift status` | Show progress dashboard |
| `/night-shift add [task]` | Add task to queue |
| `/night-shift pause` | Pause execution |
| `/night-shift resume` | Resume execution |
| `/night-shift stop` | Graceful shutdown |
| `/night-shift report` | Generate full report |

---

## Configuration Options

```json
{
  "nightShift": {
    "defaultDuration": "8h",
    "maxConcurrentAgents": 3,
    "checkpointIntervalMinutes": 15,
    "contextCoachIntervalMinutes": 2,
    "taskCooldownSeconds": 30,
    "maxRetries": 3,
    "staleAgentTimeoutMinutes": 10,
    "contextThresholdPercent": 60,
    "emergencyThresholdPercent": 90,
    "preferredModel": "sonnet",
    "notifyOnCompletion": true,
    "notifyEmail": "julian@aiacrobatics.com"
  }
}
```

---

## Integration

### With Bubba-Orchestrator

Bubba can initiate Night Shift:
```
"Bubba, set and forget these tasks for tonight"
→ Bubba queues tasks → Activates Night Shift → Works autonomously
```

### With Hive Coordination

Night Shift can spawn hive workers:
```
For large tasks, spawn parallel workers in separate terminals
Each worker operates under Night Shift rules
All coordinate via memory namespaces
```

### With Recovery Protocol

Full integration with `recovery-protocol.md`:
- Checkpoints are recovery-compatible
- Can resume from any checkpoint
- Handles connection loss gracefully
