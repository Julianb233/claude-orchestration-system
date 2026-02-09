# Claude Flow Memory System - Master Reference

Complete reference for Claude Flow's persistent memory capabilities.

## Quick Commands

| Command | Purpose |
|---------|---------|
| `/cf-memory-store` | Store data with key, value, namespace, TTL |
| `/cf-memory-retrieve` | Fetch data by key |
| `/cf-memory-list` | List all entries in a namespace |
| `/cf-memory-search` | Pattern-based search |
| `/cf-memory-delete` | Remove entries |
| `/cf-memory-persist` | Enable cross-session persistence |
| `/cf-memory-namespace` | Manage namespaces |
| `/cf-memory-backup` | Create backups |
| `/cf-memory-restore` | Restore from backup |
| `/cf-memory-compress` | Optimize storage |
| `/cf-memory-sync` | Sync across instances |
| `/cf-memory-analytics` | Usage analysis |
| `/cf-state-snapshot` | Capture execution state |
| `/cf-context-restore` | Restore from snapshot |
| `/cf-cache-manage` | Manage coordination cache |

## MCP Tools Reference

### Core Memory Operations
```
mcp__claude-flow__memory_usage
  - action: store | retrieve | list | delete | search
  - key: string
  - value: string (JSON)
  - namespace: string (default: "default")
  - ttl: number (seconds)
```

### Search
```
mcp__claude-flow__memory_search
  - pattern: string (wildcards supported)
  - namespace: string
  - limit: number (default: 10)
```

### Persistence & State
```
mcp__claude-flow__memory_persist
  - sessionId: string

mcp__claude-flow__state_snapshot
  - name: string

mcp__claude-flow__context_restore
  - snapshotId: string
```

### Namespace Management
```
mcp__claude-flow__memory_namespace
  - namespace: string
  - action: list | create | delete
```

### Backup & Recovery
```
mcp__claude-flow__memory_backup
  - path: string

mcp__claude-flow__memory_restore
  - backupPath: string
```

### Optimization
```
mcp__claude-flow__memory_compress
  - namespace: string

mcp__claude-flow__memory_sync
  - target: string

mcp__claude-flow__memory_analytics
  - timeframe: string (24h, 7d, 30d)
```

### Cache
```
mcp__claude-flow__cache_manage
  - action: stats | clear | get | delete
  - key: string
```

## Storage Backend

- **Type:** SQLite (persistent)
- **Location:** `/root/.claude-flow/`
- **Format:** Key-value with JSON values

## Best Practices

1. **Use namespaces** to isolate project data
2. **Set TTL** for temporary data to auto-cleanup
3. **Create snapshots** before major operations
4. **Run analytics** periodically to monitor usage
5. **Backup regularly** for disaster recovery
