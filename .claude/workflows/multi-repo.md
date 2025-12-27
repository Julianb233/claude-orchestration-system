# Multi-Repo Coordination

**Cross-repository task coordination for monorepos and related projects.**

---

## Purpose

This workflow handles:
1. Tasks that span multiple repositories
2. Shared dependency management
3. Cross-repo refactoring
4. Synchronized deployments
5. Monorepo-aware operations

---

## Repository Detection

### Project Index

Maintain project index at `/root/github-repos/PROJECT_INDEX.md`

Also stored in Claude Flow:
```javascript
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "projects",
  key: "active-projects-index"
})
```

### Relationship Types

| Type | Description | Example |
|------|-------------|---------|
| `monorepo` | Multiple packages in one repo | Turborepo, Nx workspace |
| `shared-deps` | Repos sharing common packages | Internal npm packages |
| `api-consumer` | Frontend consuming backend | Web app + API |
| `related` | Same project, separate repos | Docs + Main + CLI |

### Detecting Relationships

```javascript
async function detectRepoRelationships(repoPath) {
  // Check for monorepo markers
  const markers = ['turbo.json', 'nx.json', 'lerna.json', 'pnpm-workspace.yaml']
  const isMonorepo = markers.some(m => fs.existsSync(path.join(repoPath, m)))

  // Check package.json for workspace config
  const pkg = JSON.parse(fs.readFileSync(path.join(repoPath, 'package.json')))
  const hasWorkspaces = pkg.workspaces !== undefined

  // Check for shared dependencies
  const deps = {...pkg.dependencies, ...pkg.devDependencies}
  const internalDeps = Object.keys(deps).filter(d => d.startsWith('@julian/'))

  return {
    isMonorepo: isMonorepo || hasWorkspaces,
    internalDependencies: internalDeps,
    type: isMonorepo ? 'monorepo' : internalDeps.length > 0 ? 'shared-deps' : 'standalone'
  }
}
```

---

## Monorepo Operations

### Package Discovery

For Turborepo/Nx/Lerna workspaces:

```bash
# List all packages
find packages apps -name "package.json" -exec dirname {} \;

# Or use workspace tooling
turbo run build --dry-run --filter="..."
pnpm list -r
```

### Cross-Package Changes

When modifying shared code:

```
1. Identify affected packages
   - Direct dependents (import the changed module)
   - Transitive dependents (depend on direct dependents)

2. Plan update order
   - Change shared package first
   - Update dependents in dependency order

3. Test across packages
   - Run affected tests
   - Verify no breaking changes
```

### Monorepo Task Distribution

```javascript
async function distributeMonorepoTask(task, packages) {
  // Create package-specific sub-tasks
  const subTasks = packages.map(pkg => ({
    id: `${task.id}-${pkg.name}`,
    package: pkg.name,
    path: pkg.path,
    agent: selectAgentForPackage(pkg),
    dependencies: getPackageDependencies(pkg, packages)
  }))

  // Store task distribution
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "swarms",
    key: `monorepo-task-${task.id}`,
    value: {
      rootTask: task,
      subTasks,
      status: "distributed",
      timestamp: new Date().toISOString()
    },
    ttl: 14400
  })

  return subTasks
}
```

---

## Cross-Repo Synchronization

### Shared Dependency Updates

When updating a shared package:

```
1. Update package in source repo
2. Publish/link new version
3. Update consumers:
   - Find repos using this package
   - Update version in each
   - Run tests in each
   - Commit changes
```

### Sync Protocol

```javascript
async function syncDependencyUpdate(packageName, newVersion, affectedRepos) {
  // Store sync operation
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "sync",
    key: `dep-update-${packageName}-${Date.now()}`,
    value: {
      package: packageName,
      version: newVersion,
      repos: affectedRepos.map(r => ({
        path: r.path,
        status: "pending",
        currentVersion: r.currentVersion
      })),
      initiatedAt: new Date().toISOString()
    },
    ttl: 86400
  })

  // Create update tasks for each repo
  for (const repo of affectedRepos) {
    await createUpdateTask(repo, packageName, newVersion)
  }
}
```

### API Contract Sync

When API changes affect consumers:

```
1. Detect API change (schema, endpoints, types)
2. Find all consumer repos
3. Generate update tasks:
   - Update types/interfaces
   - Update API calls
   - Update tests
4. Coordinate rollout:
   - Deploy backend first
   - Update and deploy frontends
```

---

## Cross-Repo Refactoring

### Large-Scale Refactoring Protocol

```markdown
## Phase 1: Analysis
1. Identify all repos affected
2. Map dependencies between changes
3. Estimate scope per repo

## Phase 2: Planning
1. Create refactoring branch in each repo
2. Determine execution order
3. Identify parallel vs sequential work

## Phase 3: Execution
1. Make changes in dependency order
2. Cross-check compatibility at each step
3. Run tests across all repos

## Phase 4: Integration
1. Create PRs in all repos
2. Link related PRs
3. Coordinate merge order
```

### Agent Assignment

