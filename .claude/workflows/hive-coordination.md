# Claude Hive: Multi-Terminal Coordination

**Spawn multiple Claude Code instances that work in parallel, share memory, and operate autonomously.**

## Quick Start

```bash
# Start 3 autonomous workers
/root/scripts/claude-hive.sh start 3

# Check status
/root/scripts/claude-hive.sh status

# Add another worker with specific task
/root/scripts/claude-hive.sh add "Fix all TypeScript errors"

# Stop all workers
/root/scripts/claude-hive.sh stop
```

## How It Works

1. **Spawns** multiple Claude Code terminals with `--dangerously-skip-permissions`
2. **Shares** memory context via Claude Flow (all workers read/write same memory)
3. **Distributes** tasks from `/root/.claude-flow/task-queue.txt`
4. **Syncs** results back to shared memory when complete
5. **Operates** without any user intervention

## Memory Sharing Between Workers

All workers share these namespaces:
- `session` - Current work context (read by all)
- `results` - Completed work (written by workers)
- `hive` - Hive coordination status
- `workers` - Individual worker status

## Context Preservation on Compression

**CRITICAL:** Before any memory compression, the system automatically:
1. Stores full conversation context to `session` namespace
2. Preserves key findings and state
3. Creates recovery snapshot
4. Workers can restore context from memory after compression

## Slash Commands

| Command | What It Does |
|---------|--------------|
| `/cf-hive-start` | Start hive with N workers |
| `/cf-hive-status` | Check all worker status |
| `/cf-hive-stop` | Stop all workers |
| `/cf-hive-add` | Add worker with specific task |

## Task Queue

Edit `/root/.claude-flow/task-queue.txt` to set tasks for workers:
```
Continue working on pending development tasks
Review code quality and fix any issues
Run tests and fix any failures
Update documentation for recent changes
```

## Automation Rules (Active)

| Rule | Trigger | Action |
|------|---------|--------|
| auto-spawn-workers | Task queue > 3 items | Spawn additional workers |
| auto-distribute-tasks | Complex task detected | Parallel execution |
| sync-memory-on-complete | Worker finishes | Sync to shared memory |
| context-preservation | Before compression | Store full context |

## Monitoring

```bash
# Watch all worker logs
tail -f /root/.claude-flow/workers/*.log

# Check specific worker
/root/scripts/claude-hive.sh logs worker-id

# Memory status across all workers
mcp__claude-flow__memory_usage(action="list", namespace="workers")
```

## Fully Autonomous Operation

Once started, the hive:
- **Self-manages** - workers coordinate through shared memory
- **Self-heals** - failed workers can be auto-restarted
- **Preserves context** - all work saved to persistent memory
- **Reports results** - findings synced to `results` namespace
- **No babysitting** - works while you sleep
