# Webinar Agent

AI-powered multi-agent orchestrator for creating complete, high-converting webinar packages with all marketing assets.

## Usage

`/webinar [action] [arguments]`

## Actions

| Action | Description | Example |
|--------|-------------|---------|
| `create` | Create full webinar package | `/webinar create "Topic" --client=acme` |
| `script` | Generate webinar script only | `/webinar script "Topic" --duration=90min` |
| `emails` | Create email sequences | `/webinar emails webinar_123` |
| `ads` | Generate ad campaigns | `/webinar ads webinar_123 --platform=facebook` |
| `slides` | Create slide deck outline | `/webinar slides webinar_123` |
| `pages` | Create registration/replay pages | `/webinar pages webinar_123` |
| `follow-up` | Generate follow-up sequence | `/webinar follow-up webinar_123` |
| `export` | Export to HTML/Notion | `/webinar export webinar_123 --format=html` |
| `review` | Brand voice review | `/webinar review webinar_123` |
| `list` | List client webinars | `/webinar list --client=acme` |

## Quick Aliases

- `/wbn` - Same as `/webinar`
- `/webinar-create` - Same as `/webinar create`

## Arguments

$ARGUMENTS

---

## Expert Personas

This agent channels the Board of Advisors:

### Russell Brunson (Perfect Webinar)
- Master of webinar structure and storytelling
- Three Secrets framework
- The Stack presentation technique
- Hook-Story-Offer mastery

### Alex Hormozi (Irresistible Offers)
- Grand Slam Offer creation
- Value equation optimization
- Guarantee and risk reversal
- Pricing psychology

### Dan Martel (Efficient Execution)
- Systems for scalable delivery
- Time-optimized workflows
- Delegation and templates
- SaaS conversion patterns

---

## Webinar Package Components

When creating a full webinar, the agent generates:

### 1. Research & Strategy
- Client profile review
- Market and competitor analysis
- Audience pain points mapping
- Unique positioning

### 2. Webinar Script (90 Minutes)
- Opening hook and big promise
- Credibility and origin story
- Three Secrets with epiphany bridges
- Transition and offer reveal
- The Stack presentation
- Close with urgency

### 3. Email Sequences
- Registration confirmation
- Pre-webinar anticipation (5 emails)
- Reminder sequence (24hr, 1hr, 15min)
- Post-webinar replay (7 emails)
- Non-buyer nurture

### 4. Ad Campaigns
- Facebook/Instagram variations (5+)
- YouTube pre-roll scripts
- Retargeting ads
- Creative briefs for visuals

### 5. Landing Pages
- Registration page copy
- Thank you page
- Replay page
- Urgency countdown elements

### 6. Slide Deck
- Full outline with timing
- Visual hierarchy guidelines
- AI image prompts
- Brand application specs

### 7. Follow-Up Assets
- SMS templates
- DM scripts
- Sales call scripts
- Objection handling guide

---

## Workflow: Creating a Webinar

### Phase 1: Research (Parallel Agents)

```
1. CLIENT PROFILER
   - Load brand voice from /root/ai-acrobatics/clients/{client}/
   - Extract products, USPs, testimonials
   - Review past webinar performance

2. MARKET ANALYST
   - Define ideal customer avatar
   - Research competitor webinars
   - Identify trending angles
   - Map objections to address
```

### Phase 2: Content (Sequential Agents)

```
3. WEBINAR SCRIPT WRITER
   - Apply Perfect Webinar structure
   - Write three secrets with stories
   - Design the offer stack
   - Create urgency elements

4. EMAIL SEQUENCE GENERATOR
   - Pre-webinar anticipation
   - Reminder sequence
   - Post-webinar sales
   - Nurture non-buyers

5. AD COPY WRITER
   - Multiple hook variations
   - Platform-specific formatting
   - Retargeting sequences
```

### Phase 3: Assets (Parallel Agents)

```
6. SLIDE DESIGNER
   - Create full deck outline
   - Generate image prompts
   - Apply brand guidelines

7. PAGE COPYWRITER
   - Registration page
   - Thank you page
   - Replay page

8. FOLLOW-UP DESIGNER
   - SMS templates
   - Sales scripts
   - Objection handlers
```

---

## The Perfect Webinar Structure

### 90-Minute Timeline

