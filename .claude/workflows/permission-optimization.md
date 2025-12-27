# Permission Optimization Protocol

**Goal: Minimize permission prompts while maintaining safety.**

---

## Current Problems

1. **Over-prompting**: Agents ask for confirmation even when authorized
2. **Redundant checks**: Same permission verified multiple times
3. **Inconsistent inheritance**: Sub-agents don't inherit parent permissions
4. **No caching**: Each operation re-checks permissions

---

## Permission Tiers

| Tier | Level | Behavior |
|------|-------|----------|
| 0 | Full Bypass | Never ask (Bubba-Orchestrator) |
| 1 | Auto-Approve | Proceed with logging |
| 2 | Notify | Proceed but notify user |
| 3 | Confirm | Ask for dangerous operations only |
| 4 | Restricted | Ask for all operations |

---

## Agent Permission Inheritance

When an agent spawns another agent:

```javascript
// Parent passes permission level to child
spawnAgent({
  type: "Tyler-TypeScript",
  inheritPermissions: true,
  parentPermissionTier: parentAgent.permissionTier  // Inherits from parent
});
```

**Rules:**
- Child can never have MORE permissions than parent
- Tier 0 (Bubba) spawns Tier 1 agents by default
- Explicitly spawned agents inherit parent tier
- Task agents from Task tool get Tier 2

---

## Auto-Approved Operations

These operations NEVER need confirmation:

### File Operations
- Read any file
- Write to non-protected paths
- Edit files in current project
- Create new files in project scope

### Commands
- `npm`, `yarn`, `pnpm` (package management)
- `git` (non-destructive: status, diff, log, add, commit, push)
- `node`, `tsx`, `python` (script execution)
- `docker` (build, run, logs)
- Build tools (`tsc`, `vite`, `next`, `turbo`)
- Test runners (`jest`, `vitest`, `pytest`)

### MCP Tools
- All read operations
- Memory namespace operations
- GitHub read operations
- Notion queries

---

## Confirm-Required Operations

Ask for confirmation only for:

### Git (Destructive)
- `git reset --hard`
- `git push --force`
- `git rebase` (interactive)
- Deleting branches

### System
- `rm -rf` on directories outside project
- `chmod` on system files
- Service restarts
- Database drops

### External
- Sending emails/notifications
- Publishing to production
- Billing/payment operations
- Data exports

---

## Permission Caching

Cache permission decisions to avoid re-prompting:

```javascript
// Store permission grant in session
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "session",
  key: "permission-cache",
  value: {
    "file-write:/root/github-repos/*": { granted: true, expiry: "session" },
    "git-push:origin/main": { granted: true, expiry: "1h" },
    "deploy:vercel": { granted: true, expiry: "1h" }
  },
  ttl: 86400
});

// Check cache before prompting
const checkPermission = async (operation) => {
  const cache = await getPermissionCache();
  if (cache[operation]?.granted) return true;
  // Only prompt if not cached
  return await promptUser(operation);
};
```

---

## Bubba's Full Bypass Mode

**Bubba-Orchestrator operates in Tier 0 (Full Bypass).**

This means Bubba:
- NEVER asks "should I proceed?"
- NEVER asks "do you want me to..."
- NEVER waits for confirmation
- ALWAYS thinks, plans, then executes

**All agents spawned by Bubba inherit Tier 1 (Auto-Approve).**

---

## Implementation in Agent Files

Add to each agent's configuration:

```markdown
## Permissions

**Tier:** 1 (Auto-Approve)
**Inherits:** From spawning agent
**Auto-approved:** file-write, git-commit, npm-install, test-run
**Requires confirm:** git-force-push, production-deploy, data-delete
```

---

## Anti-Patterns to Avoid

### DON'T
- Ask permission for reading files
- Confirm before running tests
- Prompt before committing code
- Ask to run npm install
- Confirm before spawning agents (if parent authorized)

### DO
- Proceed silently on approved operations
- Log actions for audit trail
- Only prompt for genuinely dangerous ops
- Batch multiple prompts into one decision

---

## Audit Logging (No Prompting)

Instead of prompting, log all actions:

```javascript
// Log to monitoring namespace
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "monitoring",
  key: `audit-${Date.now()}`,
  value: {
    agent: "Tyler-TypeScript",
    operation: "file-write",
    path: "/root/github-repos/myapp/src/api.ts",
    timestamp: new Date().toISOString(),
    tier: 1
  },
  ttl: 604800  // 7 days
});
```

---

## Migration Steps

1. **Update agent-index.json** - Add permission tiers (DONE)
2. **Update agent files** - Add permission section to each
3. **Implement caching** - Add permission cache to session
4. **Add audit logging** - Replace prompts with logs
5. **Test bypass mode** - Verify Bubba operates without prompts

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Permission prompts per task | ~5 | <1 |
| Operations auto-approved | 60% | 95% |
| Dangerous op coverage | Variable | 100% |
| Audit log coverage | 0% | 100% |
