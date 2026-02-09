# Claude Flow Memory Restore

Restore memory from a backup.

## Usage
```
/cf-memory-restore [backupPath]
```

## Instructions

Use the `mcp__claude-flow__memory_restore` tool:

1. **Required Parameters:**
   - `backupPath`: Path to the backup file to restore

## Warning

This will overwrite current memory data with the backup contents.

## Example

```
Restore from backup:
- backupPath: "/root/.claude-flow/backups/memory-2025-12-16.bak"
```

Execute: `mcp__claude-flow__memory_restore` with backupPath="..."
