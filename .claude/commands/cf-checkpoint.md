# Workflow Checkpoint Command

Save the current workflow state to enable recovery after connection loss.

**CRITICAL: This runs AUTOMATICALLY before spawning any agents. Can also be run manually.**

## Instructions

When this command is invoked, you MUST:

1. **Capture Current State**: Identify what task/workflow is currently in progress
2. **Detect Repo**: Auto-detect from current working directory
3. **Capture Git State**: Get branch, recent commits
4. **Save to Memory**: Store in Claude Flow memory
5. **Save to Local File**: Also persist to local JSON (redundancy)
6. **Confirm Checkpoint**: Report what was saved

## Auto-Detect Repository

```bash
# Get repo name from path
pwd  # e.g., /root/github-repos/PieDrive-AI → "PieDrive-AI"

# Get git info if in repo
git rev-parse --abbrev-ref HEAD  # current branch
git remote get-url origin        # remote URL
git log --oneline -1             # last commit
```

## Enhanced Checkpoint Format (for Multi-Agent)

```json
{
  "checkpointId": "cp_{timestamp}",
  "createdAt": "{ISO timestamp}",
  "expiresAt": "{ISO timestamp + 4 hours}",
  "status": "in_progress",

  "workflow": {
    "id": "wf_{timestamp}",
    "type": "swarm|task-agents|hive|direct",
    "description": "{what we're doing}",
    "startedAt": "{ISO timestamp}"
  },

  "agents": [
    {
      "id": "agent-{type}-{timestamp}",
      "type": "{coder|researcher|tester|reviewer}",
      "task": "{specific task assigned}",
      "status": "pending",
      "progress": "0/N steps",
      "output": null,
      "lastUpdate": "{ISO timestamp}"
    }
  ],

  "context": {
    "project": "{auto-detected repo name}",
    "path": "{working directory}",
    "branch": "{current git branch}",
    "lastCommit": "{short hash}",
    "keyFiles": ["{files being worked on}"],
    "decisions": ["{important decisions made}"],
    "todoList": [{"task": "...", "status": "..."}]
  },

  "pendingWork": [
    "{list of tasks not yet started}"
  ],

  "recoveryInstructions": "{natural language: what was done, what's left, how to continue}"
}
```

## Memory Storage

1. Store as active workflow:
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="recovery",
     key="active-workflow",
     value="{checkpoint JSON}",
     ttl=14400
   )
   ```

2. Also save to local file:
   ```
   /root/.claude-flow/recovery/active-workflow.json
   ```

3. Append to checkpoint history:
   ```
   /root/.claude-flow/recovery/checkpoints.jsonl
   ```

## Agent Progress Updates

When agents are running, update their progress:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="agents",
  key="agent-{id}-progress",
  value="{progress object}",
  ttl=3600
)
```

## On Workflow Complete

When all work is done:
1. Update checkpoint status to "completed"
2. Move to interaction history (`/h`)
3. Clear active-workflow

## Example Output

```
✅ Checkpoint saved: cp_1734400200

**Workflow:** Implementing user authentication
**Project:** PieDrive-AI (`main` branch)
**Agents:** 3 pending

| Agent | Task | Status |
|-------|------|--------|
| coder | Implement login API | ⏳ pending |
| coder | Create auth middleware | ⏳ pending |
| tester | Write auth tests | ⏳ pending |

Resume with `/cf-recover` if connection is lost.
```
