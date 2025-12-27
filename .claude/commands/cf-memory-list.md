# Claude Flow Memory List

List all entries in a memory namespace.

## Usage
```
/cf-memory-list [namespace]
```

## Instructions

Use the `mcp__claude-flow__memory_usage` tool with action "list":

1. **Required Parameters:**
   - `action`: "list"

2. **Optional Parameters:**
   - `namespace`: The namespace to list (default: "default")

## Example

```
List all entries in config namespace:
- namespace: "config"
```

Execute: `mcp__claude-flow__memory_usage` with action="list", namespace="config"
