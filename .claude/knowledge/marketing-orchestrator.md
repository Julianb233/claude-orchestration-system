# Marketing Orchestrator - Multi-Agent System

> **Purpose**: Orchestrated AI agent network for comprehensive marketing research, analysis, and creative production
> **Owner**: AI Acrobatics
> **Version**: 1.0
> **Last Updated**: December 2024

---

## Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │      MARKETING ORCHESTRATOR         │
                    │         (Coordinator Agent)         │
                    │                                     │
                    │  - Receives client brief            │
                    │  - Spawns sub-agents                │
                    │  - Aggregates findings              │
                    │  - Produces final deliverables      │
                    └───────────────┬─────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│  CLIENT RESEARCHER │   │  INDUSTRY ANALYST  │   │   MARKET ANALYST  │
│                   │   │                   │   │                   │
│ - Company research│   │ - Competitor ads  │   │ - Demographics    │
│ - Brand voice     │   │ - Industry trends │   │ - Psychographics  │
│ - Past campaigns  │   │ - Winning formulas│   │ - Pain points     │
│ - Assets/content  │   │ - Ad platforms    │   │ - Buying behavior │
└─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   SHARED MEMORY POOL      │
                    │   namespace: "marketing"   │
                    │                           │
                    │   - client-context        │
                    │   - industry-insights     │
                    │   - market-profile        │
                    │   - data-strategy         │
                    │   - creative-brief        │
                    └─────────────┬─────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│  DATA STRATEGIST  │   │  CREATIVE DIRECTOR │   │   PROMPT ENGINEER │
│                   │   │                   │   │                   │
│ - Pixel strategy  │   │ - Ad copy         │   │ - Image prompts   │
│ - Tracking setup  │   │ - Scripts         │   │ - Video concepts  │
│ - Audience build  │   │ - Headlines       │   │ - Style guides    │
│ - Retargeting     │   │ - CTAs            │   │ - Scene breakdown │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

---

## Sub-Agent Definitions

### 1. Client Researcher (`client-researcher`)

**Role**: Deep dive into the client's business, brand, and existing assets

**Inputs**:
- Client name / website
- Industry
- Any provided documents (PDFs, Drive links, Notion pages)

**Tasks**:
1. Research company background, mission, values
2. Analyze existing brand voice and messaging
3. Review past campaigns and performance
4. Identify existing content assets
5. Map product/service offerings
6. Note unique selling propositions (USPs)

**Outputs**:
```json
{
  "clientProfile": {
    "name": "",
    "industry": "",
    "mission": "",
    "values": [],
    "brandVoice": {
      "tone": "",
      "personality": "",
      "doNots": []
    },
    "products": [],
    "usps": [],
    "existingAssets": [],
    "pastCampaigns": []
  }
}
```

**Tools Used**:
- WebSearch, WebFetch (company research)
- Notion MCP (if client data in Notion)
- Read (if local docs provided)

---

### 2. Industry Analyst (`industry-analyst`)

**Role**: Research successful ads in the client's industry

**Inputs**:
- Industry/niche
- Competitor list (optional)
- Ad platforms of interest

**Tasks**:
1. Research top-performing ads in industry
2. Analyze competitor ad strategies
3. Identify winning ad formulas
4. Document creative patterns that work
5. Note platform-specific best practices
6. Track industry trends

**Outputs**:
```json
{
  "industryInsights": {
    "topCompetitors": [],
    "winningAdFormulas": [
      {
        "pattern": "",
        "whyItWorks": "",
        "examples": []
      }
    ],
    "platformInsights": {
      "facebook": {},
      "instagram": {},
      "tiktok": {},
      "youtube": {},
      "google": {}
    },
    "trends": [],
    "avoidPatterns": []
  }
}
```

**Research Sources**:
- Facebook Ad Library
- TikTok Creative Center
- Google Ads Transparency
- AdSpy, SpyFu (if access)
- Industry publications

---

### 3. Market Analyst (`market-analyst`)

**Role**: Deep analysis of target market and audience

**Inputs**:
- Industry
- Product/service type
- Geographic focus
- Existing customer data (optional)

