# Continue Command

Resume work on the current project from where we left off.

## How It Works

When user says "continue" or uses `/continue`:

1. **Check Project State File**: Look for `.claude-state.json` in current working directory
2. **Check Claude Flow Memory**: Query `mcp__claude-flow__memory_usage` for project-specific context
3. **Load and Resume**: Read the state and continue exactly where we left off

## Project State File Location

Each project has its own state file:
```
/path/to/project/.claude-state.json
```

## State File Format

```json
{
  "version": "1.0",
  "project": "project-name",
  "lastUpdated": "2025-12-16T22:00:00Z",
  "expiresAt": "2025-12-20T22:00:00Z",
  "currentWork": {
    "description": "What we're working on",
    "status": "in_progress",
    "startedAt": "2025-12-16T21:00:00Z"
  },
  "tasks": [
    {"id": 1, "description": "Task 1", "status": "completed"},
    {"id": 2, "description": "Task 2", "status": "in_progress"},
    {"id": 3, "description": "Task 3", "status": "pending"}
  ],
  "context": {
    "keyFiles": ["file1.ts", "file2.ts"],
    "decisions": ["Decision 1", "Decision 2"],
    "findings": ["Finding 1", "Finding 2"],
    "blockers": []
  },
  "nextActions": [
    "Action 1",
    "Action 2"
  ],
  "resumeInstructions": "Natural language description of how to continue"
}
```

## Instructions

When this command is invoked:

1. **Get Current Directory**: Determine which project we're in
2. **Read State File**: Load `.claude-state.json` if it exists
3. **Check Expiry**: If `expiresAt` is past, warn user state may be stale
4. **Display Context**: Show what was being worked on
5. **Load Tasks**: Restore the TodoWrite list from the tasks array
6. **Resume Work**: Continue with the next pending action

## Example Output

```
=== Resuming Project: PieDrive-AI ===

Last worked: 2 hours ago (2025-12-16T20:00:00Z)
Status: In Progress

Current Work:
  Pipedrive API endpoint matching

Progress:
  [x] Task 1: Map authentication endpoints
  [x] Task 2: Map user management endpoints
  [ ] Task 3: Map drive integration endpoints  <-- CURRENT
  [ ] Task 4: Verify all endpoints work
  [ ] Task 5: Update documentation

Key Context:
  - Files: API_ROUTES_REFERENCE.md, api-config.ts
  - Decision: Using REST over GraphQL
  - Finding: 18 endpoints need matching

Next Action:
  Map the /api/drive/* endpoints in api-config.ts

Resuming...
```

## Auto-Save Behavior

The state file should be automatically updated:
- When TodoWrite is called (sync tasks)
- When significant progress is made
- When context/decisions change
- On session end or checkpoint

## TTL (Time-To-Live)

Default expiry: **4 days** from last update

If state is expired:
- Warn user: "Project state is X days old and may be stale"
- Offer to continue anyway or start fresh
