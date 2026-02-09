# Claude Flow Memory & Cache Auto-Manager

Automatically manages memory persistence, caching, and state snapshots during Claude sessions.

## Auto-Invocation Triggers

This skill should be automatically invoked when:
1. **Session Start** - Load previous session context
2. **Before Complex Tasks** - Create state snapshot
3. **After Task Completion** - Persist important findings
4. **Before Context Compaction** - Save critical state
5. **On Error/Recovery** - Restore from last snapshot

## Automatic Actions

### 1. Session Initialization
```
Execute on session start:
- mcp__claude-flow__memory_usage(action="list", namespace="session")
- mcp__claude-flow__cache_manage(action="stats")
- mcp__claude-flow__memory_analytics(timeframe="24h")
```

### 2. Pre-Task Snapshot
```
Execute before complex operations:
- mcp__claude-flow__state_snapshot(name="pre-task-{timestamp}")
- mcp__claude-flow__memory_usage(action="store", key="current_task", value="{task_description}", namespace="session")
```

### 3. Post-Task Persistence
```
Execute after completing tasks:
- mcp__claude-flow__memory_usage(action="store", key="task_result_{id}", value="{result}", namespace="results")
- mcp__claude-flow__memory_persist(sessionId="current")
```

### 4. Context Preservation
```
Execute when context is getting large:
- mcp__claude-flow__memory_compress(namespace="session")
- mcp__claude-flow__state_snapshot(name="context-checkpoint")
- mcp__claude-flow__memory_usage(action="store", key="context_summary", value="{summary}", namespace="session")
```

### 5. Error Recovery
```
Execute on errors:
- mcp__claude-flow__memory_usage(action="retrieve", key="last_good_state", namespace="recovery")
- mcp__claude-flow__context_restore(snapshotId="last-checkpoint")
```

## Memory Namespaces

| Namespace | Purpose | TTL |
|-----------|---------|-----|
| `session` | Current session state | 24h |
| `results` | Task completion results | 7d |
| `recovery` | Error recovery checkpoints | 1h |
| `projects` | Project-specific context | 30d |
| `config` | User preferences | Permanent |

## Cache Strategy

- **Hot data**: Recent task context, current project state
- **Warm data**: Session history, task results
- **Cold data**: Archived projects, old snapshots

## MCP Tools Used

```
mcp__claude-flow__memory_usage      - Core CRUD operations
mcp__claude-flow__memory_search     - Pattern search
mcp__claude-flow__memory_persist    - Cross-session persistence
mcp__claude-flow__memory_namespace  - Namespace management
mcp__claude-flow__memory_compress   - Storage optimization
mcp__claude-flow__memory_analytics  - Usage monitoring
mcp__claude-flow__state_snapshot    - State capture
mcp__claude-flow__context_restore   - State restoration
mcp__claude-flow__cache_manage      - Cache operations
```
