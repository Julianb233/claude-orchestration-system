# Workflow Templates for Claude Flow

Pre-built workflow patterns for common multi-agent tasks.

## Template 1: Full Feature Implementation

Deploy a complete feature from design to deployment.

```javascript
// Initialize
const swarm = await mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 6,
  strategy: "adaptive"
});

// Spawn team
await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "backend-architect", name: "architect", priority: "high" },
    { type: "frontend-developer", name: "frontend", priority: "high" },
    { type: "typescript-pro", name: "backend", priority: "high" },
    { type: "database-architect", name: "database", priority: "medium" },
    { type: "test-automator", name: "tester", priority: "medium" },
    { type: "api-documenter", name: "docs", priority: "low" }
  ]
});

// Orchestrate phases
await mcp__claude-flow__task_orchestrate({
  task: "Implement feature: ${FEATURE_NAME}",
  strategy: "sequential",
  dependencies: [
    "architect:design_api",
    "database:create_schema",
    ["frontend:build_ui", "backend:implement_api"],  // parallel
    "tester:write_tests",
    "docs:document_api"
  ]
});
```

## Template 2: Code Review Swarm

Comprehensive multi-perspective code review.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 4
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "code-reviewer", name: "quality-reviewer", capabilities: ["patterns", "style"] },
    { type: "security-auditor", name: "security-reviewer", capabilities: ["vulnerabilities"] },
    { type: "performance-engineer", name: "perf-reviewer", capabilities: ["optimization"] },
    { type: "test-automator", name: "coverage-reviewer", capabilities: ["testing"] }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Review ${PR_NUMBER} for quality, security, performance, and test coverage",
  strategy: "parallel",
  priority: "high"
});

// Aggregate results
await mcp__claude-flow__memory_search({
  pattern: "review_*",
  namespace: "results"
});
```

## Template 3: Documentation Generation

Create comprehensive documentation from codebase.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "star",
  maxAgents: 5
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "docs-architect", name: "tech-docs", capabilities: ["architecture"] },
    { type: "api-documenter", name: "api-docs", capabilities: ["openapi"] },
    { type: "how-to-guide-agent", name: "tutorials", capabilities: ["guides"] },
    { type: "support-doc-agent", name: "support", capabilities: ["faq"] },
    { type: "mermaid-expert", name: "diagrams", capabilities: ["visualization"] }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Generate documentation for ${PROJECT}",
  strategy: "parallel"
});
```

## Template 4: Bug Investigation

Multi-agent debugging and root cause analysis.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "ring",
  maxAgents: 4
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "error-detective", name: "investigator", capabilities: ["logs", "traces"] },
    { type: "debugger", name: "debugger", capabilities: ["debugging"] },
    { type: "performance-engineer", name: "profiler", capabilities: ["metrics"] },
    { type: "code-reviewer", name: "reviewer", capabilities: ["code-analysis"] }
  ]
});

// Ring pattern: each agent passes findings to next
await mcp__claude-flow__task_orchestrate({
  task: "Investigate bug: ${BUG_DESCRIPTION}",
  strategy: "sequential",
  dependencies: [
    "investigator:collect_evidence",
    "profiler:analyze_performance",
    "debugger:identify_root_cause",
    "reviewer:propose_fix"
  ]
});
```

## Template 5: Security Audit

Comprehensive security assessment.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 5
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "security-auditor", name: "lead-auditor", priority: "critical" },
    { type: "backend-security-coder", name: "backend-security" },
    { type: "frontend-security-coder", name: "frontend-security" },
    { type: "mobile-security-coder", name: "mobile-security" },
    { type: "network-engineer", name: "infra-security" }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Security audit for ${PROJECT}",
  strategy: "parallel",
  priority: "critical"
});
```

## Template 6: Database Migration

Safe database migration with rollback.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 4
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "database-architect", name: "schema-designer", priority: "high" },
    { type: "database-optimizer", name: "query-optimizer" },
    { type: "sql-pro", name: "migration-writer" },
    { type: "test-automator", name: "migration-tester" }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Database migration: ${MIGRATION_DESCRIPTION}",
  strategy: "sequential",
  dependencies: [
    "schema-designer:design_changes",
    "migration-writer:write_migration",
    "migration-tester:test_migration",
    "query-optimizer:optimize_queries"
  ]
});
```

## Template 7: Refactoring Project

Large-scale codebase refactoring.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "star",
  maxAgents: 6
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "architect-review", name: "coordinator", priority: "critical" },
    { type: "legacy-modernizer", name: "modernizer" },
    { type: "typescript-pro", name: "ts-refactor" },
    { type: "python-pro", name: "py-refactor" },
    { type: "test-automator", name: "test-updater" },
    { type: "code-reviewer", name: "quality-gate" }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Refactor ${MODULE} from ${OLD_PATTERN} to ${NEW_PATTERN}",
  strategy: "adaptive"
});
```

## Template 8: API Development

Full API lifecycle from design to deployment.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 6
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "backend-architect", name: "api-designer", priority: "high" },
    { type: "graphql-architect", name: "graphql-impl" },
    { type: "fastapi-pro", name: "rest-impl" },
    { type: "api-documenter", name: "api-docs" },
    { type: "test-automator", name: "api-tester" },
    { type: "security-auditor", name: "api-security" }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Build API: ${API_DESCRIPTION}",
  strategy: "adaptive",
  dependencies: [
    "api-designer:design_endpoints",
    ["graphql-impl:implement", "rest-impl:implement"],
    "api-tester:write_tests",
    "api-security:audit",
    "api-docs:document"
  ]
});
```

## Template 9: Performance Optimization

System-wide performance improvement.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 5
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "performance-engineer", name: "profiler" },
    { type: "database-optimizer", name: "db-optimizer" },
    { type: "observability-engineer", name: "metrics-analyst" },
    { type: "frontend-developer", name: "frontend-optimizer" },
    { type: "cloud-architect", name: "infra-optimizer" }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Optimize performance for ${TARGET}",
  strategy: "parallel"
});
```

## Template 10: Content Marketing Campaign

Multi-platform content creation.

```javascript
const swarm = await mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 6
});

await mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "content-marketer", name: "strategist", priority: "high" },
    { type: "seo-content-writer", name: "writer" },
    { type: "seo-keyword-strategist", name: "seo" },
    { type: "seo-meta-optimizer", name: "meta" },
    { type: "social-media-agent", name: "social" },
    { type: "branding-agent", name: "brand" }
  ]
});

await mcp__claude-flow__task_orchestrate({
  task: "Create content campaign for ${TOPIC}",
  strategy: "sequential",
  dependencies: [
    "strategist:plan_campaign",
    "seo:research_keywords",
    "writer:create_content",
    ["meta:optimize_meta", "social:create_posts"],
    "brand:ensure_consistency"
  ]
});
```

## Using Templates

### Quick Start

1. Copy the template that matches your task
2. Replace `${VARIABLES}` with actual values
3. Execute in Claude Flow
4. Monitor progress with `swarm_status`
5. Clean up with `swarm_destroy`

### Customization

- Adjust `maxAgents` based on task complexity
- Change `topology` based on coordination needs
- Modify agent types to match your tech stack
- Add/remove phases in `dependencies`

### Memory Integration

All templates automatically share context via:
- `session` namespace for shared state
- `results` namespace for outputs
- `recovery` namespace for checkpoints
