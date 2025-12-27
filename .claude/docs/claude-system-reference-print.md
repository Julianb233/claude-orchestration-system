# Julian's Claude Code System Reference

**Version 2.0 | December 17, 2025**

---

## Table of Contents

1. System Architecture Overview
2. Named Agent Directory
3. Workflow Reference
4. Memory Namespaces
5. Commands & Shortcuts
6. Context Loading Triggers
7. Inter-Agent Communication Protocol
8. File Structure Map

---

## 1. System Architecture Overview

```
                    CLAUDE.md (Minimal Orchestrator)
                              |
           +------------------+------------------+
           |                  |                  |
      Workflows/         agents/            knowledge/
           |                  |                  |
    +------+------+    +------+------+    +------+------+
    |      |      |    |      |      |    |      |      |
 state  proactive  ...  _registry  ...   stack  swarm  ...
 mgmt   actions         (named)          guide  guide
```

**Design Philosophy:**
- CLAUDE.md is a minimal orchestrator (~6,500 chars)
- Workflows load autonomously based on context detection
- Named agents use PersonName-Role format for natural recall
- Multi-terminal agents communicate via Claude Flow memory

---

## 2. Named Agent Directory

### Tier 1: Core Development (Highest Priority)

| Rank | Name | Role | Base Agent | When to Use |
|------|------|------|------------|-------------|
| 1 | **Marcus-Orchestrator** | Multi-agent coordination | workflow-orchestrator | Complex multi-step tasks |
| 2 | **Tyler-TypeScript** | TS/JS development | typescript-pro | Every coding session |
| 3 | **Rex-Reviewer** | Code review | code-reviewer | Before commits |
| 4 | **Diana-Debugger** | Bug investigation | debugger | When stuck on bugs |
| 5 | **Archie-Architect** | System design | backend-architect | New features, design |

### Tier 2: Quality & Operations (High Use)

| Rank | Name | Role | Base Agent | When to Use |
|------|------|------|------------|-------------|
| 6 | **Tessa-Tester** | Test automation | test-automator | After implementing features |
| 7 | **Petra-DevOps** | Deployment | deployment-engineer | Production deployments |
| 8 | **Helena-Memory** | Context/history | context-manager | Recall previous sessions |
| 9 | **Sage-Security** | Security audits | security-auditor | Before deploying sensitive code |
| 10 | **Otto-Observer** | Monitoring | observability-engineer | Production health |

### Tier 3: Specialized Development (Medium Use)

| Rank | Name | Role | Base Agent | When to Use |
|------|------|------|------------|-------------|
| 11 | **Peter-Python** | Python development | python-pro | Python scripts/backends |
| 12 | **Dana-Database** | Data modeling | database-architect | Database design |
| 13 | **Fiona-Frontend** | UI development | frontend-developer | React/UI components |
| 14 | **Adam-API** | API documentation | api-documenter | API specs |
| 15 | **Kirk-Kubernetes** | Container orchestration | kubernetes-architect | Container infrastructure |

### Tier 4: Business & Content (Situational)

| Rank | Name | Role | Base Agent | When to Use |
|------|------|------|------------|-------------|
| 16 | **Morgan-Marketing** | Campaigns | marketing-orchestrator | Marketing campaigns |
| 17 | **Sophie-Social** | Social content | social-media-agent | Social media content |
| 18 | **Scarlett-Script** | Video scripts | script-writer | Video/ad scripts |
| 19 | **Gina-Guide** | Documentation | how-to-guide-agent | User documentation |
| 20 | **Bella-Branding** | Brand consistency | branding-agent | Brand consistency |

### Natural Language Invocation Examples

**Status queries:**
- "What is Tyler working on?"
- "Is Rex available for a review?"
- "Who is handling the auth feature?"

**Task assignment:**
- "Have Marcus coordinate the API migration"
- "Ask Diana to investigate the payment bug"
- "Tell Tessa to write integration tests"

**Capability queries:**
- "Who can help with Python?"
- "Which agent handles deployments?"
- "Find someone for security review"

---

## 3. Workflow Reference

### Workflow Files

