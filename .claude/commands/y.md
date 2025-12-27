# Execute Recommended Action

Execute the recommended [1] action from the last `/next` or prediction prompt.

## Instructions

1. Check session memory for last suggested actions:
   ```
   mcp__claude-flow__memory_usage(action="retrieve", namespace="session", key="pending-suggestions")
   ```

2. If suggestions exist, execute option [1]

3. If no pending suggestions, run `/next` first to generate them

4. After execution, immediately show next predicted action
