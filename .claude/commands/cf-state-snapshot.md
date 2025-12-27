# Claude Flow State Snapshot

Create a snapshot of current execution state.

## Usage
```
/cf-state-snapshot [name]
```

## Instructions

Use the `mcp__claude-flow__state_snapshot` tool:

1. **Optional Parameters:**
   - `name`: Descriptive name for the snapshot

## Purpose

Captures the complete execution state at a point in time. Useful for:
- Checkpointing during complex tasks
- Creating restore points before risky operations
- Debugging state-related issues

## Example

```
Create named snapshot:
- name: "pre-refactor-checkpoint"
```

Execute: `mcp__claude-flow__state_snapshot` with name="pre-refactor-checkpoint"