| File | Purpose | Auto-Loads When |
|------|---------|-----------------|
| `session-startup.md` | Session initialization, recovery check | Session starts |
| `state-management.md` | .claude-state.json rules | In project directory |
| `proactive-actions.md` | Anticipation system, shortcuts | Action completed |
| `recovery-protocol.md` | Checkpoints, agent recovery | Multi-agent task |
| `history-tracking.md` | Auto-save interaction history | Significant work done |
| `file-sync.md` | Agent file sync protocol | File sync needed |
| `hive-coordination.md` | Multi-terminal hive system | Hive commands |

### Core Directives (Always Execute)

1. **Maintain `.claude-state.json`** in active projects
2. **Check local files FIRST** before Notion
3. **Fetch credentials** from Notion when needed
4. **Save to history** after significant work
5. **Checkpoint before multi-agent work**

### Proactive Anticipation Rules

| After This | Predict This | Action |
|------------|--------------|--------|
| Editing code | Run tests | Pre-stage: `npm test` |
| Tests pass | Commit changes | Pre-stage: `/g commit` |
| Commit succeeds | Push to remote | Pre-stage: `git push` |
| Push succeeds | Create PR | Pre-stage: `/g pr` |
| Fixing errors | Re-run build | Pre-stage: `npm run build` |
| Session start | Load context | Auto-execute: `/c` |

---

## 4. Memory Namespaces

### Active Namespaces

| Namespace | Purpose | TTL |
|-----------|---------|-----|
| `session` | Current work context | 24 hours |
| `history` | Interactions grouped by repo | 30 days |
| `recovery` | Error recovery points, checkpoints | 4 hours |
| `projects` | Project knowledge cache | 30 days |
| `config` | User preferences/settings | Permanent |
| `agents` | Agent state and progress | 1 hour |
| `file-locks` | File lock registry | 30 minutes |
| `agent-registry` | Active agents list | Session |
| `agent-status` | Real-time agent status | 5 minutes |
| `agent-broadcast` | Inter-agent messages | 1 hour |
| `migration` | System migration notices | 7 days |

### Memory Operations

**Store:**
```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "session",
  key: "current-task",
  value: "{task data}",
  ttl: 86400
})
```

**Retrieve:**
```javascript
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "session",
  key: "current-task"
})
```

**Search:**
```javascript
mcp__claude-flow__memory_search({
  pattern: "task-*",
  namespace: "session"
})
```

---

## 5. Commands & Shortcuts

### Navigation Shortcuts

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `/n` | `/next` | Show predicted next actions |
| `/h` | `/cf-history` | View interaction history |
| `/c` | `/context` | Load project context |
| `/s` | `/sync` | Check file sync notifications |

### Git Shortcuts

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `/g` | `/git-smart` | Smart git operations |
| `/g commit` | - | Auto-generate commit message |
| `/g pr` | - | Create pull request |
| `/p` | `git push` | Push to remote |
| `/st` | `git status` | Quick status |

### Quality Shortcuts

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `/r` | `/review` | Auto code review |
| `/t` | `/test-watch` | Run tests with auto-fix |
| `/ok` | - | All checks (lint, types, test, build) |
| `/fix` | - | Auto-fix lint/format |

### Deploy Shortcuts

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `/b` | - | Build project |
| `/d` | - | Deploy to production |
| `/done` | - | Ship it (commit->push->PR) |

### Specialized Agent Commands

| Command | Shortcut | Agent |
|---------|----------|-------|
| `/app-dev` | `/dev` | App Development |
| `/data-hygiene` | `/hygiene` | Data Hygiene |
| `/marketing-orchestrator` | `/mkt` | Marketing |
| `/mcp-factory` | `/integrate` | MCP Factory |
| `/script` | `/sw` | Script Writing |
| `/social` | `/sm` | Social Media |

---

## 6. Context Loading Triggers

### Trigger Types

| Type | Example | Loads |
|------|---------|-------|
| Session | New session starts | `session-startup.md` |
| Directory | Project directory detected | `state-management.md` |
| Intent | Multi-agent task started | `recovery-protocol.md` |
| Command | Hive command issued | `hive-coordination.md` |
| Keyword | Marketing terms detected | `marketing-orchestrator.md` |
| Error | TypeScript error | `typescript-pro.md` |
| Agent Name | Marcus mentioned | `_registry.md` |

