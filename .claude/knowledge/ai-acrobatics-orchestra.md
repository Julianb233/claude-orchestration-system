# AI Acrobatics Orchestra

**Complete documentation of the autonomous AI agent orchestration system.**

## Overview

AI Acrobatics Orchestra is a multi-agent system that coordinates specialized AI agents to accomplish complex tasks autonomously. The system includes:

- **Claude Flow** - Core orchestration engine
- **Agent Swarms** - Coordinated multi-agent execution
- **MCP Factory** - Automatic API integration
- **Document Agents** - How-to guides, support docs, eBooks
- **File Sync** - Cross-agent file synchronization
- **Claude Hive** - Parallel terminal execution

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI ACROBATICS ORCHESTRA                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  Claude Flow  │  │  Claude Hive  │  │  MCP Factory  │       │
│  │  (Orchestrator)│  │  (Parallel)   │  │  (Integrator) │       │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘       │
│          │                  │                  │                │
│  ┌───────▼──────────────────▼──────────────────▼───────┐       │
│  │                   AGENT POOL                         │       │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │       │
│  │  │ Coding  │ │  Docs   │ │Security │ │  Infra  │    │       │
│  │  │ Agents  │ │ Agents  │ │ Agents  │ │ Agents  │    │       │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │       │
│  └─────────────────────────────────────────────────────┘       │
│                              │                                  │
│  ┌───────────────────────────▼───────────────────────────┐     │
│  │                    SHARED MEMORY                       │     │
│  │  Claude Flow Memory │ File Sync │ Notification Queue  │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Claude Flow (Orchestration Engine)

**Purpose:** Central coordination of all agents and workflows.

**Capabilities:**
- Swarm initialization and management
- Agent spawning and lifecycle
- Task orchestration and distribution
- Memory persistence across sessions
- Neural pattern learning
- Performance monitoring

**Commands:**
```bash
mcp__claude-flow__swarm_init(topology="hierarchical", maxAgents=8)
mcp__claude-flow__agent_spawn(type="coder", name="dev-1")
mcp__claude-flow__task_orchestrate(task="...", strategy="parallel")
mcp__claude-flow__swarm_status()
```

**Topologies:**
- `hierarchical` - Coordinator → Workers
- `mesh` - All agents interconnected
- `star` - Hub → Spokes
- `ring` - Sequential processing

### 2. Claude Hive (Parallel Execution)

**Purpose:** Run multiple Claude Code instances simultaneously.

**Commands:**
```bash
/root/scripts/claude-hive.sh start 3     # Start 3 workers
/root/scripts/claude-hive.sh status      # Check status
/root/scripts/claude-hive.sh stop        # Stop all
```

**Features:**
- Shared memory via Claude Flow
- Task queue distribution
- Autonomous operation
- Context preservation

### 3. MCP Factory (Integration Engine)

**Purpose:** Automatically create and integrate MCP servers.

**Commands:**
```bash
/mcp create stripe                       # Create from company name
/mcp create https://api.example.com      # Create from URL
/mcp discover                            # Scan Notion for APIs
/mcp daemon start                        # Start autonomous daemon
```

**Autonomous Features:**
- API discovery from name/URL
- Credential lookup in Notion
- MCP server code generation
- Auto-integration with Claude Code
- Agent training on usage

### 4. File Sync System

**Purpose:** Keep related files synchronized across agents.

**Commands:**
```bash
/sync                                    # Process pending syncs
/root/scripts/file-watcher-agent.sh watch /path  # Watch directory
/root/scripts/agent-notify.sh send main message  # Notify agent
```

**File Relations:**
- API changes → doc updates
- Schema changes → type regeneration
- Config changes → deployment triggers

### 5. Document Agents

**How-To Guide Agent:**
```bash
/guide <topic>                           # Create guide
/guide pdf <topic>                       # With PDF export
/guide workflow <name>                   # Document workflow
/guide "Topic" --audience developer      # Developer-focused
/guide "Topic" --format all              # All output formats
```

**Support Document Agent:**
```bash
/support faq <topic>                     # Generate FAQ
/support troubleshoot <issue>            # Troubleshooting guide
/support manual <feature>                # User manual
/support errors <app>                    # Error reference
```

**eBook Agent:**
```bash
/ebook create <title>                    # Create eBook
/ebook chapter <topic>                   # Add chapter
/ebook export pdf                        # Export to PDF
```

### 6. Social Media & Content Agents

**Social Media Agent:**
```bash
/social create "Topic"                   # Create multi-platform posts
/sm calendar                             # View content calendar
/sm preview                              # Generate HTML mockups
/sm-notion                               # Sync with Notion calendar
/sm-export buffer                        # Export for Buffer
```

