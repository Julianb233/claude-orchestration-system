# System Hub - Agent Quick Reference

**Load this file FIRST. It routes you to the right resources with minimal context.**

---

## Load Order Protocol

1. **Always load this file first** (~500 tokens)
2. **Look up task type below** → load only that workflow
3. **Load additional files only if needed**

This keeps context minimal while ensuring correct routing.

---

## Task → Workflow Routing

| Task Type | Workflow to Load | Named Agent |
|-----------|------------------|-------------|
| TypeScript/JavaScript | `workflows/proactive-actions.md` | Tyler-TypeScript |
| Code review | - | Rex-Reviewer |
| Bug investigation | `workflows/recovery-protocol.md` | Diana-Debugger |
| Architecture design | `knowledge/julian-stack.md` | Archie-Architect |
| Testing | - | Tessa-Tester |
| Deployment | `workflows/hive-coordination.md` | Petra-DevOps |
| Multi-agent task | `workflows/orchestrator-core.md` | Marcus-Orchestrator |
| Hive/multi-terminal | `workflows/hive-coordination.md` | - |
| Session start | `workflows/session-startup.md` | - |
| Project state | `workflows/state-management.md` | - |
| History/recall | `workflows/history-tracking.md` | Helena-Memory |
| File sync | `workflows/file-sync.md` | - |
| Security audit | - | Sage-Security |
| Monitoring | - | Otto-Observer |
| Python | - | Peter-Python |
| Database | - | Dana-Database |
| Frontend/UI | - | Fiona-Frontend |
| API docs | - | Adam-API |
| Kubernetes | - | Kirk-Kubernetes |
| Marketing | `knowledge/marketing-orchestrator.md` | Morgan-Marketing |
| Social media | - | Sophie-Social |
| Script writing | `knowledge/script-writer.md` | Scarlett-Script |
| Documentation | - | Gina-Guide |
| Branding | - | Bella-Branding |
| Rate limit hit | `workflows/rate-limit-handler.md` | - |
| Error encountered | `knowledge/error-remediation-map.md` | Diana-Debugger |
| Progress monitoring | `workflows/progress-monitor.md` | - |
| Resource constrained | `workflows/degradation-protocol.md` | - |
| Multi-repo task | `workflows/multi-repo.md` | Marcus-Orchestrator |
| Learning/improvement | `knowledge/agent-learning-patterns.md` | - |
| Night shift/sleep | `workflows/night-shift.md` | Bubba-Orchestrator |
| Autonomous mode | `workflows/night-shift.md` | Bubba-Orchestrator |
| Cloudflare AI/Agents | `knowledge/cloudflare-agents-sop.md` | Petra-DevOps |
| Workers AI | `knowledge/cloudflare-agents-sop.md` | Tyler-TypeScript |
| Edge AI deployment | `knowledge/cloudflare-agents-sop.md` | Petra-DevOps |
| YouTube learning | - | Victor-VideoLearner |
| Video skill extraction | - | Victor-VideoLearner |

---

## Named Agent Quick Lookup

**Full registry:** `/root/.claude/agents/_registry.md`

### Tier 1: Core (Use Daily)
| Name | Role | Base Agent |
|------|------|------------|
| Marcus | Orchestration | workflow-orchestrator |
| Tyler | TypeScript/JS | typescript-pro |
| Rex | Code Review | code-reviewer |
| Diana | Debugging | debugger |
| Archie | Architecture | backend-architect |

### Tier 2: Quality (Use Frequently)
| Name | Role | Base Agent |
|------|------|------------|
| Tessa | Testing | test-automator |
| Petra | Deployment | deployment-engineer |
| Helena | Memory/Context | context-manager |
| Sage | Security | security-auditor |
| Otto | Monitoring | observability-engineer |
| Victor | YouTube Skill Extraction | victor-videolearner |

### Tier 3-4: Specialized
Peter (Python), Dana (Database), Fiona (Frontend), Adam (API), Kirk (K8s), Morgan (Marketing), Sophie (Social), Scarlett (Scripts), Gina (Guides), Bella (Branding)

---

## Memory Namespaces (Consolidated v3.0)

**Full config:** `/root/.claude/config/namespaces.json`

| Namespace | TTL | Purpose |
|-----------|-----|---------|
| `session` | 24h | Current work context |
| `state` | 4h | **UNIFIED**: Checkpoints, recovery, results |
| `agent-coordinator` | 15m | **UNIFIED**: Agent status, progress, messages |
| `coordination` | 30m | **UNIFIED**: File locks, swarm coordination |
| `projects` | 30d | Project knowledge |
| `history` | 30d | Interaction history by repo |
| `config` | - | Settings, patterns (permanent) |
| `quality` | 7d | Code reviews, test results |
| `orchestration` | 9h | Night-shift, orchestration history |
| `monitoring` | 4h | Context health, metrics |
| `domain` | 90d | SixSigma, marketing, scripts |
| `learning` | 30d | ML patterns, agent performance |

**DEPRECATED** (use consolidated):
- `recovery` → `state`
- `agents` → `agent-coordinator`
- `agent-status` → `agent-coordinator`
- `file-locks` → `coordination`
- `swarms` → `coordination`

---

## Command Shortcuts

