# Session Startup Workflow

**On every new session, automatically:**

1. Check for interrupted work (`/cf-recover` silently)
2. Load project context if in a project directory
3. Show what was last worked on
4. Suggest next actions

## Auto-Recovery Check

**ALWAYS run this check when starting a new session:**

1. Check for interrupted work:
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="recovery", key="active-workflow")
   ```

2. If found and status is "in_progress":
   ```
   ⚠️  INTERRUPTED WORK DETECTED

   Task: {description}
   Started: {timestamp}
   Progress: {X of Y steps completed}

   Agents spawned:
   - agent-1: ✅ completed
   - agent-2: 🔄 in progress (last update: 5 min ago)
   - agent-3: ⏳ pending

   Resume this work? (yes/no)
   ```

3. On "yes" → Load context and continue from last checkpoint
4. On "no" → Mark as abandoned and clear

## Welcome Display Format

```
👋 Welcome back, Julian!

**Last Session:** PieDrive-AI - Implemented auth features
**Status:** Ready to deploy

**Pick up where you left off:**
[1] vercel --prod ← deploy to production
[2] npm test ← run tests first
[3] git status ← check current state

Or tell me what you'd like to do:
```

## Auto-Execute Rules (No Confirmation Needed)

| Trigger | Auto Action |
|---------|------------|
| Session start in project | Load `.claude-state.json` context |
| Session start anywhere | Check for interrupted work |
| After significant code changes | Update `.claude-state.json` |
| Before multi-agent work | Save checkpoint |
| After workflow complete | Save to history |
| Entering git repo | Check branch, status |
