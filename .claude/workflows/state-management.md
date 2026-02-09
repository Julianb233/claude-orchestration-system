# Project State Management

**ALWAYS maintain a `.claude-state.json` file in any project you're actively working on.**

## Auto-Save Rules

1. **On Starting Work**: Create/update `.claude-state.json` in project root with:
   - `currentWork.description` - What we're doing
   - `currentWork.status` - "in_progress"
   - `lastUpdated` - Current timestamp
   - `expiresAt` - 4 days from now

2. **On Task Progress**: Update the file whenever:
   - TodoWrite is called (sync the tasks array)
   - A significant step is completed
   - Key decisions or findings are made
   - Files are identified as important

3. **On Session End/Checkpoint**: Ensure state is saved with:
   - All current tasks and their status
   - `nextActions` - What to do next
   - `resumeInstructions` - How to continue

## State File Format

```json
{
  "version": "1.0",
  "project": "{project-name}",
  "lastUpdated": "{ISO timestamp}",
  "expiresAt": "{ISO timestamp + 4 days}",
  "currentWork": {
    "description": "{what we're working on}",
    "status": "in_progress|completed|blocked"
  },
  "tasks": [
    {"id": 1, "description": "...", "status": "completed|in_progress|pending"}
  ],
  "context": {
    "keyFiles": ["..."],
    "decisions": ["..."],
    "findings": ["..."]
  },
  "nextActions": ["..."],
  "resumeInstructions": "..."
}
```

## Resume Command

User can say "continue" or `/continue` in any project directory to resume work.
