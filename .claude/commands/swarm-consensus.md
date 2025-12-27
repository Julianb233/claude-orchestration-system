# Swarm Consensus Vote

Initiate a consensus vote among agents for important decisions.

## Instructions

When the user runs `/swarm-consensus [proposal]`:

1. **Determine the appropriate protocol**:
   - **simple_majority**: Non-critical decisions, preferences (51%)
   - **supermajority**: Architectural decisions, breaking changes (67%)
   - **unanimous**: Production deploys, security-critical (100%)
   - **expert_weighted**: Technical decisions (experts have 3x weight)
   - **lazy_consensus**: Low-risk, routine (approved unless blocked)

2. **Create the proposal**:
   ```bash
   /root/scripts/swarm-orchestrator.sh consensus "{proposal}" {protocol}
   ```

3. **Collect and display votes** from active agents

4. **Announce the result**:
   - APPROVED: Threshold met
   - REJECTED: Threshold not met
   - NO_QUORUM: Not enough participants

## Usage Examples

- `/swarm-consensus "Deploy to production"` - Uses simple_majority
- `/swarm-consensus "Change database schema" supermajority`
- `/swarm-consensus "Enable new security policy" unanimous`

## Protocol Details

| Protocol | Quorum | Threshold | Timeout |
|----------|--------|-----------|---------|
| simple_majority | 50% | 51% | 60s |
| supermajority | 67% | 67% | 120s |
| unanimous | 100% | 100% | 300s |
| expert_weighted | 50% | 60% | 90s |
| lazy_consensus | N/A | N/A | 300s |

## Best Practices

- Use **unanimous** for production deployments
- Use **supermajority** for breaking changes
- Use **simple_majority** for routine decisions
- Use **expert_weighted** when domain expertise matters
