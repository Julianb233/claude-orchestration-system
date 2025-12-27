# Start Claude Hive

Spawn multiple autonomous Claude Code workers that share memory context.

## Usage
```
/cf-hive-start [num_workers]
```

## What It Does
1. Initializes shared memory context in Claude Flow
2. Spawns N parallel Claude Code instances with `--dangerously-skip-permissions`
3. Each worker gets context from the session namespace
4. Workers operate autonomously and sync results back

## Execute
```bash
/root/scripts/claude-hive.sh start [num_workers]
```

Default: 3 workers

## Workers Will
- Share memory through Claude Flow
- Work on tasks from the queue
- Sync results to `results` namespace
- Operate without user intervention

## Monitor
```bash
/root/scripts/claude-hive.sh status
/root/scripts/claude-hive.sh logs
```
