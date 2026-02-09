# Initialize Agent Swarm

Initialize a new agent swarm with specified topology and configuration.

## Instructions

When the user runs `/swarm-init`, follow these steps:

1. **Ask for configuration** (if not provided):
   - Topology: hierarchical, mesh, star, ring, or swarm
   - Maximum agents: 1-10 (default: 5)
   - Task type: what kind of work the swarm will do

2. **Initialize the swarm**:
   ```bash
   /root/scripts/swarm-orchestrator.sh init {topology} {max_agents}
   ```

3. **Select optimal topology based on task**:
   - **hierarchical**: Complex multi-phase tasks with dependencies
   - **mesh**: Collaborative research, parallel independent work
   - **star**: Multi-domain tasks needing different expertise
   - **ring**: Pipeline processing, sequential refinement
   - **swarm**: Large-scale exploration, fuzzy requirements

4. **Spawn initial team** based on task requirements:
   ```bash
   /root/scripts/swarm-orchestrator.sh spawn-team {task_type} {team_size}
   ```

5. **Show status**:
   ```bash
   /root/scripts/swarm-orchestrator.sh status
   ```

## Usage Examples

- `/swarm-init` - Interactive initialization
- `/swarm-init hierarchical 5` - Hierarchical swarm with 5 agents
- `/swarm-init mesh` - Mesh topology (default agents)

## Related Commands

- `/swarm-status` - Check swarm status
- `/swarm-analytics` - View performance dashboard
- `/swarm-optimize` - Run optimization cycle
- `/swarm-destroy` - Destroy active swarm
