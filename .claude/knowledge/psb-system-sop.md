# PSB System - Project Startup SOP

**Standard Operating Procedure for Claude Code Project Startup**

Version: 1.0 | Based on methodology by Avthar Sewrathan

---

## Overview

The PSB System (Plan, Setup, Build) eliminates "freestyle prompting" - starting projects without blueprints. This structured approach ensures:

- **Reduced context switching** - Clear plans reduce constant clarification
- **Consistency** - Standardized setup reduces "works on my machine" errors
- **Scalability** - Documentation allows projects to grow beyond simple scripts

| Phase | Focus | Outcome |
|-------|-------|---------|
| **PLAN** | Requirements & definitions | Project Spec Document |
| **SETUP** | Environment & tooling | Ready-to-code repo with automation |
| **BUILD** | Execution & iteration | Functional MVP |

---

## Phase 1: PLAN

**CRITICAL: Do not write a single line of code until this phase is complete.**

### Two Critical Questions

Before ANY AI tool engagement, answer these:

#### Question 1: What problem are you solving, and who is it for?

Define core utility. Avoid vague descriptions.

| Bad | Good |
|-----|------|
| "A to-do app" | "A task management CLI for developers who hate using a mouse" |
| "A website" | "A landing page for SaaS targeting agency owners who need lead gen" |

#### Question 2: What is your MVP scope?

Define the absolute minimum feature set for v1.0. If a feature is "nice to have," **cut it immediately**.

### Creating the Project Spec Document

Output: A single file (`spec.md` or `project_requirements.md`)

**Template Structure:**

```markdown
# Project Spec: [Project Name]

## 1. Project Overview
[High-level summary - 2-3 sentences]

## 2. Problem Statement
What problem are we solving?
Who is this for?

## 3. MVP Scope
### Must Have (v1.0)
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

### NOT in MVP (Future)
- Feature X
- Feature Y

## 4. User Stories
- "User can [action] so that [benefit]"
- "User can [action] so that [benefit]"

## 5. Technical Requirements
### Tech Stack
- Framework:
- Database:
- Hosting:
- Auth:

### Integrations
- [API/Service 1]
- [API/Service 2]

### Performance Constraints
- [e.g., "Page load < 2s"]

## 6. Architecture Notes
[Brief folder structure or system design]
```

**CRITICAL: Keep under 2 pages. Concise enough for LLM context, comprehensive enough to avoid ambiguity.**

---

## Phase 2: SETUP (7-Step Checklist)

### Step 1: GitHub Repository Setup

- [ ] Initialize Git repository
- [ ] Create standard folder structure for the language
- [ ] Enable GitHub Issues for issue-based development

```
/src
/tests
/docs
/scripts
```

### Step 2: Environment Variables (.env)

- [ ] Create `.env` file for API keys and secrets
- [ ] Create `.env.example` with dummy values
- [ ] **SECURITY:** Add `.env` to `.gitignore` immediately

### Step 3: CLAUDE.md Configuration

**Most critical setup file** - Acts as the system prompt for project context.

Create `CLAUDE.md` in root directory with:

```markdown
# Project: [Name]

## Build/Run Commands
- Start server: `npm run dev`
- Run tests: `npm test`
- Build: `npm run build`

## Code Style Guidelines
- [Naming conventions]
- [Formatting rules]
- [Import ordering]

## Architecture Notes
- /src/components - React components
- /src/api - API routes
- /src/lib - Utilities
```

### Step 4: Automated Project Documentation

- [ ] Create `DOCS.md` or similar summary file
- [ ] Instruct Claude: "Update DOCS.md after completing major features"

### Step 5: Install Plugins

- [ ] Install standard plugins (file manipulation, web search)
- [ ] Verify via `/config` menu

### Step 6: Install MCP Servers

Connect Claude to external tools:

- [ ] `sqlite-mcp` for database access
- [ ] `github-mcp` for issue tracking
- [ ] Configure connection strings

### Step 7: Custom Slash Commands & Sub-agents

- [ ] Define shortcuts (e.g., `/test` runs full test suite)
- [ ] Configure sub-agents (QA Agent, Builder Agent)

---

## Advanced Setup (Optional)

### Preconfigure Permissions

Pre-authorize Claude for project directory to skip approval prompts:
- Speeds workflow significantly
- Requires trust in model

### Setup Hooks

Configure pre-commit hooks (Husky or scripts):
- Force lint check before commit
- Run tests before allowing commit
- Prevent broken code commits

---

## Phase 3: BUILD

### Workflow Selection

| Workflow | Best For |
|----------|----------|
| **Single Feature** | Small features, bug fixes, early MVP |
| **Issue-Based** | Medium-large projects, teams, tracking |
| **Multi-Agent** | Rapid prototyping, parallel features |

### Workflow 1: Single Feature Development

1. **Context Load:** Run `claude` in terminal
2. **Prompt:** "Read spec.md. Implement [feature]."
3. **Review:** Claude writes -> User reviews diff -> Accept
4. **Commit:** Claude commits to main

### Workflow 2: Issue-Based Development

1. **Create Issue:** GitHub Issue with task details
2. **Prompt:** "Read Issue #X. Create branch 'feat/[name]'. Implement."
3. **Development:** Claude works on isolated branch
4. **PR:** Claude opens Pull Request linked to issue
5. **Merge:** Human reviews and merges

### Workflow 3: Multi-Agent (Multi-Clauding)

Use Git Worktrees for parallel development:

```bash
# Setup worktrees
git worktree add ../project-backend backend
git worktree add ../project-frontend frontend

# Terminal A
cd ../project-backend && claude
"Build the backend API"

# Terminal B
cd ../project-frontend && claude
"Build the frontend"

# Merge when ready
```

### The Golden Rule

**Build iteratively:**
- Implement one function
- Test it
- Move to next

**DO NOT** ask for entire app in one prompt.

---

## Productivity Tips

| Tip | Command/Action |
|-----|----------------|
| Compact context | `/compact` - Summarize history, free context |
| Detailed commits | Ask for "why" not just "what" changed |
| Cost management | Use `.claudeignore` to exclude large assets |
| Avoid loops | Stop, clear, re-state small goal |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Getting stuck/loop | Stop agent. Clear context. Re-state immediate small goal. |
| Hallucinating APIs | Upload official docs OR "Check available methods in file X" |
| Breaking existing code | Ensure unit tests. "Run tests before asking for approval." |

---

## Pre-Flight Checklist

Use before every session:

- [ ] **PLAN:** Spec document is up to date?
- [ ] **SETUP:** `.env` loaded? Repo clean?
- [ ] **SETUP:** `CLAUDE.md` contains current rules?
- [ ] **BUILD:** Selected correct workflow (Feature vs Issue vs Multi)?

---

## Glossary

| Term | Definition |
|------|------------|
| **MCP** | Model Context Protocol - Standard for connecting AI to external tools |
| **CLAUDE.md** | Custom config file instructing Claude on project specifics |
| **Worktree** | Git feature for multiple branches checked out in different directories |
| **PSB** | Plan, Setup, Build - This methodology |
