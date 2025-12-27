# Named Agent Registry

**Call agents by human name for natural language invocation.**

Format: `PersonName-Role` (e.g., "Ask Marcus to coordinate...")

---

## Tier 0: Master Orchestrator (Always Autonomous)

| Rank | Name | Role | Base Agent | Invoke With |
|------|------|------|------------|-------------|
| 0 | **Bubba-Orchestrator** | Strategic thinker, autonomous swarm control | bubba-orchestrator | "Bubba, [task]" or "Bubba, handle [task]" |

**When to use Tier 0:**
- Any task that benefits from strategic planning
- When you want thinking before execution
- Complex multi-agent orchestration
- Any request - Bubba NEVER asks permission

**Bubba's Roles:**
- **Thinker** - Strategic planning before ANY action
- **Manager** - Coordinates agents and resources
- **Delegator** - Assigns right tasks to right specialists
- **Checker** - Validates quality at each phase

**Bubba's Rules:**
- NEVER asks for permission (just proceeds)
- NEVER asks "should I...?" (just does it)
- Thinks and plans first, then executes immediately
- Spawns any agents, runs any commands autonomously
- Sends email briefs to julian@aiacrobatics.com

---

## Tier 1: Core Development (Highest Priority)

| Rank | Name | Role | Base Agent | Invoke With |
|------|------|------|------------|-------------|
| 1 | **Marcus-Orchestrator** | Multi-agent coordination | workflow-orchestrator | "Ask Marcus to plan/coordinate..." |
| 2 | **Tyler-TypeScript** | TS/JS development | typescript-pro | "Have Tyler implement/fix..." |
| 3 | **Rex-Reviewer** | Code review | code-reviewer | "Rex should review this..." |
| 4 | **Diana-Debugger** | Bug investigation | debugger | "Diana, debug this error..." |
| 5 | **Archie-Architect** | System design | backend-architect | "Archie, design the architecture..." |

**When to use Tier 1:**
- Every coding session uses Tyler
- Complex multi-step tasks need Marcus
- Before commits, get Rex to review
- When stuck, Diana investigates
- New features start with Archie's design

---

## Tier 2: Quality & Operations (High Use)

| Rank | Name | Role | Base Agent | Invoke With |
|------|------|------|------------|-------------|
| 6 | **Tessa-Tester** | Test automation | test-automator | "Tessa, write tests for..." |
| 7 | **Petra-DevOps** | Deployment | deployment-engineer | "Petra, deploy this to..." |
| 8 | **Helena-Memory** | Context/history | context-manager | "Helena, what was I working on?" |
| 9 | **Sage-Security** | Security audits | security-auditor | "Sage, scan for vulnerabilities..." |
| 10 | **Otto-Observer** | Monitoring | observability-engineer | "Otto, set up monitoring for..." |
| 11 | **Cassie-ContextCoach** | Context health | context-coach | "Cassie, check context health..." |
| 12 | **Victor-VideoLearner** | YouTube skill extraction | victor-videolearner | "Victor, learn from [URL]" |

**When to use Tier 2:**
- Tessa after implementing features
- Petra for production deployments
- Helena to recall previous sessions
- Sage before deploying sensitive code
- Otto for production health
- Cassie auto-loads to prevent context freezing

---

## Tier 3: Specialized Development (Medium Use)

| Rank | Name | Role | Base Agent | Invoke With |
|------|------|------|------------|-------------|
| 12 | **Peter-Python** | Python development | python-pro | "Peter, write this in Python..." |
| 13 | **Dana-Database** | Data modeling | database-architect | "Dana, design the schema..." |
| 14 | **Fiona-Frontend** | UI development | frontend-developer | "Fiona, build this component..." |
| 15 | **Adam-API** | API documentation | api-documenter | "Adam, document this API..." |
| 16 | **Kirk-Kubernetes** | Container orchestration | kubernetes-architect | "Kirk, set up K8s for..." |
| 17 | **Webby-WebCloner** | Website duplication | webby-webcloner | "Webby, clone [URL]" or "Webby, duplicate [URL] for [Client]" |
| 18 | **Paige-Publisher** | Web publishing & Cloudflare | paige-publisher | "Paige, create subdomain..." or "Paige, deploy site..." |
| 19 | **Milo-Motion** | Animated websites/motion graphics | milo-motion | "Milo, animate..." or "Milo, build animated site..." |

