# Auto Code Review

Review staged/uncommitted changes before committing. Catch issues early.

## Instructions

1. **Get the changes to review:**
   ```bash
   git diff --cached  # staged changes
   git diff           # unstaged changes
   git log -1 --format="%H %s" # last commit for context
   ```

2. **Spawn a code-reviewer agent** to analyze:
   - Security vulnerabilities (SQL injection, XSS, secrets in code)
   - Performance issues (N+1 queries, memory leaks, blocking calls)
   - Logic errors and edge cases
   - Code style and best practices
   - Missing error handling
   - Test coverage gaps

3. **Output format:**
   ```
   ## Code Review Summary

   ### 🔴 Critical (must fix)
   - [file:line] Issue description

   ### 🟡 Warnings (should fix)
   - [file:line] Issue description

   ### 🟢 Suggestions (nice to have)
   - [file:line] Suggestion

   ### ✅ What looks good
   - Positive observations

   **Verdict:** APPROVE / REQUEST_CHANGES / NEEDS_DISCUSSION
   ```

4. **Store review in memory** for learning:
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="reviews",
     key="review_{timestamp}",
     value="{review summary + verdict}"
   )
   ```

5. If critical issues found, ask: "Fix these issues now?"
