# AI Acrobatics Orchestra - Swarm Orchestration Guide

Comprehensive guide for deploying multiple coding agents, understanding when to use swarms, and maximizing the AI orchestration system.

## Overview

The AI Acrobatics Orchestra (Claude Flow) enables sophisticated multi-agent workflows where specialized agents collaborate on complex tasks. This guide covers agent deployment strategies, coding swarm patterns, and best practices.

## Agent Catalog

### Coding Agents

| Agent | Specialization | When to Deploy |
|-------|---------------|----------------|
| `python-pro` | Python 3.12+, async, modern patterns | Python projects, scripts, APIs |
| `typescript-pro` | TypeScript, strict types, decorators | TypeScript projects, type systems |
| `javascript-pro` | ES6+, Node.js, async patterns | JS projects, Node backends |
| `rust-pro` | Rust 1.75+, systems programming | Performance-critical code |
| `golang-pro` | Go 1.21+, concurrency | Microservices, CLIs |
| `java-pro` | Java 21+, Spring Boot | Enterprise applications |
| `csharp-pro` | C#, .NET, async/await | .NET applications |
| `cpp-pro` | C++, memory management | Systems, performance code |
| `c-pro` | C, embedded systems | Low-level, embedded |

### Architecture Agents

| Agent | Specialization | When to Deploy |
|-------|---------------|----------------|
| `backend-architect` | API design, microservices | New services, refactoring |
| `database-architect` | Schema design, data modeling | Database planning |
| `cloud-architect` | AWS/Azure/GCP, IaC | Infrastructure design |
| `kubernetes-architect` | K8s, GitOps, service mesh | Container orchestration |

### Quality Agents

| Agent | Specialization | When to Deploy |
|-------|---------------|----------------|
| `code-reviewer` | Code quality, security, performance | Before commits/PRs |
| `test-automator` | Testing strategies, frameworks | Test creation |
| `security-auditor` | Security scanning, compliance | Security reviews |
| `debugger` | Error investigation, fixes | Bug hunting |

### Documentation Agents

| Agent | Specialization | When to Deploy |
|-------|---------------|----------------|
| `api-documenter` | OpenAPI, developer portals | API documentation |
| `docs-architect` | Technical manuals, guides | System documentation |
| `how-to-guide-agent` | Tutorials, step-by-step guides | User guides |
| `support-doc-agent` | FAQs, troubleshooting | Support content |

## Swarm Topologies

### Hierarchical (Default for Complex Tasks)

```
          Coordinator
              │
    ┌─────────┼─────────┐
    │         │         │
 Worker1   Worker2   Worker3
```

**Use when:**
- Tasks have dependencies
- Need central coordination
- Quality control important

```javascript
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 5,
  strategy: "auto"
})
```

### Mesh (For Research/Analysis)

```
    Agent1 ←──→ Agent2
       ↕    ╲  ╱    ↕
    Agent3 ←──→ Agent4
```

**Use when:**
- Agents need to share findings
- Collaborative research
- Multiple perspectives needed

```javascript
mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 4
})
```

### Star (For Fan-Out Tasks)

```
         Central
           │
    ┌──────┼──────┐
    │      │      │
  Worker Worker Worker
```

**Use when:**
- Same task on multiple files
- Independent parallel work
- Results aggregated at end

```javascript
mcp__claude-flow__swarm_init({
  topology: "star",
  maxAgents: 8
})
```

### Ring (For Pipeline Processing)

```
Agent1 → Agent2 → Agent3 → Agent4
   ↑                         │
   └─────────────────────────┘
```

**Use when:**
- Sequential processing
- Each agent transforms output
- Pipeline workflows

## Deployment Patterns

### Pattern 1: Code Review Swarm

Deploy multiple reviewers for comprehensive code review:

```javascript
// Initialize review swarm
mcp__claude-flow__swarm_init({ topology: "mesh", maxAgents: 4 })

// Spawn specialized reviewers
mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "code-reviewer", name: "security-reviewer", capabilities: ["security"] },
    { type: "code-reviewer", name: "perf-reviewer", capabilities: ["performance"] },
    { type: "code-reviewer", name: "style-reviewer", capabilities: ["style", "patterns"] },
    { type: "test-automator", name: "coverage-checker", capabilities: ["testing"] }
  ]
})

// Orchestrate review
mcp__claude-flow__task_orchestrate({
  task: "Review PR #123 for security, performance, style, and test coverage",
  strategy: "parallel"
})
```

### Pattern 2: Multi-Language Refactor

When refactoring spans multiple languages:

```javascript
mcp__claude-flow__swarm_init({ topology: "hierarchical", maxAgents: 5 })

// Coordinator + language specialists
mcp__claude-flow__agent_spawn({ type: "architect-review", name: "coordinator" })

mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "typescript-pro", name: "ts-refactor" },
    { type: "python-pro", name: "py-refactor" },
    { type: "golang-pro", name: "go-refactor" }
  ]
})
```

### Pattern 3: Feature Implementation

Full-stack feature with parallel frontend/backend:

