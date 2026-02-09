# Swarm Analytics Dashboard

Display comprehensive analytics for the active agent swarm.

## Instructions

When the user runs `/swarm-analytics`:

1. **Run the analytics command**:
   ```bash
   /root/scripts/swarm-orchestrator.sh analytics
   ```

2. **Interpret the metrics** and provide insights:
   - Agent utilization and health
   - Task throughput and success rates
   - Queue depth and bottlenecks
   - Learning progress and pattern recognition

3. **Make recommendations** based on the data:
   - If success rate < 80%: Investigate failures
   - If queue depth > 5: Consider scaling up
   - If load imbalanced: Suggest rebalancing
   - If agents idle: Consider scaling down

## Metrics Displayed

### Agents
- Active/Total count
- Breakdown by agent type
- Load distribution

### Tasks
- Pending, Assigned, Completed, Failed counts
- Success rate percentage
- Throughput rate

### Swarm
- Current topology
- Swarm status
- Time since creation

### Learning
- Patterns learned
- Last sync time
- Knowledge reuse rate

## Shortcuts

- `/analytics` - Alias for `/swarm-analytics`
