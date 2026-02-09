# Claude Flow Optimization Guide

Complete guide to running Claude Flow efficiently and autonomously.

## Current Performance Metrics

```
Tasks Executed (24h):    172
Success Rate:            81.2%
Avg Execution Time:      11.8s
Agents Spawned:          45
Memory Efficiency:       83.9%
Neural Events:           46
```

## Active Automation Rules

| Rule | Trigger | Action |
|------|---------|--------|
| auto-snapshot-on-task | task_start | state_snapshot |
| auto-persist-on-complete | task_complete | memory_persist |
| auto-compress-hourly | every 1 hour | memory_compress |
| auto-backup-daily | every 24 hours | memory_backup |

## Active Workflows

### 1. session-auto-init
**Triggers:** session_start, clear_command
```
Steps:
1. memory_analytics (24h)
2. memory_list (session namespace)
3. cache_stats
4. health_check (memory, cache, swarm)
```

### 2. auto-persist-checkpoint
**Triggers:** context_large, task_complete, interval_30min
```
Steps:
1. state_snapshot (auto-checkpoint)
2. memory_compress (session)
3. memory_persist
```

## Trained Neural Models

| Model | Type | Accuracy | Purpose |
|-------|------|----------|---------|
| coordination | Pattern | 68.1% | Session/task management |
| optimization | Pattern | 68.8% | Memory/performance tuning |

## Running Claude Flow in Background

### Option 1: CLI Background Mode
```bash
npx claude-flow@alpha mcp start &
```

### Option 2: PM2 Process Manager
```bash
pm2 start "npx claude-flow@alpha mcp start" --name claude-flow
pm2 save
```

### Option 3: Systemd Service
```bash
# /etc/systemd/system/claude-flow.service
[Unit]
Description=Claude Flow MCP Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root
ExecStart=/usr/bin/npx claude-flow@alpha mcp start
Restart=always

[Install]
WantedBy=multi-user.target
```

## Optimization Commands

### Memory Optimization
```
mcp__claude-flow__memory_compress(namespace="session")
mcp__claude-flow__memory_analytics(timeframe="24h")
mcp__claude-flow__bottleneck_analyze(metrics=["memory","cpu"])
```

### Performance Optimization
```
mcp__claude-flow__wasm_optimize(operation="all")
mcp__claude-flow__topology_optimize()
mcp__claude-flow__performance_report(format="detailed")
```

### Neural Training (improves over time)
```
mcp__claude-flow__neural_train(pattern_type="coordination", epochs=100)
mcp__claude-flow__neural_train(pattern_type="optimization", epochs=100)
mcp__claude-flow__neural_patterns(action="analyze")
```

## Swarm Optimization

### Parallel Agent Spawning (10-20x faster)
```
mcp__claude-flow__agents_spawn_parallel(
  agents=[
    {"type": "researcher", "name": "r1"},
    {"type": "coder", "name": "c1"},
    {"type": "tester", "name": "t1"}
  ],
  maxConcurrency=5
)
```

### Auto-Scale Based on Load
```
mcp__claude-flow__swarm_scale(targetSize=10)
mcp__claude-flow__load_balance(tasks=[...])
```

## Key Optimization Tips

1. **Memory:** Run `memory_compress` when usage > 80%
2. **Patterns:** Train neural models weekly for better predictions
3. **Topology:** Use `topology_optimize` before large swarm ops
4. **Backups:** Automated daily, but run manual before major changes
5. **WASM:** Enable SIMD optimization for neural operations

## Monitoring Commands

```
/cf-memory-analytics     - Memory usage analysis
mcp__claude-flow__health_check - System health
mcp__claude-flow__swarm_monitor - Real-time swarm status
mcp__claude-flow__performance_report - Full metrics
```