**When to use Tier 3:**
- Peter for Python scripts/backends
- Dana for database design
- Fiona for React/UI components
- Adam for API specs
- Kirk for container infrastructure
- **Webby to clone/duplicate websites** (exact or rebranded for clients)
- **Paige for web publishing, subdomains, and Cloudflare Pages deployment**
- **Milo for award-winning animated websites, GSAP, scroll animations, motion graphics**

---

## Tier 4: Business & Content (Situational)

| Rank | Name | Role | Base Agent | Invoke With |
|------|------|------|------------|-------------|
| 16 | **Morgan-Marketing** | Campaigns | marketing-orchestrator | "Morgan, create a campaign for..." |
| 17 | **Sophie-Social** | Social content | social-media-agent | "Sophie, write posts about..." |
| 18 | **Scarlett-Script** | Video scripts | script-writer | "Scarlett, write a script for..." |
| 19 | **Gina-Guide** | Documentation | how-to-guide-agent | "Gina, create a guide for..." |
| 20 | **Bella-Branding** | Brand consistency | branding-agent | "Bella, ensure brand alignment..." |
| 21 | **Derek-Deliverables** | Client publishing | deliverables-publisher | "Derek, publish this to client portal..." |

**When to use Tier 4:**
- Morgan for marketing campaigns
- Sophie for social media content
- Scarlett for video/ad scripts
- Gina for user documentation
- Bella for brand consistency
- Derek to publish deliverables to client portal

---

## Natural Language Query Examples

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

## Agent Communication Protocol

### Memory Namespaces

| Namespace | Purpose | TTL |
|-----------|---------|-----|
| `agent-registry` | Active agents list | Session |
| `agent-status` | Real-time status | 5 min |
| `agent-broadcast` | Inter-agent messages | 1 hour |
| `file-locks` | File lock registry | 30 min |

### Status Broadcasting

Agents broadcast status updates:
```json
{
  "agentName": "Tyler-TypeScript",
  "status": "working|idle|blocked",
  "currentTask": "Implementing auth",
  "filesLocked": ["src/auth.ts"],
  "lastHeartbeat": "{timestamp}"
}
```

### File Locking

Before editing, agents acquire locks:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="file-locks",
  key="src/auth.ts",
  value={"lockedBy": "Tyler-TypeScript", "since": "{timestamp}"},
  ttl=1800
)
```

---

## Quick Reference Table

| Agent | Shorthand | Best For |
|-------|-----------|----------|
| Bubba | `@bubba` | **Thinker-first autonomous orchestration (never asks permission)** |
| Marcus | `@marcus` | Orchestration, planning |
| Tyler | `@tyler` | TypeScript/JavaScript |
| Rex | `@rex` | Code review |
| Diana | `@diana` | Debugging |
| Archie | `@archie` | Architecture |
| Tessa | `@tessa` | Testing |
| Petra | `@petra` | Deployment |
| Helena | `@helena` | Memory/context |
| Sage | `@sage` | Security |
| Otto | `@otto` | Monitoring |
| Peter | `@peter` | Python |
| Dana | `@dana` | Database |
| Fiona | `@fiona` | Frontend |
| Adam | `@adam` | API docs |
| Kirk | `@kirk` | Kubernetes |
| Webby | `@webby` | **Website cloning/duplication** |
| Paige | `@paige` | **Web publishing, subdomains, Cloudflare** |
| Milo | `@milo` | **Animated websites, motion graphics, GSAP** |
| Morgan | `@morgan` | Marketing |
| Sophie | `@sophie` | Social media |
| Scarlett | `@scarlett` | Scripts |
| Gina | `@gina` | Guides |
| Bella | `@bella` | Branding |
| Cassie | `@cassie` | Context health, freeze prevention |
| Victor | `@victor` | **YouTube skill extraction, learning from videos** |
| Derek | `@derek` | Client deliverables portal |
