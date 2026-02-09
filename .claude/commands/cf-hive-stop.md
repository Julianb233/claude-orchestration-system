# Stop Claude Hive

Stop all autonomous Claude workers.

## Usage
```
/cf-hive-stop
```

## Execute
```bash
/root/scripts/claude-hive.sh stop
```

## What It Does
1. Finds all worker PIDs
2. Gracefully terminates each worker
3. Cleans up PID files
4. Workers will sync final state before stopping
