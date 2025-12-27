# Context Monitoring Workflow

**Agent:** Cassie-ContextCoach
**Purpose:** Prevent conversation freezing through proactive monitoring

---

## Auto-Load Triggers

This workflow loads when:
- Session starts
- Task tool spawns an agent
- Context estimate exceeds 60%
- Every 5 minutes when agents are active

---

## Health Check Protocol

### 1. Agent Budget Check

```javascript
// Retrieve current budget
const budget = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "context-health",
  key: "agent-budget"
});

// Initialize if not exists
if (!budget) {
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "context-health",
    key: "agent-budget",
    value: {
      current: 0,
      softLimit: 5,
      hardLimit: 8,
      activeAgents: []
    }
  });
}

// Check thresholds
if (budget.current >= budget.hardLimit) {
  alert("BLOCKED: Agent budget exceeded");
} else if (budget.current >= budget.softLimit) {
  warn("Agent budget approaching limit");
}
```

### 2. Context Estimation

Estimate context usage based on:
- Message count in conversation
- Average tokens per message (~500)
- Tool calls and responses (~1000 each)
- File contents read (~2000 per file)

```javascript
const estimate = {
  messages: messageCount * 500,
  toolCalls: toolCallCount * 1000,
  fileReads: fileReadCount * 2000,
  total: messages + toolCalls + fileReads,
  percent: (total / 100000) * 100  // Assuming ~100k context
};

await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "context-health",
  key: "context-estimate",
  value: estimate,
  ttl: 300
});
```

### 3. Connection Health

Check background agents and hive workers:

```javascript
const connections = await mcp__claude-flow__memory_usage({
  action: "list",
  namespace: "agents"
});

const now = Date.now();
const staleThreshold = 600000; // 10 minutes

connections.forEach(agent => {
  const lastUpdate = new Date(agent.lastHeartbeat).getTime();
  if (now - lastUpdate > staleThreshold) {
    markAsStale(agent.id);
  }
});
```

---

## Checkpoint Protocol

### When to Checkpoint

- Every 30 minutes during active work
- When context reaches 60%
- Before spawning 3+ agents
- When user says "I'll be back" or similar
- Before known risky operations

### Checkpoint Data

```json
{
  "checkpointId": "cp_{timestamp}",
  "createdAt": "{ISO}",
  "trigger": "scheduled|threshold|manual",

  "currentWork": {
    "description": "What we're working on",
    "status": "in_progress"
  },

  "context": {
    "project": "Project name",
    "branch": "feature/xyz",
    "keyFiles": ["file1.ts", "file2.ts"],
    "keyDecisions": ["Decision 1", "Decision 2"],
    "blockers": []
  },

  "tasks": [
    {"id": 1, "content": "Task 1", "status": "completed"},
    {"id": 2, "content": "Task 2", "status": "in_progress"}
  ],

  "agents": [
    {"id": "task-123", "type": "coder", "status": "active"}
  ],

  "resumeInstructions": "Continue implementing auth, next step is..."
}
```

### Storage

```javascript
// Store to memory
await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "context-health",
  key: "checkpoint-latest",
  value: checkpointData,
  ttl: 14400  // 4 hours
});

// Also store to local file for redundancy
// /root/.claude-flow/recovery/checkpoint-latest.json
```

---

## Compaction Detection

### Signs of Compaction

- Sudden loss of recent context
- "I don't have context about..." responses
- Missing tool call history
- Reset of conversation state

### Recovery Protocol

1. **Detect compaction** - Check for context discontinuity
2. **Retrieve checkpoint** - Load from memory or file
3. **Inject context** - Add critical state to conversation
4. **Notify user** - Explain what was restored

```javascript
const checkpoint = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "context-health",
  key: "checkpoint-latest"
});

if (checkpoint) {
  // Restore to conversation context
  restoreContext(checkpoint);

  // Notify
  console.log(`
💾 Context restored from checkpoint (${checkpoint.createdAt})

Restored:
- Task: ${checkpoint.currentWork.description}
- Progress: ${checkpoint.tasks.filter(t => t.status === 'completed').length}/${checkpoint.tasks.length}
- Key files: ${checkpoint.context.keyFiles.join(', ')}
  `);
}
```

---

## Cleanup Protocol

### Stale Agent Cleanup

```javascript
const agents = await getActiveAgents();
const now = Date.now();

for (const agent of agents) {
  const lastHeartbeat = new Date(agent.lastHeartbeat).getTime();
  const staleDuration = now - lastHeartbeat;

  if (staleDuration > 600000) { // 10 minutes
    // Mark as stale
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "agents",
      key: `${agent.id}-status`,
      value: { status: "stale", lastSeen: agent.lastHeartbeat }
    });

    // Remove from budget
    await decrementAgentBudget(agent.id);
  }
}
```

### Memory Cleanup

Periodically clean expired entries:

```javascript
// Namespaces to clean
const namespaces = ["agents", "context-health", "recovery"];

for (const ns of namespaces) {
  const entries = await mcp__claude-flow__memory_usage({
    action: "list",
    namespace: ns
  });

  // Remove expired entries (handled by TTL, but verify)
}
```

---

## Status Dashboard

### Command: `/cassie status`

Display format:

```
╔═══════════════════════════════════════╗
║       CONTEXT HEALTH DASHBOARD        ║
╠═══════════════════════════════════════╣
║                                       ║
║  Agent Budget:  3/8  [====------] 37% ║
║    • task-123 (coder) - 5m ago        ║
║    • task-456 (reviewer) - 2m ago     ║
║    • task-789 (tester) - active       ║
║                                       ║
║  Context:  ~45k tokens [========--] 65%║
║    Status: ✅ Normal                  ║
║                                       ║
║  Connections:                         ║
║    • Hive: 2/3 healthy                ║
║    • Background: 1 running            ║
║                                       ║
║  Last checkpoint: 10 min ago          ║
║  Compaction risk: Low                 ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## Warning Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Agent count | 5 | 8 | Warn/Block spawning |
| Context % | 60% | 95% | Checkpoint/Force save |
| Stale agents | 1 | 3+ | Warn/Auto-cleanup |
| No checkpoint | 30 min | 1 hour | Auto-checkpoint |

---

## Integration with Other Workflows

### Session Startup
- Run initial health check
- Check for interrupted work
- Restore if checkpoint exists

### Recovery Protocol
- Cassie provides checkpoint data
- Recovery uses Cassie's state for restoration

### Agent Invocation
- Cassie validates budget before spawn
- Tracks new agents in budget

### Hive Coordination
- Cassie monitors hive worker health
- Alerts on worker disconnection
