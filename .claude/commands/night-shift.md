# Night Shift Mode

**Activating autonomous overnight operation mode.**

---

## NIGHT SHIFT PROTOCOL

You are now entering **Night Shift Mode** - an 8-hour autonomous operation period.

### Your Authority

You have **FULL AUTONOMOUS PERMISSION** to:
- Read and write ANY files without asking
- Execute ANY bash commands without asking
- Make git commits without asking
- Spawn ANY agents without asking
- Run tests, builds, and deployments without asking
- Modify code across any project without asking

**DO NOT ASK FOR PERMISSION.** The user has explicitly granted all permissions. Execute everything directly.

---

## Activation Steps

1. **Load the workflow documentation:**
   Read `/root/.claude/workflows/night-shift.md`

2. **Initialize Night Shift state:**
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="night-shift",
     key="config",
     value={
       "mode": "active",
       "startedAt": "[current ISO timestamp]",
       "duration": "8h",
       "maxConcurrentAgents": 3,
       "permissionMode": "full-bypass",
       "owner": "Julian"
     },
     ttl=32400
   )
   ```

3. **Start Context Coach:**
   Spawn the context-coach agent to monitor context health throughout the night.

   ```
   Task tool with subagent_type="context-coach"
   Prompt: "NIGHT SHIFT CONTEXT MONITORING - Run continuous health checks every 2 minutes.
   Checkpoint every 15 minutes. Alert on context > 60%. Emergency save on context > 90%.
   This is an 8-hour autonomous run. Do not ask for permission for anything."
   run_in_background: true
   ```

4. **Ask for tasks:**
   Ask the user: "What tasks should I complete tonight? I'll work on them autonomously for the next 8 hours."

5. **Queue all tasks in memory:**
   Store in `night-shift/task-queue` namespace

6. **Begin execution loop:**
   - Pick up tasks one at a time (max 3 concurrent)
   - Spawn appropriate agents with full permissions
   - Monitor progress
   - Checkpoint every 15 minutes
   - Handle errors with retry logic
   - Continue until all tasks complete or 8 hours elapsed

---

## Execution Rules

### Pacing (Slow and Steady)
- Maximum 3 agents running simultaneously
- 30-second cooldown after each task completion
- Don't flood - pick up tasks sequentially
- Preserve resources for the full 8 hours

### Context Protection
- Monitor context usage continuously
- Checkpoint when context > 60%
- Compact conversation when needed
- NEVER let context overflow freeze the session

### Self-Healing
- Retry failed tasks up to 3 times
- Clean up stale agents after 10 minutes
- Auto-resume from checkpoints on issues
- Continue with other tasks if one fails

### Progress Tracking
- Update agent status every 30 seconds
- Store completion results in memory
- Generate progress reports on request
- Final summary report at end of shift

---

## Commands During Night Shift

| Command | Action |
|---------|--------|
| `/night-shift status` | Show progress dashboard |
| `/night-shift add [task]` | Add task to queue |
| `/night-shift pause` | Pause execution |
| `/night-shift resume` | Resume execution |
| `/night-shift stop` | Graceful shutdown |

---

## Memory Namespaces

Store all state in these namespaces:
- `night-shift/config` - Mode configuration
- `night-shift/task-queue` - Pending tasks
- `night-shift/progress` - Current status
- `night-shift/completed` - Finished tasks
- `night-shift/errors` - Error log
- `night-shift/checkpoints` - Recovery points

---

## BEGIN NIGHT SHIFT

Read the workflow, initialize state, start context coach, then ask for tasks.

**Good night, Julian. I'll handle everything.**
