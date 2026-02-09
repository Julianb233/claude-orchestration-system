# Agent Learning Patterns

**Track successful agent combinations and task patterns to improve future performance.**

---

## Purpose

This knowledge base stores:
1. Successful agent combinations for task types
2. Patterns that led to fast resolution
3. Common failure modes to avoid
4. Optimized prompts and approaches

---

## Learning Storage

### Memory Namespace

All learning data stored in `learning` namespace:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "learning",
  key: "{pattern-type}-{id}",
  value: {...},
  ttl: 7776000  // 90 days
})
```

### Pattern Categories

| Category | Key Pattern | Purpose |
|----------|-------------|---------|
| `agent-combo` | `agent-combo-{task-type}` | Best agent teams |
| `resolution` | `resolution-{error-type}` | Fast fixes |
| `workflow` | `workflow-{task-type}` | Effective sequences |
| `prompt` | `prompt-{agent}-{task}` | Optimized prompts |
| `failure` | `failure-{type}` | What to avoid |

---

## Successful Agent Combinations

### Recording a Success

After a task completes successfully, store the pattern:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "learning",
  key: "agent-combo-typescript-refactor",
  value: {
    taskType: "typescript-refactor",
    agents: ["Tyler-TypeScript", "Rex-Reviewer"],
    sequence: "parallel",
    avgDuration: "15 minutes",
    successCount: 12,
    lastUsed: "{timestamp}",
    notes: "Tyler refactors, Rex reviews simultaneously"
  }
})
```

### Known Effective Combinations

| Task Type | Agent Combo | Sequence | Success Rate |
|-----------|-------------|----------|--------------|
| TypeScript refactor | Tyler + Rex | parallel | 95% |
| Bug investigation | Diana + Tyler | sequential | 90% |
| New feature | Archie → Tyler → Tessa | sequential | 88% |
| API implementation | Adam + Tyler + Tessa | parallel | 92% |
| Database migration | Dana → Tyler | sequential | 94% |
| Security audit | Sage + Rex | parallel | 91% |
| Deployment | Petra + Otto | parallel | 96% |
| Documentation | Gina + Rex | sequential | 89% |

### Combo Selection Logic

```
1. Identify task type from user request
2. Query: mcp__claude-flow__memory_usage(action="retrieve", namespace="learning", key="agent-combo-{task-type}")
3. If found with successCount > 5: Use that combo
4. If not found: Use default from _registry.md
5. After completion: Update success count
```

---

## Resolution Patterns

### Recording a Resolution

When an error is fixed, store how:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "learning",
  key: "resolution-ts2322",
  value: {
    errorPattern: "TS2322: Type.*is not assignable",
    resolution: "Check type definitions, add type assertion or fix source data",
    agent: "Tyler-TypeScript",
    avgFixTime: "3 minutes",
    successCount: 28,
    commonCauses: ["API response mismatch", "null not handled", "generic constraint"],
    exampleFixes: [
      "Added `as TypeName` assertion",
      "Added null check with ??",
      "Updated interface to match actual shape"
    ]
  }
})
```

### High-Value Resolution Patterns

| Error | Resolution | Fix Time |
|-------|------------|----------|
| TS2322 type mismatch | Check shapes, add assertion | 3 min |
| ENOENT file not found | Verify path, create if needed | 1 min |
| 429 rate limit | Auto-switch to org API | 0 min |
| Prisma P2002 unique | Check for existing, upsert | 5 min |
| Jest timeout | Increase timeout, check async | 4 min |
| CORS error | Add headers to API response | 2 min |

---

## Workflow Patterns

### Recording a Workflow

Store effective task sequences:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "learning",
  key: "workflow-feature-implementation",
  value: {
    taskType: "feature-implementation",
    steps: [
      {step: 1, action: "Archie designs architecture", duration: "10 min"},
      {step: 2, action: "Tyler implements code", duration: "30 min"},
      {step: 3, action: "Tessa writes tests", duration: "15 min"},
      {step: 4, action: "Rex reviews all", duration: "10 min"},
      {step: 5, action: "Petra deploys", duration: "5 min"}
    ],
    totalDuration: "70 min",
    successCount: 8,
    notes: "Tessa can start tests while Tyler still implementing"
  }
})
```

### Proven Workflows

| Task | Workflow | Duration |
|------|----------|----------|
| Feature implementation | Archie → Tyler → Tessa → Rex → Petra | 70 min |
| Bug fix | Diana → Tyler → Tessa | 25 min |
| Refactor | Tyler + Rex (parallel) | 30 min |
| API endpoint | Adam → Tyler → Tessa → Rex | 45 min |
| Security fix | Sage → Tyler → Sage (verify) | 40 min |

---

## Optimized Prompts

### Recording Effective Prompts