| Task Type | Agent | Scope |
|-----------|-------|-------|
| Type changes | Tyler-TypeScript | All TS repos |
| API updates | Adam-API | Backend + consumers |
| Database changes | Dana-Database | All data repos |
| Build config | Petra-DevOps | All repos |
| Testing | Tessa-Tester | Verify all repos |

---

## Memory Coordination

### Cross-Repo State

```javascript
// Store cross-repo operation state
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "multi-repo",
  key: "operation-{id}",
  value: {
    operationId: "{id}",
    type: "refactor|sync|deploy",
    repos: [
      {
        name: "repo-a",
        path: "/root/github-repos/repo-a",
        status: "in_progress",
        branch: "feature/refactor",
        agent: "Tyler-TypeScript"
      },
      {
        name: "repo-b",
        path: "/root/github-repos/repo-b",
        status: "pending",
        dependsOn: ["repo-a"]
      }
    ],
    startedAt: "{timestamp}"
  },
  ttl: 86400
})
```

### Progress Tracking

```javascript
async function updateRepoProgress(operationId, repoName, status, details) {
  // Get current state
  const operation = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "multi-repo",
    key: `operation-${operationId}`
  })

  // Update repo status
  const repo = operation.repos.find(r => r.name === repoName)
  repo.status = status
  repo.lastUpdate = new Date().toISOString()
  if (details) Object.assign(repo, details)

  // Save back
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "multi-repo",
    key: `operation-${operationId}`,
    value: operation,
    ttl: 86400
  })

  // Check if all repos complete
  if (operation.repos.every(r => r.status === "completed")) {
    await completeMultiRepoOperation(operationId)
  }
}
```

---

## Synchronized Deployments

### Deploy Order

For related repos with dependencies:

```
1. Determine deploy order from dependency graph
2. Deploy infrastructure changes first
3. Deploy backend services
4. Deploy API gateways
5. Deploy frontend applications
6. Verify end-to-end functionality
```

### Deployment Coordination

```javascript
async function coordinatedDeploy(repos) {
  const deployOrder = topologicalSort(repos)

  for (const repo of deployOrder) {
    // Store deploy status
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "deployments",
      key: `deploy-${repo.name}`,
      value: {
        repo: repo.name,
        status: "deploying",
        startedAt: new Date().toISOString()
      },
      ttl: 3600
    })

    // Execute deploy
    await deployRepo(repo)

    // Verify before continuing
    await verifyDeployment(repo)

    // Update status
    await mcp__claude-flow__memory_usage({
      action: "store",
      namespace: "deployments",
      key: `deploy-${repo.name}`,
      value: {
        repo: repo.name,
        status: "completed",
        completedAt: new Date().toISOString()
      },
      ttl: 3600
    })
  }
}
```

---

## File Locking Across Repos

### Lock Protocol

When working on files that affect multiple repos:

```javascript
// Lock in source repo
await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "file-locks",
  key: "repo-a/shared/types.ts",
  value: {
    lockedBy: "Tyler-TypeScript",
    terminal: "T1",
    reason: "cross-repo-refactor",
    relatedLocks: ["repo-b/types/shared.ts", "repo-c/src/types.ts"]
  },
  ttl: 1800
})

// Lock related files in other repos
for (const relatedFile of relatedFiles) {
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "file-locks",
    key: relatedFile,
    value: {
      lockedBy: "Tyler-TypeScript",
      terminal: "T1",
      reason: "cross-repo-refactor",
      primaryLock: "repo-a/shared/types.ts"
    },
    ttl: 1800
  })
}
```

---

## Common Patterns

### Pattern 1: Shared Type Updates

```
1. Update types in shared package
2. Regenerate types in consuming repos
3. Fix any type errors in each repo
4. Run tests in each repo
5. Commit and create linked PRs
```

### Pattern 2: API Version Bump

```
1. Create new API version in backend
2. Update OpenAPI spec
3. Generate new client SDKs
4. Update frontend repos to use new version
5. Deprecate old version after migration
```

### Pattern 3: Database Schema Change

```
1. Create migration in database repo
2. Update ORM schemas in backend
3. Update types in shared packages
4. Update frontend to handle new schema
5. Deploy in sequence: DB → Backend → Frontend
```

---

## Memory Keys

| Key Pattern | Namespace | Purpose |
|-------------|-----------|---------|
| `operation-{id}` | multi-repo | Cross-repo operation state |
| `active-projects-index` | projects | All known repos |
| `dep-update-{pkg}-{ts}` | sync | Dependency sync operations |
| `deploy-{repo}` | deployments | Deployment status |
| `{repo}/{file}` | file-locks | Cross-repo file locks |

---

## Commands

| Command | Action |
|---------|--------|
| `/repos` | List all related repos |
| `/sync-check` | Check cross-repo sync status |
| `/multi-deploy` | Coordinated multi-repo deploy |
| `/mono-build` | Build all monorepo packages |

---

## Integration Points

1. **Orchestrator Core** - Detect multi-repo tasks
2. **Agent Invocation** - Assign agents to specific repos
3. **Progress Monitor** - Track per-repo progress
4. **File Sync** - Coordinate cross-repo file changes
5. **Hive Coordination** - One terminal per repo in swarm
