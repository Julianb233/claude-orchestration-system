# Claude Flow Memory Delete

Delete entries from Claude Flow memory.

## Usage
```
/cf-memory-delete [key] [namespace]
```

## Instructions

Use the `mcp__claude-flow__memory_usage` tool with action "delete":

1. **Required Parameters:**
   - `action`: "delete"
   - `key`: The key to delete

2. **Optional Parameters:**
   - `namespace`: The namespace containing the key (default: "default")

## Example

```
Delete old project state:
- key: "old_project_state"
- namespace: "archived"
```

Execute: `mcp__claude-flow__memory_usage` with action="delete"
