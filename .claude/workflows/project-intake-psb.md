# Project Intake Workflow (PSB System)

**Trigger:** User says "create a new project", "start a project", "build a new app", "new project", etc.

**Purpose:** Gather PSB System requirements BEFORE any code is written.

---

## Trigger Detection

Activate when user message contains:
- "new project"
- "start a project"
- "create a project"
- "build a new"
- "make me a"
- "I want to build"
- "let's build"
- "spin up a new"
- "scaffold a"

---

## Intake Protocol

### Step 1: Core Questions (MANDATORY)

Ask these two questions immediately:

```
Before we write any code, I need to understand the blueprint.

**Question 1: What problem are you solving, and who is it for?**
Be specific - not "a to-do app" but "a task management CLI for developers who hate using a mouse"

**Question 2: What is your MVP scope?**
What are the 3-5 MUST-HAVE features for v1.0? Everything else gets cut.
```

### Step 2: Technical Context (Based on Response)

After core answers, gather:

```
Got it. A few more quick questions:

**Tech Stack Preferences:**
- Framework preference? (Next.js, React, Vue, Python, etc.)
- Database? (Postgres, SQLite, Supabase, none)
- Any specific APIs or integrations needed?

**Constraints:**
- Any performance requirements? (e.g., "must load in <2s")
- Hosting preference? (Vercel, AWS, Cloudflare, etc.)
```

### Step 3: Generate Spec Document

After gathering info, Bubba generates:

```markdown
# Project Spec: [Name]

## Problem & Audience
[From Question 1]

## MVP Scope (v1.0)
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

## Tech Stack
- Framework: [chosen]
- Database: [chosen]
- Hosting: [chosen]
- Integrations: [list]

## Out of Scope (Future)
- [Nice-to-haves mentioned but cut]
```

### Step 4: Confirm Before Proceeding

```
Here's the spec I've created:

[Display spec]

Ready to proceed with Setup phase?
- I'll create the repo structure
- Set up CLAUDE.md with project rules
- Configure environment

Say "go" to proceed or tell me what to adjust.
```

---

## Quick Intake (Experienced Users)

If user provides detailed requirements upfront, skip to confirmation:

**Detection:** User message includes:
- Clear problem statement
- Defined MVP features (3+)
- Tech stack mentioned

**Response:**
```
Great, you've given me the blueprint. Let me confirm:

Problem: [extracted]
MVP Features:
- [extracted]
- [extracted]

Tech Stack: [extracted]

Ready to set up the project? Say "go" or adjust anything.
```

---

## Memory Storage

Store project spec for context:

```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="projects",
  key="{project-slug}-spec",
  value={
    "name": "...",
    "problem": "...",
    "audience": "...",
    "mvpFeatures": [...],
    "techStack": {...},
    "constraints": {...},
    "createdAt": "{timestamp}"
  },
  ttl=2592000  // 30 days
)
```

---

## Post-Intake: Setup Phase

After confirmation, Bubba executes PSB Setup:

1. **Create repo** with proper structure
2. **Generate CLAUDE.md** with project rules
3. **Create spec.md** from gathered requirements
4. **Set up .env.example** if integrations needed
5. **Configure MCP** connections if databases/APIs involved

---

## Anti-Patterns (BLOCK THESE)

If user tries to skip planning:

```
User: "Just make me a to-do app"

Response:
"Hold up - 'to-do app' is too vague and leads to chaos.

Quick questions before code:
1. Who is this for specifically?
2. What makes this different from existing apps?
3. What 3 things MUST it do in v1?

This takes 2 minutes and saves hours of rework."
```

---

## Integration with Named Agents

After intake, Bubba spawns appropriate specialists:

| Project Type | Primary Agents |
|--------------|----------------|
| Web App (React/Next) | Tyler-TypeScript, Fiona-Frontend |
| API/Backend | Tyler-TypeScript, Adam-API |
| Python Project | Peter-Python, Dana-Database |
| Full-Stack | Archie-Architect, Tyler, Fiona |
| CLI Tool | Tyler-TypeScript or Peter-Python |

---

## Example Flow

**User:** "I want to create a new project"

**Bubba:**
```
Before we write any code, I need the blueprint.

**Question 1:** What problem are you solving, and who is it for?
(Be specific - not "a website" but "a portfolio site for freelance designers to showcase work and capture leads")

**Question 2:** What's your MVP scope?
(3-5 must-have features for v1.0 - everything else gets cut)
```

**User:** "It's a habit tracker for busy executives who want to build morning routines. MVP: track habits, streak counter, simple dashboard"

**Bubba:**
```
Perfect. Quick tech questions:

- Framework: Next.js work for you? (fast, good DX)
- Database: Supabase for auth + data?
- Hosting: Vercel?

Or tell me your preferences.
```

**User:** "Yeah that works"

**Bubba:**
```
Here's the spec:

# Project Spec: Habit Tracker

## Problem & Audience
Busy executives who want to build consistent morning routines but lack simple tracking.

## MVP Scope (v1.0)
- [ ] Track daily habits (check on/off)
- [ ] Streak counter per habit
- [ ] Simple dashboard showing today + trends

## Tech Stack
- Framework: Next.js 14
- Database: Supabase (auth + Postgres)
- Hosting: Vercel
- UI: Tailwind + shadcn/ui

## Out of Scope (Future)
- Notifications/reminders
- Social/sharing features
- Mobile app

Ready to set up? Say "go" and I'll create the repo with proper structure.
```
