# Claude Flow Cache Management

Manage the coordination cache.

## Usage
```
/cf-cache-manage [action] [key]
```

## Instructions

Use the `mcp__claude-flow__cache_manage` tool:

1. **Required Parameters:**
   - `action`: Operation to perform

2. **Optional Parameters:**
   - `key`: Specific cache key (for targeted operations)

## Actions

- `stats` - Get cache statistics
- `clear` - Clear all cache entries
- `get` - Get specific cache entry
- `delete` - Delete specific cache entry

## Example

```
Get cache statistics:
- action: "stats"
```

Execute: `mcp__claude-flow__cache_manage` with action="stats"
