# Git Smart Workflow

Intelligent git operations with auto-generated messages and branch management.

## Arguments
$ARGUMENTS - Command: commit, branch, pr, sync

## Instructions

### If $ARGUMENTS is "commit" or empty:

1. **Analyze changes:**
   ```bash
   git diff --cached --stat
   git diff --cached
   ```

2. **Generate smart commit message:**
   - Categorize: feat, fix, refactor, docs, test, chore
   - Summarize WHAT changed (files, functions)
   - Explain WHY (infer from context)
   - Follow conventional commits format

3. **Run pre-commit review** (quick version of /review):
   - Check for secrets, console.logs, TODO comments
   - Warn but don't block

4. **Commit with generated message:**
   ```bash
   git commit -m "{type}: {description}

   {body if needed}

   🤖 Generated with Claude Code"
   ```

### If $ARGUMENTS is "branch":

1. Ask for feature description
2. Generate branch name: `{type}/{short-description}`
   - feat/add-user-auth
   - fix/login-redirect-loop
   - refactor/extract-api-client

3. Create and checkout branch

### If $ARGUMENTS is "pr":

1. **Gather all commits since branch diverged:**
   ```bash
   git log main..HEAD --oneline
   git diff main..HEAD --stat
   ```

2. **Generate PR description:**
   ```markdown
   ## Summary
   {what this PR does}

   ## Changes
   - {categorized list of changes}

   ## Testing
   - [ ] Unit tests pass
   - [ ] Manual testing done

   ## Screenshots
   {if UI changes, prompt for screenshots}
   ```

3. **Create PR via gh:**
   ```bash
   gh pr create --title "{title}" --body "{body}"
   ```

### If $ARGUMENTS is "sync":

1. Fetch latest from remote
2. Rebase current branch on main (or merge if conflicts)
3. Report status

## Always:
- Store git actions in memory for pattern learning
- Learn user's commit style preferences over time