### Context Budget

| Layer | Max Tokens |
|-------|------------|
| Base (CLAUDE.md) | Reserved |
| Project | 1,000 |
| Task | 2,000 |
| Dynamic | 500 |
| **Total** | **4,000** |

### Loading Behavior

- **Silent**: Don't announce workflow loading
- **Cache**: Loaded content cached for 1 hour
- **Priority**: Critical > High > Medium > Low

---

## 7. Inter-Agent Communication Protocol

### Agent Status Broadcasting

Agents broadcast status updates to `agent-status` namespace:

```json
{
  "agentName": "Tyler-TypeScript",
  "status": "working|idle|blocked",
  "currentTask": "Implementing auth",
  "filesLocked": ["src/auth.ts"],
  "lastHeartbeat": "{timestamp}"
}
```

### File Locking Protocol

Before editing, agents acquire locks:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "file-locks",
  key: "src/auth.ts",
  value: {"lockedBy": "Tyler-TypeScript", "since": "{timestamp}"},
  ttl: 1800
})
```

### Heartbeat Configuration

| Setting | Value |
|---------|-------|
| Interval | 30 seconds |
| Stale Threshold | 5 minutes |
| Offline Threshold | 15 minutes |

### Query Patterns

**Status query:**
"What is {agent} working on?"

**Availability query:**
"Is {agent} available?"

**Capability query:**
"Who can help with {topic}?"

---

## 8. File Structure Map

```
/root/.claude/
├── CLAUDE.md                    # Minimal orchestrator (~6,500 chars)
├── agents/
│   ├── _registry.md             # Named agent registry (20 agents)
│   ├── app-development-agent.md
│   ├── data-hygiene-agent.md
│   └── [104 more agent files]
├── commands/
│   └── [191 command files]
├── docs/
│   ├── claude-system-reference.html  # Interactive reference
│   └── claude-system-reference-print.md  # This file
├── knowledge/
│   ├── julian-stack.md
│   ├── swarm-orchestration-guide.md
│   ├── marketing-orchestrator.md
│   ├── mcp-patterns.md
│   ├── script-writer.md
│   └── system-routing-index.md
├── templates/
│   └── [template files]
└── workflows/                   # Extracted workflow logic
    ├── state-management.md
    ├── session-startup.md
    ├── proactive-actions.md
    ├── recovery-protocol.md
    ├── history-tracking.md
    ├── file-sync.md
    └── hive-coordination.md

/root/.claude-flow/
├── agent-coordination/
│   ├── named-agents.json        # Named agent config
│   └── protocol.json
├── context-loading/
│   ├── triggers.json            # Auto-load triggers
│   └── knowledge-index.json     # Section-level index
├── recovery/
│   └── [checkpoint files]
└── [other config files]
```

---

## Quick Reference Card

### Named Agents (Top 10)

| Short | Name | Role |
|-------|------|------|
| @marcus | Marcus-Orchestrator | Orchestration |
| @tyler | Tyler-TypeScript | TS/JS |
| @rex | Rex-Reviewer | Review |
| @diana | Diana-Debugger | Debug |
| @archie | Archie-Architect | Design |
| @tessa | Tessa-Tester | Testing |
| @petra | Petra-DevOps | Deploy |
| @helena | Helena-Memory | Context |
| @sage | Sage-Security | Security |
| @otto | Otto-Observer | Monitoring |

### Key Shortcuts

| Action | Shortcut |
|--------|----------|
| Next actions | `/n` |
| History | `/h` |
| Context | `/c` |
| Git smart | `/g` |
| Review | `/r` |
| Test | `/t` |
| Deploy | `/d` |
| Ship it | `/done` |

### Memory Namespaces

| Namespace | TTL |
|-----------|-----|
| session | 24h |
| history | 30d |
| recovery | 4h |
| agents | 1h |
| file-locks | 30m |

---

**Document generated:** December 17, 2025
**System version:** 2.0
**CLAUDE.md size:** 6,458 characters (90% reduction from 65,000)
