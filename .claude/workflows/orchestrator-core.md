# Orchestrator Core

**Central trigger evaluator and workflow loader for autonomous context management.**

---

## Purpose

This workflow defines how the system:
1. Evaluates trigger conditions
2. Loads appropriate workflows
3. Routes tasks to named agents
4. Manages context budget
5. Coordinates multi-agent work

---

## Trigger Evaluation Protocol

### On Every User Message

```
1. Parse user input for:
   - Explicit commands (/n, /h, /g, etc.)
   - Named agent mentions (Marcus, Tyler, Rex, etc.)
   - Task keywords (deploy, test, debug, etc.)
   - Error patterns in output

2. Match against triggers in priority order:
   - CRITICAL: Error patterns, recovery needs
   - HIGH: Named agent mentions, explicit commands
   - MEDIUM: Task keywords, project detection
   - LOW: Informational triggers

3. Load matched workflow(s) within context budget

4. Execute task with appropriate agent
```

### Trigger Condition Types

| Type | Pattern | Example |
|------|---------|---------|
| `session_new` | New session detected | Load session-startup.md |
| `file_exists` | Check for file | `.claude-state.json` → state-management.md |
| `file_contains` | Content in file | `package.json:trpc` → julian-stack.md |
| `intent` | User intent keywords | "spawn agents" → recovery-protocol.md |
| `mentions` | Named agent mention | "Tyler" → spawn Tyler-TypeScript |
| `keywords` | Task keywords | "deploy" → hive-coordination.md |
| `error` | Error pattern match | `TS\d{4}` → typescript-pro.md |
| `command` | Slash command | `/cf-hive-*` → hive-coordination.md |

### Priority Resolution

When multiple triggers match:
1. Take highest priority trigger
2. If same priority, take most specific match
3. Respect context budget (don't overload)

---

## Context Budget Management

### Token Allocation

| Layer | Budget | Description |
|-------|--------|-------------|
| Base | 500 | system-hub.md always loaded |
| Project | 1000 | Project-specific context |
| Task | 2000 | Task-specific workflows |
| Dynamic | 500 | Additional as needed |
| **Total** | **4000** | Maximum context load |

### Loading Strategy

```
1. Always load system-hub.md first (500 tokens)
2. Determine task type from user input
3. Look up in Task → Workflow routing table
4. Load only that workflow if within budget
5. Defer additional loads unless critical
```

### Over Budget Handling

If requested context exceeds budget:
1. Load most critical items only
2. Use section-level loading from knowledge-index.json
3. Defer less critical context
4. Notify user if significant context dropped

---

## Named Agent Routing

### Detection

Parse user input for:
- Explicit names: "Have Tyler implement..."
- Role references: "Ask the reviewer to..."
- Shorthand: "@tyler", "@rex"

### Spawn Protocol

When named agent detected:
```
1. Look up agent in _registry.md
2. Get base agent type (e.g., typescript-pro)
3. Spawn using Task tool with that subagent_type
4. Set agent status in agent-status namespace
5. Track progress via progress-monitor.md
```

### Multi-Agent Detection

If task mentions multiple agents or requires coordination:
1. Load recovery-protocol.md for checkpointing
2. Create task decomposition
3. Assign tasks to agents
4. Monitor via agent-status namespace

---

## Workflow Loading

### Load Sequence

```
Session Start:
1. system-hub.md (ALWAYS)
2. session-startup.md (check recovery)
3. state-management.md (if in project)

Task Received:
1. Parse task type
2. Load task-specific workflow from routing table
3. Load agent-specific context if needed

Multi-Agent:
1. recovery-protocol.md (checkpoint first)
2. Task-specific workflows per agent
3. progress-monitor.md (track all agents)
```

### Silent Loading

Workflows load silently - don't announce to user unless:
- Critical error detected
- Recovery from interrupted work
- Explicit status request

---

## Task Decomposition

### For Complex Tasks

When task is complex (multiple steps, files, or agents):

```
1. Identify task type from keywords
2. Check task-decomposition.json for patterns
3. Break into sub-tasks
4. Assign to appropriate agents
5. Create dependency graph
6. Execute in correct order
```

### Decomposition Patterns

| Task Type | Decomposition |
|-----------|---------------|
| Feature implementation | Design → Implement → Test → Review |
| Bug fix | Investigate → Fix → Test → Document |
| Deployment | Build → Test → Deploy → Verify |
| Refactoring | Analyze → Plan → Implement → Validate |

---

## Error Handling

### On Error Detection

```
1. Match error against patterns in error-remediation-map.md
2. If match found, suggest quick fix
3. If complex, spawn Diana-Debugger
4. Log error to recovery namespace
```

### Rate Limit Handling

```
1. Detect 429 response
2. Load rate-limit-handler.md
3. Auto-switch to organization API if configured
4. Continue work seamlessly
```

---

## Coordination Checkpoints

### Before Multi-Agent Work

```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="recovery",
  key="active-workflow",
  value={
    "checkpointId": "cp_{timestamp}",
    "task": "{description}",
    "agents": [{planned agents}],
    "status": "in_progress"
  },
  ttl=14400
)
```

### During Execution

Every agent updates status every 30 seconds:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="agent-status",
  key="{agent-name}",
  value={
    "status": "working",
    "currentTask": "...",
    "progress": "3/5 steps",
    "lastHeartbeat": "{timestamp}"
  },
  ttl=300
)
```

### On Completion

```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="results",
  key="task-{id}",
  value={result data},
  ttl=604800
)
```

---

## Integration Points

| System | Integration |
|--------|-------------|
| system-hub.md | Primary routing reference |
| command-router.json | Slash command handling |
| namespaces.json | Memory namespace config |
| triggers.json | Trigger definitions |
| _registry.md | Named agent lookup |
| named-agents.json | Agent configuration |

---

## Implementation Notes

This workflow is **conceptual documentation** for how the orchestrator should behave. The actual orchestration happens through:

1. **Claude's understanding** of this workflow
2. **Trigger evaluation** by checking conditions manually
3. **Task tool** for spawning agents
4. **Claude Flow MCP** for memory coordination

There is no separate "orchestrator process" - Claude itself acts as the orchestrator by following these rules.