**Tasks**:
1. Build demographic profile
2. Develop psychographic profile
3. Identify pain points and desires
4. Map customer journey
5. Analyze buying behavior
6. Identify objections and barriers

**Outputs**:
```json
{
  "marketProfile": {
    "demographics": {
      "ageRange": "",
      "gender": "",
      "income": "",
      "location": "",
      "education": "",
      "occupation": ""
    },
    "psychographics": {
      "values": [],
      "interests": [],
      "lifestyle": "",
      "personality": ""
    },
    "painPoints": [],
    "desires": [],
    "objections": [],
    "buyingTriggers": [],
    "customerJourney": {
      "awareness": "",
      "consideration": "",
      "decision": "",
      "retention": ""
    }
  }
}
```

---

### 4. Data Strategist (`data-strategist`)

**Role**: Pixel strategy, tracking, and audience building

**Inputs**:
- Platforms in use
- Current pixel setup
- Conversion goals
- Budget constraints

**Tasks**:
1. Audit current pixel implementation
2. Design tracking strategy
3. Define conversion events
4. Build audience segments
5. Create retargeting funnels
6. Plan lookalike audiences

**Outputs**:
```json
{
  "dataStrategy": {
    "pixelSetup": {
      "platform": "",
      "events": [],
      "parameters": []
    },
    "conversionTracking": {
      "primaryGoal": "",
      "secondaryGoals": [],
      "attributionWindow": ""
    },
    "audienceSegments": [
      {
        "name": "",
        "criteria": "",
        "size": "",
        "purpose": ""
      }
    ],
    "retargetingFunnels": [],
    "lookalikeStrategy": []
  }
}
```

---

### 5. Creative Director (`creative-director`)

**Role**: Generate ad copy, scripts, and creative concepts

**Inputs**:
- All previous agent outputs
- Campaign objective
- Platform(s)
- Format requirements

**Tasks**:
1. Write multiple headline variations
2. Create body copy options
3. Develop video scripts
4. Write CTAs
5. Create hook variations
6. Build offer frameworks

**Outputs**:
```json
{
  "creativeAssets": {
    "headlines": [],
    "bodyCopy": [],
    "ctas": [],
    "hooks": [],
    "scripts": [
      {
        "format": "short-form|long-form",
        "duration": "",
        "script": "",
        "visualNotes": ""
      }
    ],
    "offerFrameworks": []
  }
}
```

**Frameworks Used**:
- AIDA (Attention, Interest, Desire, Action)
- PAS (Problem, Agitate, Solution)
- BAB (Before, After, Bridge)
- 4Ps (Picture, Promise, Prove, Push)
- Hook → Story → Offer

---

### 6. Prompt Engineer (`prompt-engineer`)

**Role**: Create AI image and video generation prompts

**Inputs**:
- Creative concepts
- Brand style guidelines
- Platform requirements
- Visual references

**Tasks**:
1. Create image generation prompts
2. Develop video concept prompts
3. Build scene-by-scene breakdowns
4. Define style consistency guides
5. Create variation prompts
6. Optimize for specific AI tools

**Outputs**:
```json
{
  "aiPrompts": {
    "imagePrompts": [
      {
        "concept": "",
        "prompt": "",
        "negativePrompt": "",
        "style": "",
        "aspectRatio": "",
        "tool": "midjourney|dalle|flux|ideogram"
      }
    ],
    "videoPrompts": [
      {
        "concept": "",
        "scenes": [
          {
            "sceneNumber": 1,
            "duration": "",
            "visualDescription": "",
            "cameraMovement": "",
            "audio": ""
          }
        ],
        "tool": "runway|pika|sora|kling"
      }
    ],
    "styleGuide": {
      "colorPalette": [],
      "visualTone": "",
      "brandElements": []
    }
  }
}
```

**AI Tools Expertise**:
- **Images**: Midjourney, DALL-E, Flux, Ideogram, Leonardo
- **Video**: Runway, Pika, Sora, Kling, Luma
- **Audio**: ElevenLabs, Murf
- **Avatars**: HeyGen, Synthesia

---

## Inter-Agent Communication Protocol

### Memory Namespace: `marketing`

All agents read/write to shared memory for coordination:

