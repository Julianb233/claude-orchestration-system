# Claude Flow Memory Search

Search memory entries using patterns.

## Usage
```
/cf-memory-search [pattern] [namespace] [limit]
```

## Instructions

Use the `mcp__claude-flow__memory_search` tool:

1. **Required Parameters:**
   - `pattern`: Search pattern (supports wildcards like *)

2. **Optional Parameters:**
   - `namespace`: Limit search to specific namespace
   - `limit`: Maximum results to return (default: 10)

## Example

```
Search for all project-related entries:
- pattern: "project*"
- limit: 20
```

Execute: `mcp__claude-flow__memory_search` with pattern="project*", limit=20
