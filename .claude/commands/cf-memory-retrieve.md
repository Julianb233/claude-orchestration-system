# Claude Flow Memory Retrieve

Retrieve data from Claude Flow's persistent memory system.

## Usage
```
/cf-memory-retrieve [key] [namespace]
```

## Instructions

Use the `mcp__claude-flow__memory_usage` tool with action "retrieve":

1. **Required Parameters:**
   - `action`: "retrieve"
   - `key`: The key of the stored data

2. **Optional Parameters:**
   - `namespace`: The namespace where data is stored (default: "default")

## Example

```
Retrieve project context:
- key: "project_state"
- namespace: "my-project"
```

Execute: `mcp__claude-flow__memory_usage` with action="retrieve"