```javascript
// Agent writes findings
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "marketing",
  key: "{client-id}-{agent-type}",
  value: JSON.stringify(agentOutput),
  ttl: 604800 // 7 days
})

// Agent reads another agent's findings
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "marketing",
  key: "{client-id}-client-profile"
})
```

### Message Passing

Agents can signal completion and pass context:

```javascript
// Signal completion
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "marketing",
  key: "{client-id}-status",
  value: JSON.stringify({
    phase: "research",
    completed: ["client-researcher", "industry-analyst"],
    pending: ["market-analyst", "data-strategist"],
    blockers: []
  })
})
```

### Workflow State

```json
{
  "workflowId": "mkt_{timestamp}",
  "clientId": "{client-name}",
  "status": "in_progress|research_complete|analysis_complete|creative_complete",
  "phases": {
    "research": {
      "status": "complete",
      "agents": ["client-researcher", "industry-analyst"],
      "completedAt": ""
    },
    "analysis": {
      "status": "in_progress",
      "agents": ["market-analyst", "data-strategist"],
      "completedAt": null
    },
    "creative": {
      "status": "pending",
      "agents": ["creative-director", "prompt-engineer"],
      "completedAt": null
    }
  },
  "deliverables": []
}
```

---

## Workflow Templates

### Template 1: Full Campaign Build

```
1. Research Phase (parallel)
   ├── client-researcher
   ├── industry-analyst
   └── market-analyst

2. Strategy Phase (sequential, needs research)
   └── data-strategist

3. Creative Phase (parallel, needs all above)
   ├── creative-director
   └── prompt-engineer

4. Aggregation (coordinator)
   └── Compile final deliverables
```

### Template 2: Quick Ad Copy

```
1. Brief Review
   └── Load existing client context

2. Creative Generation
   └── creative-director (copy only)
```

### Template 3: Competitor Analysis

```
1. Research Phase
   └── industry-analyst

2. Report Generation
   └── Compile findings
```

### Template 4: Audience Building

```
1. Research Phase
   └── market-analyst

2. Strategy Phase
   └── data-strategist (audience focus)
```

---

## Deliverables Format

### Full Campaign Deliverable

```markdown
# Marketing Campaign: {Client Name}

## Executive Summary
[2-3 paragraph overview]

## Client Profile
[From client-researcher]

## Market Analysis
[From market-analyst]

## Industry Insights
[From industry-analyst]

## Data & Tracking Strategy
[From data-strategist]

## Creative Assets

### Headlines (10 variations)
1. ...

### Body Copy (5 variations)
1. ...

### Video Scripts
[Full scripts with scene breakdowns]

### AI Generation Prompts
[Ready-to-use prompts for image/video tools]

## Implementation Roadmap
[Phased rollout plan]

## Appendix
[Research sources, data, references]
```

---

## Platform-Specific Expertise

### Facebook/Meta
- Ad Library research
- Pixel events (PageView, ViewContent, AddToCart, Purchase, Lead)
- Custom conversions
- Audience targeting options
- Ad formats (image, video, carousel, collection)

### TikTok
- Creative Center research
- TikTok Pixel events
- Spark Ads strategy
- UGC-style content
- Sound/music trends

### Google
- Search ads
- Display network
- YouTube ads
- Performance Max
- Conversion tracking

### LinkedIn
- B2B targeting
- Insight Tag
- Matched Audiences
- Content types

---

## Agency Integration

### Client Data Sources

1. **Notion** - Client briefs, meeting notes
2. **Google Drive** - Brand assets, past reports
3. **Slack/Discord** - Communication history
4. **CRM** - Customer data, sales info

### Output Destinations

1. **Notion** - Campaign documents
2. **Google Docs** - Shareable reports
3. **Figma** - Visual concepts
4. **Project management** - Task handoff

---

## Quality Checklist

Before finalizing deliverables:

- [ ] All agents completed successfully
- [ ] Findings are consistent (no contradictions)
- [ ] Copy matches brand voice
- [ ] Prompts tested and working
- [ ] Strategy aligns with budget
- [ ] All platforms covered
- [ ] Legal/compliance checked
- [ ] Client approval ready
