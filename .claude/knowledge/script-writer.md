# Script Writing Agent - Multi-Agent Content Production System

> **Purpose**: Create branded social media scripts through orchestrated research and writing
> **Agency**: AI Acrobatics
> **Version**: 1.0
> **Last Updated**: December 2024

---

## Overview

The Script Writing Agent orchestrates a swarm of specialized sub-agents to research clients, understand their brand voice, and produce polished scripts for social media content. It integrates with document generation and social media scheduling agents.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPT WRITING ORCHESTRATOR                   │
│                      (Master Coordinator)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   RESEARCH    │    │    BRAND      │    │    SCRIPT     │
│    SWARM      │    │   ANALYST     │    │   WRITERS     │
│               │    │               │    │               │
│ - Client      │    │ - Voice       │    │ - Short-form  │
│   Researcher  │    │   extraction  │    │ - Long-form   │
│ - Market      │    │ - Tone guide  │    │ - Hook expert │
│   Analyst     │    │ - Style rules │    │ - CTA expert  │
│ - Product     │    │               │    │               │
│   Specialist  │    │               │    │               │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │     OUTPUT GENERATORS     │
              │                          │
              │ - Notion Doc Generator   │
              │ - HTML Formatter         │
              │ - Content Calendar       │
              │ - Social Scheduler       │
              └──────────────────────────┘
```

---

## Sub-Agent Definitions

### 1. Client Researcher

**Role**: Deep understanding of the client's business

**Inputs**:
- Client name/website
- Existing client files
- Previous content

**Outputs**:
```json
{
  "company": {
    "name": "...",
    "industry": "...",
    "founded": "...",
    "mission": "...",
    "values": ["..."]
  },
  "products": ["..."],
  "services": ["..."],
  "uniqueSellingPoints": ["..."],
  "competitors": ["..."],
  "keyDifferentiators": ["..."]
}
```

**Research Sources**:
- Client website (WebFetch)
- Social media profiles
- Existing brand materials in client folder
- Previous scripts/content
- Claude Flow memory (client namespace)

---

### 2. Market Analyst

**Role**: Understand the target audience

**Inputs**:
- Industry/niche
- Client's stated target market
- Product/service type

**Outputs**:
```json
{
  "demographics": {
    "ageRange": "...",
    "gender": "...",
    "location": "...",
    "income": "...",
    "education": "..."
  },
  "psychographics": {
    "interests": ["..."],
    "values": ["..."],
    "painPoints": ["..."],
    "desires": ["..."],
    "fears": ["..."]
  },
  "behaviors": {
    "platforms": ["..."],
    "contentPreferences": ["..."],
    "buyingTriggers": ["..."],
    "objections": ["..."]
  }
}
```

---

### 3. Product Specialist

**Role**: Deep understanding of what's being promoted

**Inputs**:
- Product/service details
- Client materials
- Competitor products

**Outputs**:
```json
{
  "product": {
    "name": "...",
    "category": "...",
    "description": "...",
    "features": ["..."],
    "benefits": ["..."],
    "pricing": "...",
    "useCase": ["..."]
  },
  "messaging": {
    "primaryValue": "...",
    "proofPoints": ["..."],
    "objectionHandlers": {
      "price": "...",
      "trust": "...",
      "timing": "..."
    }
  }
}
```

---

### 4. Brand Voice Analyst

**Role**: Extract and codify the client's brand voice

**Inputs**:
- Brand guidelines (if available)
- Previous content samples
- Client's stated preferences
- Social media presence

**Outputs**:
```json
{
  "voice": {
    "personality": ["professional", "friendly", "authoritative"],
    "tone": "conversational yet expert",
    "formality": "semi-formal"
  },
  "style": {
    "sentenceLength": "medium, varied",
    "vocabulary": "accessible, avoid jargon",
    "perspective": "second person (you)",
    "punctuation": "em dashes, strategic ellipses"
  },
  "dos": [
    "Use active voice",
    "Include specific numbers",
    "Reference customer success"
  ],
  "donts": [
    "Never use 'synergy' or corporate speak",
    "Avoid exclamation marks (max 1 per script)",
    "Don't make claims without proof"
  ],
  "examplePhrases": {
    "greetings": ["Hey there", "Let's talk about"],
    "transitions": ["Here's the thing", "But wait"],
    "ctas": ["Ready to get started?", "Let's make it happen"]
  }
}
```

**Storage**: `/agency-ops/clients/[client]/brand/voice-guide.json`

---

### 5. Short-Form Script Writer

**Role**: Create scripts for content under 60 seconds

**Formats**:
- TikTok (15-60 sec)
- Instagram Reels (15-90 sec)
- YouTube Shorts (up to 60 sec)
- Stories (15 sec segments)

**Structure Template**:
```markdown
## [Script Title]
**Duration**: [X seconds]
**Platform**: [Platform]

