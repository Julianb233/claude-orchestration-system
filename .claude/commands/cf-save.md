# Save Current Interaction to History

Save the current Claude Flow interaction to my recent history (keeps last 5).

## Instructions

1. First retrieve existing history:
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="history", key="recent-interactions")
   ```

2. Create a new entry for this interaction:
   ```json
   {
     "id": "cf_{timestamp}",
     "timestamp": "{ISO timestamp}",
     "description": "{brief description of what we worked on}",
     "status": "completed|in_progress",
     "summary": "{2-3 sentence summary of outcomes}",
     "keyFiles": ["files that were modified"],
     "resumeContext": "{how to continue if needed}"
   }
   ```

3. Add to front of list, keep only last 5 entries

4. Store back to memory:
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="history",
     key="recent-interactions",
     value="{JSON array of interactions}",
     ttl=2592000
   )
   ```

5. Also append to local backup file: `/root/.claude-flow/history/interactions.jsonl`

6. Confirm: "Saved interaction #{N}: {description}"
