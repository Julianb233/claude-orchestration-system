# Claude Flow Memory Analytics

Analyze memory usage and get optimization recommendations.

## Usage
```
/cf-memory-analytics [timeframe]
```

## Instructions

Use the `mcp__claude-flow__memory_analytics` tool:

1. **Optional Parameters:**
   - `timeframe`: Analysis period (e.g., "24h", "7d", "30d")

## Output

- Current memory usage (RSS, heap)
- Usage percentage
- Optimization recommendations

## Example

```
Get 24-hour analytics:
- timeframe: "24h"
```

Execute: `mcp__claude-flow__memory_analytics` with timeframe="24h"