### HOOK (0-3 sec)
[Attention-grabbing opening]

### PROBLEM/CONTEXT (3-10 sec)
[Set up the scenario]

### SOLUTION/VALUE (10-25 sec)
[Deliver the main message]

### CTA (25-30 sec)
[Clear call to action]

---
**Visual Notes**: [B-roll suggestions, text overlays]
**Audio Notes**: [Music style, voice tone]
```

---

### 6. Long-Form Script Writer

**Role**: Create scripts for content over 60 seconds

**Formats**:
- YouTube videos (2-60+ min)
- Podcast segments
- Webinar scripts
- Course content
- Long Instagram/LinkedIn videos

**Structure Template**:
```markdown
## [Script Title]
**Duration**: [X minutes]
**Platform**: [Platform]
**Goal**: [Primary objective]

### COLD OPEN (0:00-0:30)
[Hook that pulls viewer in]

### INTRO (0:30-1:00)
[Establish credibility, preview value]

### SECTION 1: [Topic] (1:00-X:XX)
#### Key Point 1
[Content]

#### Key Point 2
[Content]

[Transition to next section]

### SECTION 2: [Topic] (X:XX-X:XX)
[Continue pattern]

### RECAP (X:XX-X:XX)
[Summarize key takeaways]

### CTA (X:XX-END)
[Clear next steps, engagement ask]

---
**Visual Notes**: [Scene descriptions, graphics needed]
**Audio Notes**: [Music cues, tone shifts]
**Resources**: [Links, downloads to mention]
```

---

### 7. Hook Expert

**Role**: Craft compelling opening lines

**Hook Types**:
1. **Question Hook**: "Ever wondered why...?"
2. **Statement Hook**: "Nobody talks about this..."
3. **Story Hook**: "Last week, I made a mistake..."
4. **Contrast Hook**: "Most people do X, but top performers..."
5. **Statistic Hook**: "87% of businesses fail at..."
6. **Challenge Hook**: "I bet you can't..."
7. **Secret Hook**: "The industry doesn't want you to know..."

**Output Format**:
```json
{
  "hooks": [
    {
      "type": "question",
      "text": "...",
      "targetEmotion": "curiosity"
    },
    {
      "type": "statement",
      "text": "...",
      "targetEmotion": "surprise"
    }
  ],
  "recommended": 0,
  "reason": "..."
}
```

---

### 8. CTA Expert

**Role**: Craft effective calls-to-action

**CTA Types**:
1. **Direct**: "Buy now", "Sign up today"
2. **Engagement**: "Comment below", "Share with a friend"
3. **Value-first**: "Get your free guide"
4. **Urgency**: "Limited spots available"
5. **Soft**: "Check the link in bio"
6. **Community**: "Join thousands of..."

**Output Format**:
```json
{
  "ctas": [
    {
      "type": "value-first",
      "text": "...",
      "placement": "end",
      "supportingText": "..."
    }
  ],
  "matchesGoal": true,
  "reason": "..."
}
```

---

## Workflow Execution

### Full Script Production Flow

```
INPUT: Client name, script brief, duration, platform

PHASE 1: RESEARCH (Parallel)
├── Client Researcher → client-profile.json
├── Market Analyst → audience-profile.json
└── Product Specialist → product-brief.json

PHASE 2: BRAND ANALYSIS
└── Brand Voice Analyst → voice-guide.json
    (Uses research outputs as context)

PHASE 3: SCRIPT WRITING (Sequential)
├── Hook Expert → generates 5 hook options
├── Script Writer (Short or Long form) → drafts script
└── CTA Expert → optimizes call-to-action

PHASE 4: OUTPUT GENERATION (Parallel)
├── Format as Notion document
├── Generate HTML version
├── Add to content calendar
└── (Optional) Schedule to social platforms
```

### Quick Script Flow

For repeat clients with existing brand data:

```
INPUT: Client name, script brief, duration

