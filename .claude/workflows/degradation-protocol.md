# Degradation Protocol

**Graceful fallbacks when system resources are constrained.**

---

## Purpose

This workflow defines how to:
1. Detect resource constraints
2. Automatically reduce capabilities gracefully
3. Maintain core functionality under pressure
4. Recover when resources become available

---

## Constraint Detection

### Resource Monitors

| Resource | Warning Threshold | Critical Threshold | Check Method |
|----------|-------------------|-------------------|--------------|
| Context window | 70% | 85% | Token count estimate |
| Rate limits | 3 hits/hour | 5 hits/hour | Memory counter |
| Agent count | 5 active | 8 active | Namespace query |
| Memory ops | 50/min | 100/min | Operation counter |
| Task queue | 10 pending | 20 pending | Queue depth |

### Detection Logic

```javascript
async function checkResourceHealth() {
  const health = {
    context: await estimateContextUsage(),
    rateLimits: await getRateLimitHits(),
    activeAgents: await countActiveAgents(),
    memoryOps: await getMemoryOpsRate(),
    taskQueue: await getQueueDepth()
  }

  // Determine degradation level
  let level = "normal"

  if (health.context > 85 || health.rateLimits > 5 || health.activeAgents > 8) {
    level = "critical"
  } else if (health.context > 70 || health.rateLimits > 3 || health.activeAgents > 5) {
    level = "warning"
  }

  return { health, level }
}
```

---

## Degradation Levels

### Level 0: Normal Operation

**Conditions:** All resources within normal bounds

**Capabilities:**
- Full multi-agent coordination
- Parallel task execution
- Real-time progress monitoring
- Full context loading
- All workflows available

### Level 1: Warning (Yellow)

**Conditions:** Any resource at warning threshold

**Automatic Actions:**
- Reduce agent spawn rate
- Batch memory operations
- Load only essential context
- Defer non-critical tasks

**Disabled:**
- Parallel swarm spawning
- Full workflow loading
- Verbose logging

### Level 2: Critical (Red)

**Conditions:** Any resource at critical threshold

**Automatic Actions:**
- Single agent mode only
- Minimal context loading
- Essential operations only
- Aggressive memory cleanup

**Disabled:**
- Multi-agent coordination
- Swarm operations
- Background monitoring
- Learning/metrics collection

### Level 3: Emergency (Black)

**Conditions:** System unresponsive or context exhausted

**Automatic Actions:**
- Save all state to recovery namespace
- Checkpoint current work
- Notify user of constraint
- Prepare for session restart

---

## Degradation Rules

### Context Window Degradation

| Level | Max Context | Strategy |
|-------|-------------|----------|
| Normal | 100% | Full loading |
| Warning | 70% | Load hub + one workflow only |
| Critical | 50% | Hub only, minimal prompts |
| Emergency | 30% | Essential instructions only |

**Implementation:**
```
On Warning:
  - Stop loading full workflow files
  - Use system-hub.md for routing only
  - Summarize rather than include full context

On Critical:
  - Load only system-hub.md
  - Use single-line prompts to agents
  - No history or learning data

On Emergency:
  - Checkpoint all state
  - Clear non-essential context
  - Restart conversation if needed
```

### Agent Degradation

| Level | Max Agents | Coordination |
|-------|------------|--------------|
| Normal | 8 | Full swarm support |
| Warning | 4 | Sequential only |
| Critical | 1 | Solo agent |
| Emergency | 0 | Direct execution |

**Implementation:**
```
On Warning:
  - No parallel agent spawning
  - Queue additional agent requests
  - Reduce heartbeat frequency

On Critical:
  - Complete current agent tasks
  - Don't spawn new agents
  - Fall back to direct execution

On Emergency:
  - Gracefully stop all agents
  - Save agent state to recovery
  - Continue without agents
```

### Memory Operations Degradation

| Level | Ops Rate | Strategy |
|-------|----------|----------|
| Normal | Unlimited | Real-time updates |
| Warning | 30/min | Batch writes |
| Critical | 10/min | Essential only |
| Emergency | 5/min | Recovery saves only |

