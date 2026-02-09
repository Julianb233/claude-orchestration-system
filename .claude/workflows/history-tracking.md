# Auto-Save Interaction History

**CRITICAL: Automatically save significant Claude Flow interactions to history. Julian should NEVER have to manually save.**

## History Format: Grouped by Repository with Git Linking

History is stored organized by project/repository with automatic git integration:

```json
{
  "format": "grouped-by-repo-v2",
  "lastUpdated": "{ISO timestamp}",
  "repositories": {
    "{repo-name}": {
      "path": "/root/github-repos/{repo-name}",
      "interactions": [
        {
          "id": "cf_{timestamp}",
          "timestamp": "{ISO timestamp}",
          "description": "{brief 5-10 word description}",
          "type": "swarm|implementation|research|config",
          "status": "completed",
          "summary": "{2-3 sentences of what was accomplished}",
          "keyFiles": ["{files modified}"],
          "resumeContext": "{how to continue if needed}",
          "git": {
            "branch": "{branch name if applicable}",
            "commits": ["{short commit hashes made during session}"],
            "pr": "{PR number or URL if created}",
            "remote": "{github repo URL}"
          }
        }
      ]
    }
  },
  "totalInteractions": 5-7
}
```

## Auto-Detect Repository

**CRITICAL: Always auto-detect the repository from the current working directory.**

1. Check `pwd` or current working directory
2. Extract repo name:
   - If in `/root/github-repos/{repo-name}/...` → use `{repo-name}`
   - If in `/root/.claude/...` → use `claude-config`
   - Otherwise → use directory name or "general"
3. Get git info if in a git repo:
   ```bash
   git rev-parse --abbrev-ref HEAD  # current branch
   git remote get-url origin        # remote URL
   git log --oneline -3             # recent commits
   ```

## When to Auto-Save (Triggers)

Save to history automatically when ANY of these occur:
1. **Swarm completes** - After `swarm_destroy` or swarm finishes work
2. **Multi-agent task completes** - After spawning 2+ agents for a task
3. **Significant implementation** - After completing feature/fix that touched 3+ files
4. **Session ending** - When Julian says goodbye, "thanks", "that's all", etc.
5. **Context compaction imminent** - Before auto-compacting kicks in

## How to Auto-Save

1. Retrieve current history:
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="history", key="recent-interactions")
   ```

2. Create entry with project/repo info

3. Add to the appropriate repository group, keep 5-7 most recent total across all repos

4. Store back:
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="history",
     key="recent-interactions",
     value="{updated grouped JSON}",
     ttl=2592000
   )
   ```

## Display Format for `/h`

Show history **grouped by TIME first, then by repository** within each time period:

```
## Recent History (X interactions)

### Today
**PieDrive-AI** `main`
1. [01:30] Implemented 5 TODO features → `abc123`
   Ready to deploy

**claude-config**
2. [00:15] Updated history format → `def456`
   Added git linking

### Yesterday
**PieDrive-AI** `feature/api` → PR #42
3. [14:00] Commit, deploy, TS fixes → `789ghi`
   Production deployed

### This Week
**other-repo** `main`
4. [Mon 10:00] Description here → `jkl012`
   Resume context
```

## Quick Access Commands

| Command | Action |
|---------|--------|
| `/h` | View 5-7 interactions grouped by repo (shortcut) |
| `/cf-history` | Full history view |
| `/cf-resume N` | Resume interaction #N |

## Do NOT Save (Skip These)

- Simple questions/answers
- Single file reads
- Quick lookups
- Conversations under 3 exchanges
