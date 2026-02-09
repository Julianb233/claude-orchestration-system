# Claude Flow Memory Persist

Enable cross-session persistence for memory data.

## Usage
```
/cf-memory-persist [sessionId]
```

## Instructions

Use the `mcp__claude-flow__memory_persist` tool:

1. **Optional Parameters:**
   - `sessionId`: Identifier for the session to persist

## Purpose

Ensures memory data survives across Claude sessions. Use this before ending a session to preserve important context.

## Example

```
Persist current session:
- sessionId: "project-alpha-session"
```

Execute: `mcp__claude-flow__memory_persist` with sessionId="project-alpha-session"