Store prompts that work well:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "learning",
  key: "prompt-tyler-refactor",
  value: {
    agent: "Tyler-TypeScript",
    taskType: "refactor",
    prompt: "Refactor {file} to use {pattern}. Preserve all existing functionality. Add type safety where missing. Run tsc --noEmit to verify no type errors.",
    effectiveness: 0.94,
    usageCount: 15,
    improvements: [
      "Adding 'preserve functionality' reduced regressions",
      "Adding tsc check catches issues early"
    ]
  }
})
```

### High-Performance Prompts

| Agent | Task | Key Phrases |
|-------|------|-------------|
| Tyler | Refactor | "preserve functionality", "add type safety", "run tsc" |
| Diana | Debug | "check logs first", "isolate the issue", "minimal reproduction" |
| Tessa | Test | "cover edge cases", "test failure paths", "mock external deps" |
| Rex | Review | "check for security", "performance implications", "code clarity" |

---

## Failure Patterns (Anti-Patterns)

### Recording Failures

Learn from what doesn't work:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "learning",
  key: "failure-parallel-db-migrations",
  value: {
    pattern: "Running database migrations in parallel",
    consequence: "Race conditions, failed migrations, corrupted state",
    avoidBy: "Always run migrations sequentially",
    occurrences: 3,
    lastOccurred: "{timestamp}",
    relatedAgents: ["Dana-Database"]
  }
})
```

### Known Anti-Patterns

| Pattern | Consequence | Avoid By |
|---------|-------------|----------|
| Parallel DB migrations | Race conditions | Sequential only |
| Skipping tests on "small" changes | Regressions | Always test |
| Multiple agents editing same file | Conflicts | Use file locks |
| Deploying without type check | Runtime errors | Run tsc first |
| Ignoring rate limits | Service disruption | Implement backoff |

---

## Learning Loop Implementation

### After Every Task Completion

```javascript
async function recordLearning(task, result) {
  const learningKey = `${result.success ? 'success' : 'failure'}-${task.type}-${Date.now()}`

  // Store the outcome
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "learning",
    key: learningKey,
    value: {
      taskType: task.type,
      agents: task.agents,
      duration: task.duration,
      success: result.success,
      filesModified: task.files,
      errorEncountered: result.error || null,
      resolution: result.resolution || null,
      timestamp: new Date().toISOString()
    },
    ttl: 7776000
  })

  // Update combo success rate
  if (result.success && task.agents.length > 1) {
    await updateComboStats(task.type, task.agents)
  }
}
```

### Periodic Analysis (Every 6 Hours)

```javascript
async function analyzeLearning() {
  // Get all recent learning entries
  const patterns = await mcp__claude-flow__memory_search({
    pattern: "success-*",
    namespace: "learning",
    limit: 100
  })

  // Identify top-performing combinations
  const combos = {}
  for (const p of patterns) {
    const key = p.value.agents.sort().join('+')
    combos[key] = combos[key] || {count: 0, totalTime: 0}
    combos[key].count++
    combos[key].totalTime += p.value.duration
  }

  // Store optimized recommendations
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "learning",
    key: "optimized-combos",
    value: {
      analyzedAt: new Date().toISOString(),
      topCombos: Object.entries(combos)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
    }
  })
}
```

---

## Querying Learned Patterns

### Get Best Combo for Task

```javascript
async function getBestCombo(taskType) {
  // Try specific first
  let combo = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "learning",
    key: `agent-combo-${taskType}`
  })

  if (combo && combo.successCount > 5) {
    return combo.agents
  }

  // Fall back to optimized combos
  const optimized = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "learning",
    key: "optimized-combos"
  })

  // Return best match or default
  return optimized?.topCombos?.[0]?.[0]?.split('+') || ["Tyler-TypeScript"]
}
```

### Get Resolution for Error

```javascript
async function getResolution(errorMessage) {
  // Search for matching resolution
  const resolutions = await mcp__claude-flow__memory_search({
    pattern: "resolution-*",
    namespace: "learning"
  })

  for (const r of resolutions) {
    if (new RegExp(r.value.errorPattern).test(errorMessage)) {
      return r.value
    }
  }

  // Fall back to error-remediation-map.md
  return null
}
```

---

## Memory Keys Reference

| Key Pattern | Purpose | TTL |
|-------------|---------|-----|
| `agent-combo-{type}` | Best agents for task type | 90 days |
| `resolution-{error}` | How to fix error type | 90 days |
| `workflow-{type}` | Effective task sequences | 90 days |
| `prompt-{agent}-{task}` | Optimized prompts | 90 days |
| `failure-{pattern}` | Anti-patterns to avoid | 90 days |
| `optimized-combos` | Analyzed top performers | 7 days |
| `success-{type}-{ts}` | Individual success records | 30 days |
| `failure-{type}-{ts}` | Individual failure records | 30 days |

---

## Integration Points

1. **Task Start** - Query for best combo and workflow
2. **Error Encountered** - Query for known resolution
3. **Task Complete** - Record outcome to learning
4. **Every 6 Hours** - Analyze and optimize recommendations
5. **Agent Spawn** - Include learned prompt optimizations
