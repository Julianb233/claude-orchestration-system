# Next Actions (Proactive Suggestions)

Show predicted next actions based on current context. Shortcut: `/n`

## Instructions

### Step 1: Gather Context

1. **Check current directory** - Are we in a project?
   ```bash
   pwd
   ```

2. **Check git state** (if in repo):
   ```bash
   git status --porcelain
   git rev-parse --abbrev-ref HEAD
   git log --oneline -1
   ```

3. **Check for project state file**:
   ```
   .claude-state.json
   ```

4. **Check last actions in session** (from memory):
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="session", key="last-actions")
   ```

5. **Check todo list** - What's pending?

### Step 2: Determine Predictions

Based on context, predict next likely actions:

**If uncommitted changes exist:**
```
[1] git add -A && git commit -m "{generated message}"
[2] git diff ← review changes first
[3] git stash ← save for later
```

**If ahead of remote:**
```
[1] git push
[2] gh pr create ← create PR
[3] git log origin/main..HEAD ← review commits
```

**If tests haven't been run after edits:**
```
[1] npm test
[2] npm run test:watch
[3] npm run build ← build first
```

**If build succeeded:**
```
[1] vercel --prod ← deploy
[2] npm test ← run tests
[3] git commit ← commit changes
```

**If errors were just fixed:**
```
[1] npm run build ← verify fix
[2] npm test ← run tests
[3] git diff ← review changes
```

**If on feature branch with commits:**
```
[1] gh pr create ← create PR
[2] git push -u origin {branch}
[3] git rebase main ← update from main
```

**If todo items are pending:**
```
[1] {next pending todo item}
[2] {second pending item}
[3] /h ← check history
```

### Step 3: Display Format

```
## What's Next?

**Context:**
- Project: {project name}
- Branch: `{branch}` ({ahead/behind status})
- Last Action: {description of last thing done}
- Git Status: {clean/uncommitted changes/conflicts}

---

**Recommended Actions:**

[1] {command} ← {why this is recommended}
[2] {command}
[3] {command}

---

**From Todo List:**
- [ ] {pending item 1}
- [ ] {pending item 2}

---

Press **1**, **2**, or **3** to execute, or tell me what you'd like to do:
```

### Step 4: Handle User Response

- **"1"**, **"2"**, or **"3"** → Execute that command
- **"y"** or **Enter** → Execute [1]
- **Anything else** → Treat as new instruction

### Step 5: After Execution

After running the chosen command:
1. Update `last-actions` in memory
2. Show result
3. Immediately suggest NEXT action (chain predictions)

```
✅ Command executed successfully

**Next:**
[1] {next predicted action}

Press Enter to continue or type to do something else:
```

## Example Flows

### After Fixing a Bug
```
## What's Next?

**Context:**
- Project: PieDrive-AI
- Branch: `fix/auth-bug`
- Last Action: Fixed JWT validation error in auth.ts
- Git Status: 2 files modified

**Recommended:**
[1] npm test ← verify the fix works
[2] npm run build ← check for other errors
[3] git diff ← review your changes

Choice [1]:
```

### After Tests Pass
```
## What's Next?

**Context:**
- Project: PieDrive-AI
- Branch: `fix/auth-bug`
- Last Action: Tests passed (47/47)
- Git Status: 2 files modified, not committed

**Recommended:**
[1] git add -A && git commit -m "fix: resolve JWT validation error"
[2] git stash ← save for later
[3] npm run build ← build before commit

Choice [1]:
```

### After Commit
```
## What's Next?

**Context:**
- Project: PieDrive-AI
- Branch: `fix/auth-bug` (1 commit ahead)
- Last Action: Committed "fix: resolve JWT validation error"
- Git Status: Clean, ahead of origin

**Recommended:**
[1] git push ← push to remote
[2] gh pr create ← create pull request
[3] git log --oneline -3 ← review commits

Choice [1]:
```

## Learning

After each choice, log the pattern:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="patterns",
  key="action-{timestamp}",
  value="{context, prediction, userChoice}",
  ttl=604800
)
```

Over time, refine predictions based on what Julian actually chooses.
