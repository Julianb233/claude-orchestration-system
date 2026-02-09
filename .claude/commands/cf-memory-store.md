# Claude Flow Memory Store

Store data in Claude Flow's persistent memory system.

## Usage
```
/cf-memory-store [key] [value] [namespace]
```

## Instructions

Use the `mcp__claude-flow__memory_usage` tool with action "store" to save data:

1. **Required Parameters:**
   - `action`: "store"
   - `key`: Unique identifier for the data
   - `value`: JSON string of data to store

2. **Optional Parameters:**
   - `namespace`: Isolate data by context (default: "default")
   - `ttl`: Time-to-live in seconds

## Example

```
Store project context:
- key: "project_state"
- value: {"phase": "development", "tasks_completed": 5}
- namespace: "my-project"
- ttl: 86400 (24 hours)
```

Execute: `mcp__claude-flow__memory_usage` with action="store"
