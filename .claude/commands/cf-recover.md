# Recover Interrupted Work

Check for and resume any interrupted multi-agent workflows.

**Run this when reconnecting after connection loss, or say "continue" in any project.**

## Instructions

### Step 1: Check for Active Workflow

```
mcp__claude-flow__memory_usage(action="retrieve", namespace="recovery", key="active-workflow")
```

Also check local backup:
```
/root/.claude-flow/recovery/active-workflow.json
```

### Step 2: If NO Interrupted Work

```
✅ No interrupted work detected.

Your last session ended cleanly. What would you like to work on?
```

### Step 3: If Interrupted Work Found

Check each agent's progress:
```
mcp__claude-flow__memory_usage(action="retrieve", namespace="agents", key="agent-{id}-progress")
```

Calculate time since last update for each agent.

Display recovery prompt:

```
⚠️  INTERRUPTED WORK DETECTED

**Task:** {workflow.description}
**Project:** {context.project} (`{context.branch}`)
**Started:** {workflow.startedAt} ({X minutes/hours ago})
**Last Activity:** {most recent agent update}

### Agent Status

| # | Agent | Task | Status | Last Update |
|---|-------|------|--------|-------------|
| 1 | {type} | {task} | ✅ completed | 10 min ago |
| 2 | {type} | {task} | 🔄 running | 2 min ago |
| 3 | {type} | {task} | ⏳ pending | - |
| 4 | {type} | {task} | ⚠️ stalled | 15 min ago |
| 5 | {type} | {task} | ❌ failed | 8 min ago |

### Completed Work
{list items from completed agents}

### Pending Work
{list from pendingWork array}

### Key Files
{context.keyFiles}

### Decisions Made
{context.decisions}

---

**Recovery Instructions:**
{recoveryInstructions}

---

**Options:**
1. **Resume** - Continue from where we left off
2. **Status** - Check current agent activity (`/cf-status`)
3. **Details** - Show full checkpoint
4. **Abandon** - Mark as abandoned and start fresh
```

### Step 4: Handle User Choice

**On Resume:**
1. Load the todo list from checkpoint:
   ```
   TodoWrite with checkpoint.context.todoList items
   ```
2. Set working context (project, branch, files)
3. Check which agents completed vs pending
4. For completed agents: incorporate their output
5. For pending/failed agents: restart or skip based on user preference
6. Continue with first pending item
7. Keep checkpoint active, update progress as you go

**On Status:**
Run `/cf-status` to see real-time agent activity

**On Details:**
Display full checkpoint JSON for inspection

**On Abandon:**
1. Ask for reason (optional)
2. Move checkpoint to history with status "abandoned"
3. Clear active-workflow:
   ```
   mcp__claude-flow__memory_usage(action="delete", namespace="recovery", key="active-workflow")
   ```
4. Start fresh session

### Step 5: Progress Updates During Recovery

As you work through recovered tasks:
1. Update agent progress in memory
2. Mark completed items
3. When ALL done:
   - Set checkpoint status to "completed"
   - Save to interaction history (`/h`)
   - Clear active-workflow
   - Confirm: "Workflow completed and saved to history"

## Stale Agent Detection

If an agent's lastUpdate is >10 minutes old and status is "running":
- Mark as "stalled" (⚠️)
- On resume, offer options:
  1. Retry the agent's task
  2. Skip and continue
  3. Investigate what happened

## Example Recovery Flow

```
You: /cf-recover

Claude:
⚠️  INTERRUPTED WORK DETECTED

**Task:** Add Google Drive import feature
**Project:** PieDrive-AI (`feature/drive-import`)
**Started:** 25 minutes ago

| # | Agent | Task | Status |
|---|-------|------|--------|
| 1 | coder | Create Drive API client | ✅ completed |
| 2 | coder | Implement OAuth flow | ⚠️ stalled (12 min) |
| 3 | tester | Write integration tests | ⏳ pending |

**Completed:** Drive API client in `api/lib/drive.ts`
**Pending:** OAuth flow, tests

Resume? [1] Resume [2] Status [3] Details [4] Abandon

You: 1

Claude: Resuming workflow...
- Agent 1 output loaded (Drive API client ready)
- Agent 2 was stalled - retrying OAuth implementation
- Continuing with OAuth flow...
```
