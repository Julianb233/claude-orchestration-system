# Webinar Agent - Knowledge Base

> **Version**: 1.0
> **Purpose**: Multi-agent orchestrator for creating high-converting webinars with complete marketing assets
> **Namespace**: `webinars`

---

## Overview

The Webinar Agent orchestrates the creation of complete webinar packages - from registration pages to follow-up sequences. It combines frameworks from the Board of Advisors (Russell Brunson's Perfect Webinar, Alex Hormozi's offers, Dan Martel's efficiency) with brand-specific customization.

---

## Architecture

```
                        ┌─────────────────────────┐
                        │    WEBINAR ORCHESTRATOR │
                        │   (Main Coordinator)    │
                        └───────────┬─────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│    RESEARCH   │         │    CONTENT    │         │    ASSETS     │
│     PHASE     │         │     PHASE     │         │     PHASE     │
└───────┬───────┘         └───────┬───────┘         └───────┬───────┘
        │                         │                         │
   ┌────┴────┐              ┌────┴────┐              ┌────┴────┐
   │         │              │         │              │         │
   ▼         ▼              ▼         ▼              ▼         ▼
[Client]  [Market]     [Script]  [Emails]      [Slides]  [Ads]
Profiler  Analyst      Writer   Generator     Designer  Creator
```

---

## Sub-Agents (8 Total)

### Phase 1: Research Agents (Parallel)

#### 1. Client Profiler
**Purpose**: Deep dive into client brand, voice, products, and positioning

**Responsibilities**:
- Load client profile from `/root/ai-acrobatics/clients/{client}/`
- Extract brand voice document
- Understand product/service offerings
- Identify unique selling propositions
- Map existing customer testimonials

**Output**: Client context document for other agents

#### 2. Market Analyst
**Purpose**: Understand target audience and competitive landscape

**Responsibilities**:
- Define ideal customer avatar
- Research pain points and desires
- Analyze competitor webinars
- Identify trending topics/angles
- Map customer journey

**Output**: Market research brief

### Phase 2: Content Agents (Sequential)

#### 3. Webinar Script Writer
**Purpose**: Create the complete webinar script using proven frameworks

**Frameworks Used**:
- Russell Brunson's Perfect Webinar
- Alex Hormozi's Value Equation
- Three Secrets Structure

**Responsibilities**:
- Write opening hook and promise
- Craft 3 secrets with epiphany bridges
- Design the stack and offer presentation
- Write close with urgency/scarcity
- Create Q&A guidance

**Output**: Complete webinar script (timed, with notes)

#### 4. Email Sequence Generator
**Purpose**: Create complete email funnel for webinar

**Sequences Created**:
- Registration confirmation + onboarding
- Pre-webinar anticipation (3-5 emails)
- Reminder sequence (24hr, 1hr, 15min)
- Post-webinar replay sequence
- Sales follow-up sequence
- Non-buyer nurture sequence

**Output**: Full email copy for all sequences

#### 5. Ad Copy Writer
**Purpose**: Create conversion-focused ad campaigns

**Ad Types**:
- Facebook/Instagram ads (multiple variations)
- YouTube pre-roll ads
- LinkedIn ads (if B2B)
- Retargeting ad variations

**Output**: Ad copy + creative briefs

#### 6. Follow-Up Sequence Designer
**Purpose**: Design post-webinar conversion sequence

**Components**:
- Replay page strategy
- SMS follow-up scripts
- DM templates
- Sales call scripts
- Objection handling guides

**Output**: Complete follow-up playbook

### Phase 3: Asset Agents (Parallel)

#### 7. Slide Designer
**Purpose**: Create professional webinar slide deck

**Deliverables**:
- Title and opening slides
- Content slides with visual hierarchy
- Story/proof slides
- Offer stack slides
- Bonus slides
- Q&A and close slides
- Image prompts for AI generation

**Output**: Slide deck outline + image prompts

#### 8. Registration Page Designer
**Purpose**: Design high-converting registration experience

**Components**:
- Headline and subheadline
- Bullet points (benefits)
- Urgency/scarcity elements
- Social proof placement
- Form design
- Thank you page

**Output**: Page copy and wireframe

---

## The Perfect Webinar Structure

### Timing Blueprint (90 Minutes)

```
┌────────────────────────────────────────────────────────────────┐
│                    PERFECT WEBINAR TIMELINE                     │
├─────────────┬──────────────────────────────────────────────────┤
│   0:00-0:05 │ HOOK & PROMISE                                   │
│             │ - Pattern interrupt                              │
│             │ - Big promise                                    │
│             │ - What they'll learn                             │
├─────────────┼──────────────────────────────────────────────────┤
│   0:05-0:15 │ INTRO & CREDIBILITY                             │
│             │ - Your story (epiphany bridge)                  │
│             │ - Why you're qualified                          │
│             │ - Social proof                                  │
├─────────────┼──────────────────────────────────────────────────┤
│   0:15-0:20 │ SET THE STAGE                                   │
│             │ - Restate the problem                           │
│             │ - Create the "new opportunity"                  │
│             │ - Preview the 3 secrets                         │
├─────────────┼──────────────────────────────────────────────────┤
│   0:20-0:35 │ SECRET #1 (Vehicle)                             │
│             │ - Break "this won't work" belief                │
│             │ - Epiphany bridge story                         │
│             │ - Framework/concept                             │
├─────────────┼──────────────────────────────────────────────────┤
│   0:35-0:50 │ SECRET #2 (Internal)                            │
│             │ - Break "I can't do this" belief                │
│             │ - Case study/testimonial                        │
│             │ - Simple system reveal                          │
├─────────────┼──────────────────────────────────────────────────┤
│   0:50-1:05 │ SECRET #3 (External)                            │
│             │ - Break "something will stop me" belief         │
│             │ - Address time/money/tech objections            │
│             │ - Build desire and urgency                      │
├─────────────┼──────────────────────────────────────────────────┤
│   1:05-1:10 │ TRANSITION                                      │
│             │ - "Two paths" close                             │
│             │ - Introduce the offer                           │
├─────────────┼──────────────────────────────────────────────────┤
│   1:10-1:25 │ THE STACK                                       │
│             │ - Present each component                        │
│             │ - Assign values                                 │
│             │ - Add bonuses                                   │
│             │ - Reveal price                                  │
│             │ - Add guarantee                                 │
│             │ - Create urgency                                │
├─────────────┼──────────────────────────────────────────────────┤
│   1:25-1:30 │ CLOSE & Q&A                                     │
│             │ - Final call to action                          │
│             │ - Handle objections                             │
│             │ - Scarcity reminder                             │
└─────────────┴──────────────────────────────────────────────────┘
```

---

## Three Secrets Framework

### Secret #1: The Vehicle (External Belief)

**Purpose**: Break the belief that "this approach won't work"

**Structure**:
```
1. STATE THE COMMON APPROACH (what they've tried)
2. EXPLAIN WHY IT FAILS (the real problem)
3. INTRODUCE THE NEW OPPORTUNITY (your method)
4. EPIPHANY BRIDGE STORY (how you discovered it)
5. PROOF IT WORKS (results, testimonials)
```

**Example Transitions**:
- "The reason [common approach] doesn't work is..."
- "What I discovered was..."
- "This changed everything because..."

### Secret #2: Internal Belief

**Purpose**: Break the belief that "I can't do this"

**Structure**:
```
1. ACKNOWLEDGE THE FEAR (they're not alone)
2. SHARE YOUR SIMILAR STRUGGLE (relatability)
3. REVEAL THE SIMPLE SYSTEM (make it accessible)
4. SHOW OTHERS LIKE THEM SUCCEEDING (social proof)
5. GIVE THEM PERMISSION TO BELIEVE (encouragement)
```

**Example Transitions**:
- "I felt the exact same way..."
- "But then I realized..."
- "If [relatable person] can do it, so can you..."

### Secret #3: External Belief

**Purpose**: Break the belief that "something outside me will prevent this"

**Common External Objections**:
- "I don't have time"
- "I don't have money"
- "The technology is too complex"
- "My situation is different"
- "The market is too competitive"

**Structure**:
```
1. NAME THE OBJECTION (they're thinking it)
2. REFRAME IT (show it's actually an asset)
3. SHOW HOW YOUR SYSTEM HANDLES IT (solution)
4. PROVIDE PROOF (someone who had same objection)
5. CREATE URGENCY (why waiting makes it worse)
```

---

## The Stack Framework

### Building the Offer Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     THE OFFER STACK                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CORE OFFER                                    $X,XXX value │
│  └── The main product/service/program                       │
│                                                             │
│  + BONUS #1: [High-value addition]             $XXX value   │
│    └── Solves a specific problem                            │
│                                                             │
│  + BONUS #2: [Time-saving tool]                $XXX value   │
│    └── Templates, swipe files, shortcuts                    │
│                                                             │
│  + BONUS #3: [Community/Support]               $XXX value   │
│    └── Access, coaching, accountability                     │
│                                                             │
│  + BONUS #4: [Fast-action bonus]               $XXX value   │
│    └── Only for those who act NOW                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  TOTAL VALUE:                                $XX,XXX        │
├─────────────────────────────────────────────────────────────┤
│  TODAY'S INVESTMENT:                          $X,XXX        │
├─────────────────────────────────────────────────────────────┤
│  GUARANTEE: [Risk reversal statement]                       │
│  URGENCY: [Why they must act now]                          │
└─────────────────────────────────────────────────────────────┘
```

### Stack Presentation Order

1. **Start with the core** - Explain the main value
2. **Add bonuses one at a time** - Build perceived value
3. **Stack the values visually** - Let them see it add up
4. **Reveal the price** - After massive value shown
5. **Add guarantee** - Remove the risk
6. **Create urgency** - Why NOW matters

---

## Email Sequences

### Pre-Webinar Sequence (5 Emails)

```
EMAIL 1: REGISTRATION CONFIRMATION
├── Subject: "You're in! [Webinar Name]"
├── Purpose: Confirm, build excitement
├── Include: Date, time, calendar link
└── CTA: Add to calendar

EMAIL 2: THE PROBLEM (Day before)
├── Subject: "The #1 reason [pain point]..."
├── Purpose: Agitate the problem
├── Include: Story, statistics
└── CTA: "I'll show you the solution tomorrow"

EMAIL 3: THE PROMISE (Morning of)
├── Subject: "In [X] hours, everything changes"
├── Purpose: Build anticipation
├── Include: What they'll learn, social proof
└── CTA: "Don't miss this"

EMAIL 4: 1-HOUR REMINDER
├── Subject: "Starting in 60 minutes..."
├── Purpose: Drive attendance
├── Include: Login link, quick benefits
└── CTA: Click here to join

EMAIL 5: 15-MINUTE REMINDER
├── Subject: "We're going LIVE"
├── Purpose: Final push
├── Include: Direct link only
└── CTA: "Join now"
```

### Post-Webinar Sequence (7 Emails)

```
EMAIL 1: REPLAY AVAILABLE (Immediate)
├── Subject: "Your replay is ready"
├── Purpose: Catch non-attendees
├── Include: Replay link, offer recap
└── CTA: Watch + take action

EMAIL 2: SUCCESS STORY (Day 1)
├── Subject: "How [Name] achieved [Result]"
├── Purpose: Social proof
├── Include: Case study, before/after
└── CTA: "Your turn"

EMAIL 3: FAQ/OBJECTIONS (Day 2)
├── Subject: "Answering your questions about [Offer]"
├── Purpose: Handle objections
├── Include: Common Q&A
└── CTA: "Ready to decide?"

EMAIL 4: URGENCY (Day 3)
├── Subject: "⏰ [X] hours left"
├── Purpose: Create urgency
├── Include: What they'll miss, deadline
└── CTA: "Last chance"

EMAIL 5: FINAL CALL (Day 4)
├── Subject: "Doors closing tonight"
├── Purpose: Final push
├── Include: Bonus removal, scarcity
└── CTA: "Don't miss out"

EMAIL 6: CLOSED + WAITLIST (Day 5)
├── Subject: "The doors have closed"
├── Purpose: FOMO for future
├── Include: Waitlist option
└── CTA: "Join the waitlist"

EMAIL 7: NON-BUYER NURTURE (Day 7)
├── Subject: "I understand..."
├── Purpose: Maintain relationship
├── Include: Free value, future opportunity
└── CTA: "Stay connected"
```

---

## Ad Frameworks

### Facebook/Instagram Ad Structure

**Hook → Problem → Solution → Proof → CTA**

```
HOOK (Pattern Interrupt):
"Stop doing [ineffective thing]..."
"I made $X in [timeframe] by..."
"What if I told you [bold claim]..."

PROBLEM (Agitate):
"You've tried [common solutions]..."
"But nothing seems to work because..."
"The real problem is..."

SOLUTION (Introduce Webinar):
"I'm hosting a FREE training where..."
"In 60 minutes, you'll discover..."
"Join me live and learn..."

PROOF (Build Credibility):
"I've helped [X] people achieve..."
"[Name] went from [before] to [after]..."
"This exact system has generated..."

CTA (Clear Action):
"Click below to save your seat"
"Register now - spots are limited"
"Join us [date] at [time]"
```

### Ad Variations to Test

| Type | Hook Style | Target |
|------|------------|--------|
| Story | "I used to..." | Warm audience |
| Statistic | "97% of people fail at..." | Problem-aware |
| Question | "Want to know how..." | Curiosity |
| Contrarian | "Everyone says... but..." | Skeptics |
| Result | "How I [achieved result]..." | Solution-aware |

---

## Slide Design Guidelines

### Slide Types and Templates

#### 1. Title Slide
```
┌─────────────────────────────────────────┐
│                                         │
│   [WEBINAR TITLE]                      │
│   The [Outcome] Without [Pain Point]   │
│                                         │
│   with [Presenter Name]                │
│                                         │
└─────────────────────────────────────────┘
```

#### 2. Content Slide
```
┌─────────────────────────────────────────┐
│   SECRET #1: [Title]                   │
├─────────────────────────────────────────┤
│                                         │
│   • Key Point 1                        │
│   • Key Point 2                        │
│   • Key Point 3                        │
│                                         │
│   [Supporting Visual]                  │
│                                         │
└─────────────────────────────────────────┘
```

#### 3. Story Slide
```
┌─────────────────────────────────────────┐
│                                         │
│   [Photo/Visual]                       │
│                                         │
│   "[Key Quote from Story]"             │
│                                         │
│   - Context/Attribution                │
│                                         │
└─────────────────────────────────────────┘
```

#### 4. Stack Slide
```
┌─────────────────────────────────────────┐
│   WHAT YOU GET:                        │
├─────────────────────────────────────────┤
│   ✓ Core Program        $X,XXX value   │
│   ✓ Bonus #1             $XXX value    │
│   ✓ Bonus #2             $XXX value    │
│   ✓ Bonus #3             $XXX value    │
├─────────────────────────────────────────┤
│   TOTAL VALUE:          $XX,XXX        │
│                                         │
│   YOUR INVESTMENT:       $X,XXX        │
└─────────────────────────────────────────┘
```

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| One idea per slide | Don't overcrowd |
| Large text | 32pt minimum for body |
| High contrast | Dark text on light, or vice versa |
| Brand colors | Match client brand |
| Minimal text | Speak the details, show keywords |
| Visual hierarchy | Headlines > Subheads > Body |

---

## Image Prompt Templates

### For AI Image Generation (Midjourney/DALL-E)

**Presenter Slides**:
```
"Professional presenter speaking to audience, modern conference stage,
soft lighting, confident pose, business casual attire, [brand colors],
photorealistic, 4K --ar 16:9"
```

**Transformation Slides**:
```
"Before and after split image, [topic], dramatic improvement,
clean design, professional, motivational, [brand style] --ar 16:9"
```

**Success/Achievement**:
```
"Person celebrating success at desk, laptop showing positive results,
modern office, natural light, happy expression, professional,
[industry context] --ar 16:9"
```

**Problem/Pain Point**:
```
"Frustrated person at computer, overwhelmed expression, messy desk,
papers scattered, stress visualization, professional setting,
editorial style --ar 16:9"
```

---

## Integration Points

### With Board of Advisors (`/advisors`)

Pull frameworks for:
- Offer structure (Hormozi)
- Webinar script (Brunson)
- Time-efficient delivery (Martel)

### With Script Writing Agent (`/script`)

Share:
- Brand voice consistency
- Hook frameworks
- CTA patterns

### With Marketing Orchestrator (`/mkt`)

Coordinate:
- Ad creative development
- Audience targeting
- Campaign tracking

### With Social Media Agent (`/social`)

Sync:
- Promotional content
- Event countdown posts
- Replay promotions

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
  ttl: 2592000  // 30 days
})

// Search client webinars
mcp__claude-flow__memory_search({
  pattern: "{client-id}-*",
  namespace: "webinars"
})
```

---

## Output Deliverables

### Complete Webinar Package

```
webinar-package-{client}-{date}/
├── 01-research/
│   ├── client-profile.md
│   ├── market-research.md
│   └── competitor-analysis.md
├── 02-script/
│   ├── webinar-script.md         # Full 90-min script
│   ├── speaker-notes.md          # Timing and cues
│   └── q&a-guide.md              # Objection handling
├── 03-emails/
│   ├── pre-webinar/              # 5 emails
│   ├── post-webinar/             # 7 emails
│   └── subject-line-variations/
├── 04-ads/
│   ├── facebook-ads.md           # 5 variations
│   ├── youtube-ads.md            # 3 variations
│   ├── creative-briefs.md        # Image/video specs
│   └── targeting-recommendations.md
├── 05-pages/
│   ├── registration-page.md      # Copy + wireframe
│   ├── thank-you-page.md
│   └── replay-page.md
├── 06-slides/
│   ├── slide-deck.md             # Full outline
│   ├── image-prompts.md          # AI generation prompts
│   └── design-specs.md           # Brand application
├── 07-follow-up/
│   ├── sms-templates.md
│   ├── dm-templates.md
│   └── sales-call-script.md
└── 08-exports/
    ├── notion/                   # Notion pages
    └── html/                     # Client-ready docs
```

---

## Quality Checklist

Before delivering:

- [ ] Script follows Perfect Webinar structure
- [ ] Three secrets break specific false beliefs
- [ ] Stack presents clear value-to-price ratio
- [ ] Email sequences cover full funnel
- [ ] Ads have 3+ hook variations
- [ ] Slides follow brand guidelines
- [ ] All copy matches client voice
- [ ] CTAs are clear and consistent
- [ ] Urgency/scarcity is ethical and real
- [ ] Image prompts are specific and actionable

---

*Last Updated: December 2024*
