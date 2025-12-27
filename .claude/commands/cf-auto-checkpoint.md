# Auto-Checkpoint System

This command configures automatic checkpointing for workflow recovery.

## Auto-Checkpoint Triggers

The system should automatically save checkpoints:

1. **Before Multi-Agent Tasks**: When spawning a swarm or launching Task agents
2. **Every 10 Minutes**: During long-running workflows
3. **On Significant Progress**: After completing a major step/task
4. **Before Context Compaction**: When conversation is getting long

## Implementation

When you start any multi-agent workflow or complex task:

1. **Create initial checkpoint** with task description and expected steps
2. **Store to memory**: `mcp__claude-flow__memory_usage(action="store", namespace="recovery", key="workflow-checkpoint-latest", value="{checkpoint_json}")`
3. **Log to file**: Append to `/root/.claude-flow/recovery/checkpoints.jsonl`

## Checkpoint Format for Multi-Agent Workflows

```json
{
  "checkpointId": "cp_{timestamp}",
  "type": "multi-agent",
  "swarmConfig": {
    "topology": "hierarchical|mesh|star",
    "agents": [{"type": "...", "role": "..."}],
    "swarmId": "swarm_xxx"
  },
  "taskQueue": [
    {"id": 1, "description": "...", "status": "pending|in_progress|complete"},
    {"id": 2, "description": "...", "status": "pending"}
  ],
  "completedResults": [
    {"taskId": 1, "result": "...", "timestamp": "..."}
  ],
  "currentAgent": {
    "id": "agent_xxx",
    "task": "...",
    "progress": "..."
  },
  "sharedContext": {
    "project": "...",
    "keyFindings": ["..."],
    "decisions": ["..."]
  }
}
```

## Self-Healing Recovery

If a checkpoint exists on session start:
1. Check `workflow-checkpoint-latest` in memory
2. If found and < 1 hour old, prompt: "Found interrupted workflow: {description}. Resume? [Y/n]"
3. If confirmed, execute `/cf-recover` automatically

## Usage

To enable auto-checkpointing for current session:
```
/cf-auto-checkpoint enable
```

To disable:
```
/cf-auto-checkpoint disable
```

To check status:
```
/cf-auto-checkpoint status
```