1. Load brand voice from memory/files
2. Load previous scripts for reference
3. Deploy Script Writer directly
4. Generate outputs
```

---

## Client Folder Structure

For each client, maintain:

```
/agency-ops/clients/[client-slug]/
├── _meta.json                      # Client metadata
├── brand/
│   ├── voice-guide.json            # Brand voice analysis
│   ├── visual-guidelines.md        # Visual style notes
│   ├── assets/                     # Logos, fonts, colors
│   └── samples/                    # Example content
├── scripts/
│   ├── short-form/
│   │   ├── tiktok/
│   │   ├── reels/
│   │   └── shorts/
│   ├── long-form/
│   │   ├── youtube/
│   │   ├── podcast/
│   │   └── webinar/
│   └── archive/                    # Old scripts
├── research/
│   ├── client-profile.json
│   ├── audience-profile.json
│   ├── product-brief.json
│   └── competitor-analysis.md
├── calendar/
│   └── content-calendar.json       # Scheduled content
└── outputs/
    ├── notion/                     # Notion export files
    └── html/                       # HTML formatted scripts
```

---

## Output Formats

### Notion Document Format

```markdown
# [Client Name] Script: [Title]

> **Platform**: [Platform]
> **Duration**: [Length]
> **Created**: [Date]
> **Status**: Draft / Approved / Published

---

## Script

### Hook
[Hook text]

### Body
[Script content with clear sections]

### Call to Action
[CTA text]

---

## Production Notes

### Visual Direction
- [Note 1]
- [Note 2]

### Audio Direction
- [Note 1]

### Text Overlays
| Timestamp | Text |
|-----------|------|
| 0:03 | "..." |

---

## Metadata
- **Target Audience**: [Audience]
- **Key Message**: [Message]
- **Goal**: [Objective]
- **Keywords**: [Tags]
```

### HTML Document Format

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Client] Script: [Title]</title>
  <style>
    :root {
      --primary: #2563eb;
      --text: #1f2937;
      --muted: #6b7280;
      --bg: #ffffff;
      --surface: #f9fafb;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: var(--text);
      background: var(--bg);
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--primary);
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 1.5rem;
      color: var(--primary);
    }
    .meta {
      background: var(--surface);
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .meta p {
      margin: 0.25rem 0;
      color: var(--muted);
    }
    .callout {
      background: #dbeafe;
      border-left: 4px solid var(--primary);
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 0 8px 8px 0;
    }
    .hook {
      font-size: 1.25rem;
      font-weight: 500;
      background: linear-gradient(135deg, #dbeafe, #e0e7ff);
      padding: 1.5rem;
      border-radius: 12px;
      margin: 1.5rem 0;
    }
    .cta {
      background: var(--primary);
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin: 1.5rem 0;
      text-align: center;
    }
    .section {
      margin: 1.5rem 0;
      padding: 1rem;
      background: var(--surface);
      border-radius: 8px;
    }
    .timestamp {
      font-size: 0.875rem;
      color: var(--muted);
      font-family: monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: var(--surface);
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>[Script Title]</h1>

  <div class="meta">
    <p><strong>Platform:</strong> [Platform]</p>
    <p><strong>Duration:</strong> [Length]</p>
    <p><strong>Created:</strong> [Date]</p>
  </div>

  <h2>Script</h2>

  <h3>Hook</h3>
  <div class="hook">
    [Hook text]
  </div>

  <h3>Body</h3>
  <div class="section">
    <span class="timestamp">[0:03-0:15]</span>
    <p>[Script section]</p>
  </div>

  <h3>Call to Action</h3>
  <div class="cta">
    [CTA text]
  </div>

  <h2>Production Notes</h2>

  <div class="callout">
    <strong>Visual Direction:</strong>
    <p>[Notes]</p>
  </div>

  <h2>Text Overlays</h2>
  <table>
    <tr><th>Timestamp</th><th>Text</th></tr>
    <tr><td>0:03</td><td>[Text]</td></tr>
  </table>

</body>
</html>
```

---

## Content Calendar Integration

### Calendar Entry Format