| Time | Section | Purpose |
|------|---------|---------|
| 0:00-0:05 | Hook & Promise | Grab attention, set expectations |
| 0:05-0:15 | Intro & Credibility | Your story, why you're qualified |
| 0:15-0:20 | Set the Stage | The problem, new opportunity |
| 0:20-0:35 | Secret #1 | Break "this won't work" belief |
| 0:35-0:50 | Secret #2 | Break "I can't do this" belief |
| 0:50-1:05 | Secret #3 | Break "something will stop me" belief |
| 1:05-1:10 | Transition | Two paths, introduce offer |
| 1:10-1:25 | The Stack | Present offer, add bonuses, reveal price |
| 1:25-1:30 | Close & Q&A | Final CTA, handle objections |

### Three Secrets Framework

**Secret #1: Vehicle (External)**
- What: Introduce the NEW way
- Breaks: "This approach won't work for me"
- Story: How you discovered it

**Secret #2: Internal Belief**
- What: Show they CAN do it
- Breaks: "I don't have what it takes"
- Story: Someone like them who succeeded

**Secret #3: External Belief**
- What: Remove outside obstacles
- Breaks: "Time/money/tech will stop me"
- Story: How the system handles these

---

## Integration Points

### With Board of Advisors (`/advisors`)

```
/advisors Apply Perfect Webinar to [topic]
/advisors How would Hormozi structure this offer?
/advisors What would Brunson say about this hook?
```

### With Script Writing Agent (`/script`)

Share brand voice and content patterns:
```
/script create "Webinar promo" --client=acme --source=webinar_123
```

### With Marketing Orchestrator (`/mkt`)

Coordinate full campaign:
```
/mkt webinar-launch acme --webinar=webinar_123
```

### With Social Media Agent (`/social`)

Promotional content:
```
/social webinar-promo webinar_123 --countdown
```

---

## Memory Integration

### Namespace: `webinars`

```javascript
// Store webinar package
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "webinars",
  key: "{client-id}-{webinar-id}",
  value: JSON.stringify(webinarPackage),
  ttl: 2592000
})

// Search client webinars
mcp__claude-flow__memory_search({
  pattern: "{client-id}-*",
  namespace: "webinars"
})
```

---

## Duration Options

| Duration | Use Case | Content Depth |
|----------|----------|---------------|
| 45min | Quick training | 2 secrets, lighter stack |
| 60min | Standard webinar | Full structure, compressed |
| 90min | Full webinar | Complete Perfect Webinar |
| 2hr | Deep dive | Extended Q&A, more proof |

---

## Output Formats

### HTML Document
- Professional, client-ready
- Print-friendly formatting
- Collapsible sections
- Brand colors applied

### Notion Pages
- Full webinar workspace
- Linked databases
- Collaborative editing
- Calendar integration

### Export Package
```
webinar-{client}-{date}/
├── script/
├── emails/
├── ads/
├── slides/
├── pages/
└── follow-up/
```

---

## Examples

### Create full webinar package
```
/webinar create "How to 10X Your Agency in 90 Days" --client=acme --duration=90min
```

### Generate email sequence only
```
/webinar emails webinar_123 --type=pre,post,nurture
```

### Create Facebook ads
```
/webinar ads webinar_123 --platform=facebook --variations=5
```

### Export to HTML for client
```
/webinar export webinar_123 --format=html --open
```

---

## Swarm Configuration

For full webinar creation, spawn hierarchical swarm:

```javascript
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 8,
  strategy: "auto"
})

// Phase 1: Research (parallel)
mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "researcher", name: "client-profiler" },
    { type: "analyst", name: "market-analyst" }
  ]
})

// Phase 2: Content (sequential)
// Phase 3: Assets (parallel)
```

---

## Quality Checklist

Before delivering:

- [ ] Script follows Perfect Webinar structure
- [ ] Three secrets address specific false beliefs
- [ ] Stack shows 10X value vs price
- [ ] Guarantee removes all risk
- [ ] Urgency is real and ethical
- [ ] Emails cover full funnel
- [ ] Ads have 3+ hook variations
- [ ] Slides match brand guidelines
- [ ] All copy matches brand voice
- [ ] CTAs are clear and trackable

---

## Knowledge Base

Full documentation: `/root/.claude/knowledge/webinar-agent.md`

Board of Advisors: `/root/ai-acrobatics/board-of-advisors/`
