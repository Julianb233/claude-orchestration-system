# Claude Flow Context Restore

Restore execution context from a snapshot.

## Usage
```
/cf-context-restore [snapshotId]
```

## Instructions

Use the `mcp__claude-flow__context_restore` tool:

1. **Required Parameters:**
   - `snapshotId`: ID of the snapshot to restore

## Purpose

Restores execution state to a previous snapshot point. Use after creating snapshots with `/cf-state-snapshot`.

## Example

```
Restore from snapshot:
- snapshotId: "snapshot-12345"
```

Execute: `mcp__claude-flow__context_restore` with snapshotId="snapshot-12345"
