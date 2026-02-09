# Smart Project Context Loader

Load relevant context for the current project automatically.

## Instructions

1. **Identify current project:**
   - Check current working directory
   - Look for package.json, Cargo.toml, pyproject.toml, go.mod, etc.
   - Get project name

2. **Gather project context:**
   ```bash
   # Recent activity
   git log --oneline -10
   git diff --stat HEAD~5..HEAD

   # Current state
   git status --short
   git branch --show-current
   ```

3. **Load local project files:**
   - Check for `todo.md`, `TODO.md`, `ROADMAP.md`
   - Check for `.claude-state.json` (resume state)
   - Check for `IMPROVEMENT_PLAN.md`
   - Read first 50 lines of README.md if exists

4. **Check Claude Flow memory for project:**
   ```
   mcp__claude-flow__memory_search(pattern="{project-name}", namespace="projects")
   ```

5. **Output summary:**
   ```
   ## Project: {name}

   **Branch:** {current-branch}
   **Status:** {clean/dirty} ({N} modified files)

   ### Recent Activity
   - {last 5 commits summarized}

   ### Active Work
   - {from .claude-state.json or todo.md}

   ### Pending Items
   - {from TODO.md or ROADMAP.md}

   ### Previous Session Notes
   - {from Claude Flow memory if exists}
   ```

6. **Store this context load** in session memory for quick recall.
