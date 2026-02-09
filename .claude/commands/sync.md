# File Sync Agent Command

Check for pending file sync updates from the File Watcher Agent and handle them.

## Your Task

1. **Check for Pending Updates**:
   Read `/root/.claude-flow/sync/pending-updates.jsonl` for any notifications from the File Watcher Agent.

2. **For Each Pending Update**:
   - Parse the notification JSON
   - Identify the source file that changed
   - Identify the target files that may need updating
   - Based on the action type, either:
     - **notify**: Inform about what needs manual updating
     - **command**: Run the specified command (e.g., `npx prisma generate`)

3. **Priority Handling**:
   - `critical`: Handle immediately, may block other work
   - `high`: Handle before continuing other tasks
   - `normal`: Handle when convenient
   - `low`: Optional, just inform user

4. **After Handling**:
   - Clear the processed updates: `rm /root/.claude-flow/sync/pending-updates.jsonl`
   - Store in Claude Flow memory for history:
     ```
     mcp__claude-flow__memory_usage(
       action="store",
       namespace="sync",
       key="last-sync",
       value="{timestamp, updates_processed, actions_taken}"
     )
     ```

5. **Report to User**:
   Summarize what was synced:
   ```
   ## Sync Complete

   **Processed:** X updates
   **Actions taken:**
   - [action 1]
   - [action 2]

   **Manual updates needed:**
   - [file that needs human attention]
   ```

## If No Pending Updates

Simply respond: "No pending sync updates. File watcher has not detected any changes requiring propagation."

## File Relations Reference

The file relations are defined in `/root/.claude-flow/file-relations.json`. This defines:
- Which file patterns trigger sync notifications
- What target files are related
- What action to take (command or notify)
- Priority level

## Example Notification Format

```json
{
  "id": "sync_1734403200",
  "timestamp": "2025-12-17T03:00:00Z",
  "source": "api/lib/gemini.ts",
  "action": "update-api-docs",
  "targets": ["docs/api.md", "README.md"],
  "priority": "normal",
  "message": "API files changed - documentation may need updating",
  "status": "pending"
}
```

## Starting the File Watcher

If the user wants to start the watcher, instruct them:
```bash
# Start watching a project directory
/root/scripts/file-watcher-agent.sh watch /root/github-repos/project-name

# Or run in background
nohup /root/scripts/file-watcher-agent.sh watch /root/github-repos/project-name &
```