```javascript
mcp__claude-flow__swarm_init({ topology: "star", maxAgents: 6 })

mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "backend-architect", name: "api-designer", priority: "high" },
    { type: "frontend-developer", name: "ui-builder", priority: "high" },
    { type: "database-architect", name: "schema-designer" },
    { type: "test-automator", name: "test-writer" },
    { type: "api-documenter", name: "doc-writer" }
  ]
})

mcp__claude-flow__task_orchestrate({
  task: "Implement user authentication feature",
  strategy: "adaptive",
  priority: "high"
})
```

### Pattern 4: Documentation Swarm

Comprehensive documentation generation:

```javascript
mcp__claude-flow__swarm_init({ topology: "hierarchical", maxAgents: 4 })

mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "docs-architect", name: "tech-docs" },
    { type: "api-documenter", name: "api-docs" },
    { type: "how-to-guide-agent", name: "tutorials" },
    { type: "support-doc-agent", name: "support-docs" }
  ]
})
```

## Memory Coordination

### Shared Namespaces

Agents share information through Claude Flow memory:

```javascript
// Store shared context
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "session",
  key: "project-context",
  value: { repo, branch, scope, decisions: [] }
})

// All agents can retrieve
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "session",
  key: "project-context"
})
```

### Result Aggregation

```javascript
// Agents store results
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "results",
  key: "review-{agent}-{timestamp}",
  value: { findings, suggestions, severity }
})

// Coordinator aggregates
mcp__claude-flow__memory_search({
  pattern: "review-*",
  namespace: "results"
})
```

## Decision Matrix

### When to Use Single Agent

- Simple, focused task
- Single file/component
- Quick fix or query
- No dependencies

### When to Use Swarm

| Scenario | Recommended Topology | Agent Count |
|----------|---------------------|-------------|
| Code review | Mesh | 3-4 |
| Feature implementation | Hierarchical | 4-6 |
| Multi-file refactor | Star | 3-5 |
| Research/analysis | Mesh | 2-4 |
| Documentation | Hierarchical | 3-4 |
| Bug investigation | Ring | 2-3 |
| Performance audit | Mesh | 3-4 |

## Tools & Capabilities

### All Agents Have Access To

- `Read` - Read files
- `Write` - Create/overwrite files
- `Edit` - Modify files
- `Glob` - Find files by pattern
- `Grep` - Search file contents
- `Bash` - Execute commands
- `WebFetch` - Fetch web content
- `WebSearch` - Search the web

### Agent-Specific Tools

| Agent Type | Special Capabilities |
|------------|---------------------|
| Coding Agents | Language-specific analysis, refactoring |
| Architects | System design, trade-off analysis |
| Reviewers | Quality metrics, security scanning |
| Documenters | Template generation, diagram creation |

## Best Practices

### 1. Start Small, Scale Up

```javascript
// Start with direct execution
Task({ subagent_type: "typescript-pro", prompt: "Fix this bug" })

// Scale to swarm only if needed
if (complexity === "high") {
  mcp__claude-flow__swarm_init({ topology: "hierarchical" })
}
```

### 2. Use Appropriate Topology

- **Hierarchical**: When coordination needed
- **Mesh**: When agents should communicate
- **Star**: When tasks are independent
- **Ring**: When sequential processing

### 3. Limit Agent Count

- More agents ≠ better results
- Start with 3-4, max 6-8
- Quality > Quantity

### 4. Share Context

```javascript
// Good: Centralized context
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "session",
  key: "shared-context"
})

// Agents read from same source
```

### 5. Monitor Progress

```javascript
// Check swarm status
mcp__claude-flow__swarm_status({ swarmId })

// Check individual agents
mcp__claude-flow__agent_metrics({ agentId })
```

### 6. Clean Up

```javascript
// Always destroy swarms when done
mcp__claude-flow__swarm_destroy({ swarmId })
```

## Troubleshooting

### Agents Not Responding

1. Check swarm status
2. Verify agent spawned successfully
3. Check memory for errors
4. Restart swarm if needed

### Poor Coordination

1. Ensure shared namespace used
2. Check topology matches task
3. Reduce agent count
4. Use hierarchical with coordinator

### Memory Issues

1. Compress namespace: `mcp__claude-flow__memory_compress()`
2. Check TTL settings
3. Clean up old entries
4. Use appropriate namespace

## Quick Reference

### Initialize Swarm
```javascript
mcp__claude-flow__swarm_init({ topology: "hierarchical", maxAgents: 5 })
```

### Spawn Agents
```javascript
mcp__claude-flow__agent_spawn({ type: "typescript-pro", name: "worker-1" })
```

### Parallel Spawn
```javascript
mcp__claude-flow__agents_spawn_parallel({ agents: [...] })
```

### Orchestrate Task
```javascript
mcp__claude-flow__task_orchestrate({ task: "...", strategy: "parallel" })
```

### Check Status
```javascript
mcp__claude-flow__swarm_status({})
mcp__claude-flow__agent_list({})
```

### Destroy Swarm
```javascript
mcp__claude-flow__swarm_destroy({ swarmId: "..." })
```
