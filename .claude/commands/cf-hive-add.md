# Add Worker to Hive

Add an additional autonomous worker with a specific task.

## Usage
```
/cf-hive-add [task_description]
```

## Execute
```bash
/root/scripts/claude-hive.sh add "Your task description here"
```

## Example
```bash
/root/scripts/claude-hive.sh add "Review and fix TypeScript errors in the project"
```

The new worker will:
- Inherit shared memory context
- Work on the specified task
- Sync results when complete
