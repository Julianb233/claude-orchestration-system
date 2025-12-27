# Agent & Workflow Status

View real-time status of active agents and workflows.

## Instructions

### Step 1: Check Active Workflow

```
mcp__claude-flow__memory_usage(action="retrieve", namespace="recovery", key="active-workflow")
```

### Step 2: Get Agent Progress

For each agent in the workflow:
```
mcp__claude-flow__memory_usage(action="retrieve", namespace="agents", key="agent-{id}-progress")
```

### Step 3: Check Swarm Status (if applicable)

```
mcp__claude-flow__swarm_status
```

### Step 4: Display Status Dashboard

```
## Workflow Status

**Active Workflow:** {workflow.description}
**Type:** {workflow.type}
**Project:** {context.project} (`{context.branch}`)
**Started:** {startedAt} ({duration} ago)
**Checkpoint:** {checkpointId}

---

### Agent Activity

| # | Agent | Task | Status | Progress | Last Update |
|---|-------|------|--------|----------|-------------|
| 1 | coder | Implement login API | ✅ done | 5/5 | 2 min ago |
| 2 | coder | Create middleware | 🔄 running | 3/5 | now |
| 3 | tester | Write tests | ⏳ pending | 0/3 | - |

**Legend:** ✅ done | 🔄 running | ⏳ pending | ⚠️ stalled | ❌ failed

---

### Files Modified
- `src/api/auth.ts` (agent-1)
- `src/middleware/jwt.ts` (agent-2, in progress)

### Completed Outputs
1. **agent-1:** Login API implemented with JWT support
2. ...

### Pending Work
- [ ] Complete middleware (agent-2)
- [ ] Write tests (agent-3)
- [ ] Deploy to staging

---

**Commands:**
- `/cf-recover` - Resume if disconnected
- `/cf-checkpoint` - Save current state
- `/h` - View history
```

### Step 5: If No Active Workflow

```
## Workflow Status

✅ No active workflow running.

**Recent History:**
{show last 2-3 items from /h}

**Start new work** or check `/cf-recover` for interrupted sessions.
```

## Status Icons

| Icon | Meaning |
|------|---------|
| ✅ | Completed successfully |
| 🔄 | Currently running |
| ⏳ | Pending / not started |
| ⚠️ | Stalled (no update >10 min) |
| ❌ | Failed with error |
| 🔁 | Retrying |

## Stale Detection

For any agent with status "running" but lastUpdate > 10 minutes:
- Change display to ⚠️ stalled
- Add "(no update in X min)" to Last Update column
- Suggest: "Agent may be stalled. Use `/cf-recover` to investigate."

## Example Output

```
## Workflow Status

**Active Workflow:** Implementing user authentication
**Type:** task-agents
**Project:** PieDrive-AI (`main`)
**Started:** 15 minutes ago
**Checkpoint:** cp_1734400200

---

### Agent Activity

| # | Agent | Task | Status | Progress | Last Update |
|---|-------|------|--------|----------|-------------|
| 1 | coder | Implement login API | ✅ done | 5/5 | 10 min ago |
| 2 | coder | Create auth middleware | 🔄 running | 2/4 | 1 min ago |
| 3 | tester | Write auth tests | ⏳ pending | 0/3 | - |

---

### Completed
- Login API with JWT in `api/auth/login.ts`

### In Progress
- Auth middleware (50% complete)

### Pending
- Write auth tests
- Update documentation

---
```