**Video Scriptwriting (Built into Social Media Agent):**
```bash
/sm video "Topic" --platform reels       # Create video script
/sm video-brief "Topic"                  # Create video brief only
/sm hooks "Topic" --count 5              # Generate hook variations
/sm video-full "Topic"                   # Full package (script + hooks + caption)
```

**Script Writing Agent (Multi-Agent Swarm):**
```bash
/script create "Topic" --client=acme     # Create new script
/sw batch "Topic 1" "Topic 2"            # Batch create scripts
/sw export script_123 --format=html      # Export to HTML
/sw client add acme-corp                 # Add new client
/sw voice edit acme-corp                 # Edit brand voice
```

**Key Features:**
- Expert Storywriter, Marketer, Communicator mindset
- Story structures: PAS, BAB, HSO, AIDA
- Hook formulas: Question, Statement, Curiosity, Proof
- Platform-specific optimization (Reels, TikTok, LinkedIn, YouTube)
- A/B testing variations
- AI prompt generation for Midjourney, Runway, etc.

---

## Agent Categories

### Coding Agents

| Agent | Specialty | Best For |
|-------|-----------|----------|
| `python-pro` | Python 3.12+, async, FastAPI | Python projects |
| `typescript-pro` | TS, advanced types | TypeScript/Node |
| `rust-pro` | Rust, systems programming | Performance-critical |
| `golang-pro` | Go, concurrency | Microservices |
| `frontend-developer` | React, Next.js | Web frontends |
| `backend-architect` | API design, distributed systems | Backend services |
| `database-architect` | Schema design, optimization | Data layer |

### Analysis Agents

| Agent | Specialty | Best For |
|-------|-----------|----------|
| `code-reviewer` | Static analysis, security | Code review |
| `architect-review` | Architecture patterns | Design review |
| `error-detective` | Log analysis, debugging | Bug hunting |
| `performance-engineer` | Optimization, profiling | Performance |

### Infrastructure Agents

| Agent | Specialty | Best For |
|-------|-----------|----------|
| `cloud-architect` | AWS/Azure/GCP, IaC | Cloud infra |
| `kubernetes-architect` | K8s, GitOps | Container orchestration |
| `deployment-engineer` | CI/CD, GitHub Actions | Deployments |
| `observability-engineer` | Monitoring, tracing | Observability |

### Security Agents

| Agent | Specialty | Best For |
|-------|-----------|----------|
| `security-auditor` | DevSecOps, OWASP | Security audits |
| `backend-security-coder` | Auth, validation | Backend security |
| `frontend-security-coder` | XSS, CSP | Frontend security |

### Documentation Agents

| Agent | Specialty | Best For |
|-------|-----------|----------|
| `docs-architect` | Technical docs | Documentation |
| `tutorial-engineer` | Learning content | Tutorials |
| `api-documenter` | OpenAPI, API docs | API documentation |

### Content & Marketing Agents

| Agent | Specialty | Best For |
|-------|-----------|----------|
| `social-media-agent` | Multi-platform posts, video scripts | Social content |
| `script-writing-agent` | Brand-consistent scripts, swarm | Video production |
| `content-marketer` | Campaign strategy, SEO | Marketing content |
| `marketing-orchestrator` | Full campaign, 6 sub-agents | Comprehensive marketing |
| `branding-agent` | Brand consistency, tokens | Brand management |
| `board-of-advisors` | Expert marketing strategy, swarm | Strategic decisions |

### Board of Advisors

**Virtual advisory board featuring expert marketers:**

| Advisor | Expertise | Key Frameworks |
|---------|-----------|----------------|
| **Russell Brunson** | Funnels, traffic, webinars | Value Ladder, Perfect Webinar, Hook-Story-Offer |
| **Alex Hormozi** | Offers, pricing, leads | Value Equation, Grand Slam Offer, $100M Leads |
| **Dan Martell** | Time, SaaS, delegation | Buyback Loop, DRIP Matrix, Replacement Ladder |

**Commands:**
```bash
/advisors "strategic question"           # Full board consultation
/advisors board "launch strategy"        # Board meeting mode
/advisors russell "funnel advice"        # Russell Brunson only
/advisors alex "offer creation"          # Alex Hormozi only
/advisors dan "delegation"               # Dan Martell only
```

**Knowledge Base:** `/root/.claude/knowledge/board-of-advisors/`

**Social Media Agent Capabilities:**
- Multi-platform content (LinkedIn, Instagram, Twitter/X)
- Video scriptwriting with HOOK → PROBLEM → SOLUTION → CTA
- Story structures: PAS, BAB, HSO, AIDA
- HTML mockup previews
- Notion calendar integration
- Buffer/Later CSV export

