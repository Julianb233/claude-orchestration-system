# Claude Flow Memory Backup

Create backups of memory stores.

## Usage
```
/cf-memory-backup [path]
```

## Instructions

Use the `mcp__claude-flow__memory_backup` tool:

1. **Optional Parameters:**
   - `path`: Destination path for the backup file

## Purpose

Creates a snapshot of all memory data for disaster recovery or migration.

## Example

```
Backup memory to file:
- path: "/root/.claude-flow/backups/memory-2025-12-16.bak"
```

Execute: `mcp__claude-flow__memory_backup` with path="/root/.claude-flow/backups/memory-backup.bak"
