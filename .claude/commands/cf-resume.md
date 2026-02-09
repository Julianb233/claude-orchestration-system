# Resume a Previous Claude Flow Interaction

Resume interaction number $ARGUMENTS from history.

## Instructions

1. Retrieve the history:
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="history", key="recent-interactions")
   ```

2. Find the interaction at position $ARGUMENTS (1-5)

3. Display the full context:
   ```
   ## Resuming: {description}

   **When:** {timestamp}
   **Status:** {status}

   ### Summary
   {summary}

   ### Key Files
   - {files list}

   ### How to Continue
   {resumeContext}
   ```

4. Ask: "Ready to continue this work?"

If $ARGUMENTS is empty, show the list like `/cf-history` and ask which one to resume.