**Script Writing Agent Sub-Agents:**
- `client-profiler` - Client identity, products, USPs
- `brand-voice-guardian` - Tone, vocabulary, style consistency
- `audience-analyst` - Target demographic, pain points
- `context-analyzer` - Script requirements, platform constraints
- `script-writer` - Hooks, scenes, dialogue, CTAs
- `output-formatter` - HTML docs, Notion pages, calendar entries

---

## Deployment Strategies

### When to Use Single Agent
- Simple, focused task
- One file/component
- Clear requirements

### When to Use 2-3 Agents
- Multiple concerns (code + tests)
- Need validation/review
- Cross-cutting changes

### When to Use Full Swarm
- Large-scale changes
- Multi-system features
- Architecture redesign
- Comprehensive audits

### Recommended Compositions

**Bug Fix:**
```
debugger + code-reviewer
Topology: star
```

**New Feature:**
```
architect-review + coder + tester + documenter
Topology: hierarchical
```

**Security Audit:**
```
security-auditor + backend-security-coder + code-reviewer
Topology: mesh
```

**Full Stack Feature:**
```
frontend-developer + backend-architect + database-architect + api-documenter
Topology: hierarchical
```

---

## Memory & Persistence

### Claude Flow Namespaces

| Namespace | Purpose | TTL |
|-----------|---------|-----|
| `session` | Current session state | 24h |
| `history` | Interaction history | 30 days |
| `projects` | Project knowledge | 30 days |
| `config` | Configuration | Permanent |
| `sync` | File sync notifications | 24h |
| `mcp-training` | MCP usage patterns | 30 days |
| `guides` | Generated guides | 30 days |
| `support` | Support documents | 30 days |
| `social-media` | Post drafts, calendar cache, hashtags | 7 days |
| `scripts` | Client profiles, brand voice, scripts | 30 days |
| `marketing` | Campaign data, audience insights | 30 days |
| `branding` | Active client brand profiles | 30 days |

### Persistence Commands

```bash
# Store
mcp__claude-flow__memory_usage(action="store", namespace="...", key="...", value="...")

# Retrieve
mcp__claude-flow__memory_usage(action="retrieve", namespace="...", key="...")

# Search
mcp__claude-flow__memory_search(pattern="...", namespace="...")

# Backup
mcp__claude-flow__memory_backup(path="/backup/location")
```

---

## Autonomous Operation

### Background Jobs

| Job | Schedule | Action |
|-----|----------|--------|
| `mcp-factory-scan` | Every 6h | Process MCP queue |
| `mcp-notion-discovery` | Every 12h | Scan Notion for APIs |
| `checkpoint-30m` | Every 30m | State snapshot |
| `neural-learn` | Every 6h | Pattern learning |
| `optimize-topology` | Every 12h | Swarm optimization |

### Starting Autonomous Mode

```bash
# Start MCP Factory daemon
nohup /root/scripts/mcp-factory-daemon.sh start &

# Start Claude Hive workers
/root/scripts/claude-hive.sh start 3

# Start file watcher
nohup /root/scripts/file-watcher-agent.sh watch /root/github-repos &
```

---

## Quick Reference

### Common Commands

| Command | Action |
|---------|--------|
| `/mcp create <name>` | Create MCP integration |
| `/guide <topic>` | Create how-to guide |
| `/support faq <topic>` | Generate FAQ |
| `/sync` | Process file syncs |
| `/h` | View history |
| `/c` | Load project context |
| `/r` | Code review |
| `/social create <topic>` | Create social media posts |
| `/sm video <topic>` | Create video script |
| `/script create <topic>` | Create branded script |

### Slash Command Shortcuts

| Shortcut | Full Command |
|----------|--------------|
| `/m` | `/mcp` |
| `/s` | `/sync` |
| `/h` | `/cf-history` |
| `/c` | `/context` |
| `/r` | `/review` |
| `/g` | `/git-smart` |
| `/t` | `/test-watch` |
| `/sm` | `/social` |
| `/sw` | `/script` |

---

## Troubleshooting

### Agent Not Responding
1. Check `mcp__claude-flow__swarm_status()`
2. Restart with `mcp__claude-flow__swarm_destroy()` then re-init

### MCP Creation Failed
1. Check credentials in Notion
2. Verify API URL is accessible
3. Check `/root/.claude-flow/mcp-factory/queue.jsonl`

### File Sync Not Working
1. Check `file-watcher-agent.sh check`
2. Verify file relations in `/root/.claude-flow/file-relations.json`
3. Process pending: `/sync`

### Memory Issues
1. Run `mcp__claude-flow__memory_analytics()`
2. Compress: `mcp__claude-flow__memory_compress()`
3. Check namespaces: `mcp__claude-flow__memory_namespace()`

---

*AI Acrobatics Orchestra v1.0*
*Autonomous AI Agent Orchestration System*
