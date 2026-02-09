# System Routing Index

**Migration Date:** 2025-12-17
**Purpose:** Maps original CLAUDE.md sections to their new modular locations

---

## Content Migration Map

### Original Section → New Location

| Original CLAUDE.md Section | New File Location | Status |
|---------------------------|-------------------|--------|
| Project State Auto-Save | `/root/.claude/workflows/state-management.md` | Migrated |
| Proactive Anticipation System | `/root/.claude/workflows/proactive-actions.md` | Migrated |
| Predictive Action Rules | `/root/.claude/workflows/proactive-actions.md` | Migrated |
| Auto-Execute Rules | `/root/.claude/workflows/proactive-actions.md` | Migrated |
| Efficiency Shortcuts | `/root/.claude/workflows/proactive-actions.md` | Migrated |
| Credential Management | `/root/.claude/CLAUDE.md` (condensed) | Retained |
| Project Locations | `/root/.claude/CLAUDE.md` | Retained |
| Claude Flow & Multi-Agent | `/root/.claude/workflows/recovery-protocol.md` | Migrated |
| Autonomous Operation | `/root/.claude/workflows/session-startup.md` | Migrated |
| Auto-Save Interaction History | `/root/.claude/workflows/history-tracking.md` | Migrated |
| Workflow Recovery System | `/root/.claude/workflows/recovery-protocol.md` | Migrated |
| Claude Hive System | `/root/.claude/workflows/hive-coordination.md` | Migrated |
| Specialized Agents | `/root/.claude/knowledge/specialized-agents-guide.md` | Reference |
| Agent Commands Table | `/root/.claude/CLAUDE.md` (condensed) | Retained |
| Rate Limit Auto-Switching | `/root/.claude/workflows/session-startup.md` | Migrated |
| Swarm Orchestration Guide | `/root/.claude/knowledge/swarm-orchestration-guide.md` | Reference |
| Enhanced Workflow Commands | `/root/.claude/workflows/proactive-actions.md` | Migrated |
| E2E Testing Agent | `/root/.claude/agents/e2e-tester.md` | Reference |
| Agent File Sync System | `/root/.claude/workflows/file-sync.md` | Migrated |

---

## New File Structure

```
/root/.claude/
├── CLAUDE.md                    # Minimal orchestrator (~6,500 chars)
├── agents/
│   ├── _registry.md             # Named agent registry (20 agents)
│   └── [106 agent definitions]
├── commands/
│   └── [191 command files]
├── docs/
│   └── claude-system-reference.html  # Interactive reference
├── knowledge/
│   ├── julian-stack.md
│   ├── swarm-orchestration-guide.md
│   ├── marketing-orchestrator.md
│   ├── mcp-patterns.md
│   ├── script-writer.md
│   └── system-routing-index.md  # THIS FILE
└── workflows/                   # NEW - Extracted workflows
    ├── state-management.md      # Project state auto-save
    ├── session-startup.md       # Session init, auto-recovery
    ├── proactive-actions.md     # Anticipation, shortcuts
    ├── recovery-protocol.md     # Checkpoints, multi-agent recovery
    ├── history-tracking.md      # Interaction history, /h command
    ├── file-sync.md             # Agent file sync system
    └── hive-coordination.md     # Claude Hive multi-terminal

/root/.claude-flow/
├── agent-coordination/
│   ├── named-agents.json        # NEW - Named agent config
│   └── protocol.json
└── context-loading/             # NEW - Autonomous loading
    ├── triggers.json            # Auto-load triggers
    └── knowledge-index.json     # Section-level loading index
```

---

## Named Agent Registry

**Location:** `/root/.claude/agents/_registry.md`
**Config:** `/root/.claude-flow/agent-coordination/named-agents.json`

### Quick Lookup

| Name | Role | Base Agent |
|------|------|------------|
| Marcus | Orchestration | workflow-orchestrator |
| Tyler | TypeScript | typescript-pro |
| Rex | Code Review | code-reviewer |
| Diana | Debugging | debugger |
| Archie | Architecture | backend-architect |
| Tessa | Testing | test-automator |
| Petra | DevOps | deployment-engineer |
| Helena | Memory | context-manager |
| Sage | Security | security-auditor |
| Otto | Monitoring | observability-engineer |
| Peter | Python | python-pro |
| Dana | Database | database-architect |
| Fiona | Frontend | frontend-developer |
| Adam | API Docs | api-documenter |
| Kirk | Kubernetes | kubernetes-architect |
| Morgan | Marketing | marketing-orchestrator |
| Sophie | Social | social-media-agent |
| Scarlett | Scripts | script-writer |
| Gina | Guides | how-to-guide-agent |
| Bella | Branding | branding-agent |

---

## Memory Namespaces for Coordination

| Namespace | Purpose | TTL |
|-----------|---------|-----|
| `agent-registry` | Active agents list | Session |
| `agent-status` | Real-time agent status | 5 min |
| `agent-broadcast` | Inter-agent messages | 1 hour |
| `file-locks` | File lock registry | 30 min |
| `session` | Current work context | 24 hours |
| `history` | Interaction history | 30 days |
| `recovery` | Error recovery points | 1 hour |
| `migration` | System migration notices | 7 days |

---

## How to Find Content

### For Agents/Sub-agents:

1. **Core directives** → `/root/.claude/CLAUDE.md`
2. **Workflow logic** → `/root/.claude/workflows/[relevant].md`
3. **Agent definitions** → `/root/.claude/agents/[agent-name].md`
4. **Named agent lookup** → `/root/.claude/agents/_registry.md`
5. **Knowledge/guides** → `/root/.claude/knowledge/[topic].md`
6. **Commands** → `/root/.claude/commands/[command].md`
7. **System reference** → `/root/.claude/docs/claude-system-reference.html`

### For Context Loading:

1. **Triggers** → `/root/.claude-flow/context-loading/triggers.json`
2. **Knowledge index** → `/root/.claude-flow/context-loading/knowledge-index.json`
3. **Agent coordination** → `/root/.claude-flow/agent-coordination/named-agents.json`

---

## Migration Verification Checklist

- [x] Project State Auto-Save rules preserved
- [x] Proactive Anticipation System preserved
- [x] Credential Management workflow preserved
- [x] Claude Flow integration preserved
- [x] Autonomous operation rules preserved
- [x] History tracking format preserved
- [x] Recovery protocol preserved
- [x] Hive coordination preserved
- [x] Specialized agents referenced
- [x] File sync system preserved
- [x] Named agents created (20 total)
- [x] Context loading triggers defined
- [x] Interactive HTML reference created

---

## Notifying Other Agents

All agents should check the `migration` namespace on startup:

```javascript
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "migration",
  key: "system-restructure-2025-12-17"
})
```

This will return the migration notice with:
- What changed
- Where to find content now
- New routing paths