**Full router:** `/root/.claude/config/command-router.json`

### Navigation
| Shortcut | Action |
|----------|--------|
| `/n` | Next predicted actions |
| `/h` | View history |
| `/c` | Load project context |
| `/s` | Check file sync |

### Git
| Shortcut | Action |
|----------|--------|
| `/g` | Git smart operations |
| `/g commit` | Auto-generate commit |
| `/g pr` | Create pull request |
| `/p` | Push to remote |
| `/st` | Git status |

### Quality
| Shortcut | Action |
|----------|--------|
| `/r` | Code review |
| `/t` | Run tests |
| `/ok` | All checks |
| `/fix` | Auto-fix lint |

### Deploy
| Shortcut | Action |
|----------|--------|
| `/b` | Build |
| `/d` | Deploy |
| `/done` | Ship it (commit→push→PR) |

### Agents
| Shortcut | Action |
|----------|--------|
| `/dev` | App development |
| `/hygiene` | Data hygiene |
| `/mkt` | Marketing |
| `/integrate` | MCP Factory |
| `/sw` | Script writing |
| `/sm` | Social media |
| `/victor` | YouTube skill extraction |

---

## Error Quick Fixes

**Full map:** `/root/.claude/knowledge/error-remediation-map.md`

| Error Pattern | Quick Fix |
|---------------|-----------|
| `TS\d{4}` | Check types, run `tsc --noEmit` |
| `FAIL.*\.test\.` | Run failing test in isolation |
| `Cannot find module` | Check imports, run `npm install` |
| `ENOENT` | File not found - check path |
| `EACCES` | Permission denied - check perms |
| `429 Too Many Requests` | Rate limited - wait or switch API |
| `Prisma\|Drizzle` | Run migrations, check schema |
| `CORS` | Check API headers |
| `JWT\|token` | Check auth, refresh token |

---

## File Locations

| Type | Path |
|------|------|
| Workflows | `/root/.claude/workflows/` |
| Agents | `/root/.claude/agents/` |
| Knowledge | `/root/.claude/knowledge/` |
| Commands | `/root/.claude/commands/` |
| Config | `/root/.claude/config/` |
| Scripts | `/root/scripts/` |
| Repos | `/root/github-repos/` |
| Claude Flow | `/root/.claude-flow/` |

---

## Autonomous Loading Protocol

When you receive a task:

1. **Parse task type** from user request
2. **Look up in Task → Workflow table above**
3. **Load only that workflow** (if any)
4. **Check if named agent applies** → spawn if needed
5. **Execute task**
6. **Update agent-status namespace** if multi-agent
7. **Save to history** if significant

This keeps context under 1000 tokens for most tasks.

---

## Inter-Agent Communication (v3.0)

**Check agent status (CONSOLIDATED):**
```
mcp__claude-flow__memory_usage(action="retrieve", namespace="agent-coordinator", key="agent-{name}")
```

**Broadcast message (CONSOLIDATED):**
```
mcp__claude-flow__memory_usage(action="store", namespace="agent-coordinator", key="msg-{from}-{to}", value={...}, ttl=900)
```

**Acquire file lock (CONSOLIDATED):**
```
mcp__claude-flow__memory_usage(action="store", namespace="coordination", key="lock-{filepath-hash}", value={"lockedBy": "{agent}"}, ttl=1800)
```

**Quick agent lookup:**
```
// Use agent-index.json instead of loading full registry
const agent = agentIndex.quickLookup["Tyler"];  // → "Tyler-TypeScript"
const byTask = agentIndex.taskMapping["typescript"];  // → "Tyler-TypeScript"
```

---

## Credential Lookup

**Search Notion:** `mcp__notion__API-post-search` with `"[service] API key"`

| Service | Search Term |
|---------|-------------|
| GitHub | "GitHub credentials API" |
| Vercel | "Vercel api key" |
| OpenAI | "OpenAI API key" |
| Notion | "Notion API" |
| Twilio | "Twilio credentials" |
| Cloudflare | "Cloudflare API" |
| Workers AI | "Cloudflare Workers AI" |

---

## Key Principles

1. **Load minimal context** - Only what's needed for the task
2. **Check local first** - Project files before Notion
3. **Named agents by task** - Match agent to work type
4. **Coordinate via memory** - Use namespaces for multi-agent
5. **Checkpoint before complex** - Save state before multi-agent work
6. **Update status regularly** - Every 30s during long tasks

---

## Advanced Features

### Learning Loop
**File:** `knowledge/agent-learning-patterns.md`
- Tracks successful agent combinations
- Stores resolution patterns for fast fixes
- Records effective prompts per agent
- Query before spawning agents for best combo

### Performance Metrics
**Config:** `config/metrics-config.json`
- Agent task completion times
- Success rates by agent and task type
- System resource tracking
- Automated alerts on thresholds

### Graceful Degradation
**File:** `workflows/degradation-protocol.md`
- Auto-detects resource constraints
- Reduces capabilities gracefully (Levels 0-3)
- Maintains core functionality under pressure
- Auto-recovers when resources free

### Multi-Repo Coordination
**File:** `workflows/multi-repo.md`
- Cross-repository task management
- Monorepo-aware operations
- Synchronized deployments
- Shared dependency updates