**Implementation:**
```
On Warning:
  - Batch status updates (every 60s instead of 30s)
  - Cache reads locally
  - Defer metric collection

On Critical:
  - Only checkpoint operations
  - No learning/metrics
  - Essential state only

On Emergency:
  - Save recovery checkpoint only
  - No other memory operations
```

---

## Fallback Strategies

### Agent → Direct Execution

When agents unavailable, execute directly:

```markdown
## Direct Execution Mode

Instead of spawning Tyler-TypeScript:
1. Use typescript-pro prompts directly
2. Execute sequentially in main context
3. Apply same patterns manually

Key prompts to use:
- "Fix TypeScript errors, preserve functionality, run tsc --noEmit"
- "Refactor for type safety, check all imports"
```

### Swarm → Sequential

When swarms unavailable, run sequentially:

```markdown
## Sequential Mode

Instead of parallel swarm:
1. Execute agent 1 task completely
2. Pass results to agent 2
3. Continue chain until complete

Overhead: ~2x duration but same results
```

### Multi-File → Single File

When context constrained, work file-by-file:

```markdown
## Single File Mode

Instead of loading all related files:
1. Work on one file at a time
2. Save changes before moving to next
3. Re-read files as needed

Trade-off: Slower but maintains quality
```

---

## Recovery Protocol

### Entering Degradation

```javascript
async function enterDegradation(level) {
  // Save current state
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "recovery",
    key: "pre-degradation-state",
    value: {
      level: level,
      timestamp: new Date().toISOString(),
      activeAgents: await getActiveAgents(),
      pendingTasks: await getPendingTasks(),
      currentContext: "summarized context here"
    },
    ttl: 3600
  })

  // Apply degradation rules
  switch(level) {
    case "warning":
      await applyWarningRestrictions()
      break
    case "critical":
      await applyCriticalRestrictions()
      break
    case "emergency":
      await applyEmergencyProtocol()
      break
  }

  // Notify user if critical or emergency
  if (level !== "warning") {
    console.log(`Resource constraint detected. Operating in ${level} mode.`)
  }
}
```

### Exiting Degradation

```javascript
async function exitDegradation() {
  // Check if resources recovered
  const { level } = await checkResourceHealth()

  if (level === "normal") {
    // Restore full capabilities
    await mcp__claude-flow__memory_usage({
      action: "delete",
      namespace: "recovery",
      key: "pre-degradation-state"
    })

    // Resume any paused operations
    await resumePausedTasks()

    console.log("Resources recovered. Full capabilities restored.")
  }
}
```

---

## User Communication

### Warning Level

```
System operating with reduced capabilities due to resource constraints.
Multi-agent tasks may be slower. Core functionality unaffected.
```

### Critical Level

```
⚠️ Resource Constraint Active

Operating in single-agent mode due to:
- High context usage
- Rate limit pressure

Current task will complete. Complex multi-agent workflows paused.
```

### Emergency Level

```
🔴 Emergency Mode

System resources critically constrained.
Current work has been checkpointed.

Options:
[1] Start new conversation (recommended)
[2] Continue with minimal capabilities
[3] Save state and exit
```

---

## Automatic Behaviors

### On Session Start

1. Check resource health
2. If degraded, load minimal context
3. Notify user of any restrictions

### During Operation

1. Monitor resource usage continuously
2. Adjust degradation level as needed
3. Batch operations to reduce overhead

### On Task Completion

1. Check if constraints have eased
2. Attempt to exit degradation
3. Resume normal operations if possible

---

## Memory Keys

| Key | Namespace | Purpose |
|-----|-----------|---------|
| `degradation-level` | config | Current degradation state |
| `pre-degradation-state` | recovery | State before degradation |
| `paused-tasks` | recovery | Tasks paused due to constraints |
| `resource-health` | metrics | Latest health check |

---

## Integration Points

1. **Orchestrator Core** - Check degradation before spawning agents
2. **Progress Monitor** - Reduce heartbeat frequency in degradation
3. **Agent Invocation** - Respect agent limits
4. **Swarm Init** - Fall back to sequential in degradation
5. **Context Loading** - Load minimal context in degradation
