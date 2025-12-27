# Quick History (Shortcut)

Show my last 5-7 Claude Flow interactions **grouped by time, then by repository**, with git info.

## Instructions

1. Retrieve history:
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="history", key="recent-interactions")
   ```

2. Calculate time groups based on current date:
   - **Today**: Same calendar day
   - **Yesterday**: Previous calendar day
   - **This Week**: Within last 7 days
   - **Older**: Everything else

3. Display with this format:
   ```
   ## Recent History (X interactions)

   ### Today
   **{Repo}** `{branch}`
   1. [{time}] {description} → `{commit}`
      {resumeContext}

   ### Yesterday
   **{Repo}** `{branch}` → PR #{number}
   2. [{time}] {description} → `{commit}`
      {resumeContext}

   ### This Week
   ...

   ### Older
   ...
   ```

4. Display elements:
   - Time group headers (Today/Yesterday/This Week/Older)
   - Repo name in **bold**
   - Branch in backticks (if available)
   - PR link if created (→ PR #N)
   - Latest commit hash after arrow
   - One-line resume context indented below

5. Number all interactions sequentially (1, 2, 3...) for `/cf-resume N`

6. End with: "Use `/cf-resume N` to continue any session"