```json
{
  "id": "script-{timestamp}",
  "client": "[client-slug]",
  "title": "[Script Title]",
  "platform": "tiktok|reels|youtube|etc",
  "duration": "[X seconds/minutes]",
  "scheduledDate": "2024-12-20",
  "scheduledTime": "14:00",
  "status": "draft|approved|scheduled|published",
  "files": {
    "script": "/path/to/script.md",
    "html": "/path/to/script.html",
    "notion": "notion-page-id"
  },
  "tags": ["campaign-name", "content-type"]
}
```

### Notion Calendar Database

Create in Notion with properties:
| Property | Type | Purpose |
|----------|------|---------|
| Title | Title | Script name |
| Platform | Select | Distribution platform |
| Date | Date | Publish date |
| Status | Status | Production status |
| Duration | Number | Length in seconds |
| Script | Files | Attached script |
| Client | Relation | Link to client |
| Campaign | Relation | Link to campaign |

---

## Memory Management

### Namespace: `scripts`

Store for quick access:
```javascript
// Client brand voice (persistent)
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "scripts",
  key: "{client}-brand-voice",
  value: brandVoiceJSON,
  ttl: 2592000  // 30 days
})

// Recent scripts (reference)
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "scripts",
  key: "{client}-recent-scripts",
  value: recentScriptsList,
  ttl: 604800  // 7 days
})

// Active calendar
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "scripts",
  key: "{client}-calendar",
  value: calendarData,
  ttl: 86400  // 1 day
})
```

---

## Integration Points

### With Marketing Orchestrator

```javascript
// Marketing Orchestrator can trigger script production
// After creative-director agent completes strategy

Task({
  subagent_type: "general-purpose",
  prompt: "/script-writer {client} for {campaign}",
  run_in_background: true
})
```

### With Social Media Agent

```javascript
// After script approved, schedule to platforms
// Uses social media scheduling integration

mcp__notion__API-post-page({
  parent: { database_id: "content-calendar-id" },
  properties: { /* script calendar entry */ }
})
```

### With Document Generation

```javascript
// Generate formatted outputs
// Create both Notion and HTML versions
```

---

## Script Duration Templates

### 15-Second Script (TikTok/Stories)
```
HOOK: 2 sec
PROBLEM/CONTEXT: 3 sec
SOLUTION: 7 sec
CTA: 3 sec
```

### 30-Second Script
```
HOOK: 3 sec
PROBLEM: 5 sec
SOLUTION: 15 sec
CTA: 7 sec
```

### 60-Second Script
```
HOOK: 5 sec
SETUP: 10 sec
MAIN CONTENT: 35 sec
CTA: 10 sec
```

### 2-Minute Script
```
HOOK: 5 sec
INTRO: 15 sec
POINT 1: 30 sec
POINT 2: 30 sec
RECAP: 20 sec
CTA: 20 sec
```

### 15-Minute Script
```
COLD OPEN: 30 sec
INTRO: 1 min
SECTION 1: 4 min
SECTION 2: 4 min
SECTION 3: 4 min
RECAP: 1 min
CTA: 30 sec
```

### 30-Minute Script
```
COLD OPEN: 1 min
INTRO: 2 min
SECTION 1: 7 min
SECTION 2: 7 min
SECTION 3: 7 min
SECTION 4: 4 min
RECAP: 1.5 min
CTA: 30 sec
```

### 60-Minute Script
```
COLD OPEN: 2 min
INTRO: 3 min
SECTION 1: 12 min
SECTION 2: 12 min
SECTION 3: 12 min
SECTION 4: 10 min
SECTION 5: 5 min
RECAP: 3 min
CTA: 1 min
```

---

## Usage Examples

### Full Production
```
/script-writer full ClientName "TikTok series about product benefits" 30sec
```

### Quick Script (Existing Client)
```
/script-writer quick ClientName "New product launch announcement" 60sec
```

### Batch Production
```
/script-writer batch ClientName 5 "Weekly tips series" 15sec
```

### With Calendar Scheduling
```
/script-writer schedule ClientName "Holiday campaign" 30sec 2024-12-20 14:00
```

---

## Quality Checklist

Before delivering any script:

- [ ] Hook grabs attention in first 3 seconds
- [ ] Brand voice matches client guidelines
- [ ] Duration fits specified platform
- [ ] CTA is clear and actionable
- [ ] No jargon (unless brand-appropriate)
- [ ] Visual/audio notes included
- [ ] Timestamps are accurate
- [ ] Text overlays specified
- [ ] HTML formatted correctly
- [ ] Added to content calendar
- [ ] Notion document created
