# View Recent Claude Flow Interactions

Show my last 5-7 Claude Flow interactions **grouped by time, then by repository**, with full git integration.

## Instructions

1. Retrieve the recent interactions:
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="history", key="recent-interactions")
   ```

2. Calculate time groups based on current date (today is the reference):
   - **Today**: Same calendar day as now
   - **Yesterday**: Previous calendar day
   - **This Week**: Within last 7 days (excluding today/yesterday)
   - **Older**: Everything beyond 7 days

3. Display with enhanced format:
   ```
   ## Recent History (X interactions)

   ### Today
   **{Repo}** `{branch}`
   1. [{HH:MM}] {description} → `{commit_hash}`
      {resumeContext}

   ### Yesterday
   **{Repo}** `{branch}` → PR #{number}
   2. [{HH:MM}] {description} → `{commit_hash}`
      {resumeContext}

   ### This Week
   **{Repo}** `{branch}`
   3. [{Day HH:MM}] {description} → `{commit_hash}`
      {resumeContext}

   ### Older
   4. [{Mon DD}] {description}
      {resumeContext}
   ```

4. Display elements explained:
   | Element | Format | Example |
   |---------|--------|---------|
   | Time (today/yesterday) | HH:MM | 14:30 |
   | Time (this week) | Day HH:MM | Mon 14:30 |
   | Time (older) | Mon DD | Dec 10 |
   | Repo | **bold** | **PieDrive-AI** |
   | Branch | backticks | `main` |
   | PR | arrow + number | → PR #42 |
   | Commit | backticks after arrow | → `abc123` |
   | Resume | indented below | Ready to deploy |

5. Number all interactions sequentially (1, 2, 3...) across all time groups

6. End with:
   ```
   ---
   Use `/cf-resume N` to continue any session
   ```

7. If no history exists:
   ```
   No history yet. History is auto-saved after significant work.
   ```
