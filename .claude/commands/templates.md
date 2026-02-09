# Template Library

You are the TEMPLATE MANAGER - organizing, accessing, and generating templates for all content types, clients, and agent outputs.

## Template Architecture

```
/root/.claude/templates/
├── content/
│   ├── scripts/
│   │   ├── video-short.md       # 15-60s scripts
│   │   ├── video-long.md        # 2-15 min scripts
│   │   ├── podcast.md           # Audio content
│   │   └── webinar.md           # Long-form presentations
│   ├── social/
│   │   ├── linkedin.md
│   │   ├── instagram.md
│   │   ├── twitter.md
│   │   └── carousel.md
│   ├── email/
│   │   ├── newsletter.md
│   │   ├── cold-outreach.md
│   │   └── sequence.md
│   └── landing/
│       ├── sales-page.md
│       └── lead-magnet.md
├── marketing/
│   ├── campaign-brief.md
│   ├── offer-stack.md
│   ├── funnel-map.md
│   └── ad-copy.md
├── client/
│   ├── onboarding.md
│   ├── brand-voice.md
│   ├── project-brief.md
│   └── deliverable-spec.md
├── agents/
│   ├── qc-report.md
│   ├── metrics-report.md
│   └── pipeline-output.md
└── output/
    ├── html-preview.html
    ├── pdf-export.html
    └── notion-page.md
```

---

## Commands

| Command | Action |
|---------|--------|
| `/templates` | List all available templates |
| `/templates "category"` | List templates in category |
| `/templates use "name"` | Load template for use |
| `/templates create "name"` | Create new template |
| `/templates edit "name"` | Edit existing template |
| `/templates preview "name"` | Preview template with sample data |
| `/templates export "name"` | Export template to file |
| `/templates sync` | Sync templates with Notion |

---

## Template Categories

### Content Templates

#### Video Scripts
| Template | Duration | Use Case |
|----------|----------|----------|
| video-short | 15-60s | TikTok, Reels, Shorts |
| video-medium | 1-5 min | YouTube, LinkedIn Video |
| video-long | 5-15 min | Tutorials, explainers |
| video-course | 15-60 min | Course modules |

#### Social Posts
| Template | Platform | Format |
|----------|----------|--------|
| linkedin-post | LinkedIn | Text + optional image |
| linkedin-article | LinkedIn | Long-form article |
| instagram-caption | Instagram | Caption + hashtags |
| instagram-carousel | Instagram | Multi-slide carousel |
| twitter-thread | Twitter/X | Thread format |

#### Email Templates
| Template | Type | Use Case |
|----------|------|----------|
| newsletter | Broadcast | Regular updates |
| cold-outreach | Sales | Initial contact |
| follow-up | Sales | Nurture sequence |
| onboarding | Automation | Welcome series |

### Marketing Templates

| Template | Purpose |
|----------|---------|
| campaign-brief | Campaign planning document |
| offer-stack | Grand Slam Offer structure |
| funnel-map | Sales funnel visualization |
| ad-copy | Advertising copy variants |
| landing-page | Sales/landing page structure |

### Client Templates

| Template | Purpose |
|----------|---------|
| onboarding | New client setup |
| brand-voice | Brand guidelines |
| project-brief | Project requirements |
| deliverable-spec | Output specifications |

---

## Template Structure

Each template follows this format:

```markdown
---
name: Template Name
category: content/marketing/client/agent
type: script/post/email/document
version: 1.0
author: AI Acrobatics
variables:
  - name: client_name
    type: string
    required: true
  - name: topic
    type: string
    required: true
  - name: duration
    type: enum
    options: [15s, 30s, 60s, 2min, 5min]
---

# {template_name}

## Section 1
{content with {{variables}}}

## Section 2
{more content}
```

---

## Template Variables

### Common Variables
| Variable | Type | Description |
|----------|------|-------------|
| `{{client_name}}` | string | Client display name |
| `{{brand_voice}}` | text | Brand voice guidelines |
| `{{topic}}` | string | Content topic |
| `{{cta}}` | string | Call to action |
| `{{date}}` | date | Current/target date |

### Content Variables
| Variable | Type | Description |
|----------|------|-------------|
| `{{hook}}` | string | Opening hook |
| `{{problem}}` | string | Pain point |
| `{{solution}}` | string | Your solution |
| `{{proof}}` | string | Social proof |
| `{{offer}}` | string | What you're offering |

### Client Variables
| Variable | Type | Description |
|----------|------|-------------|
| `{{industry}}` | string | Client industry |
| `{{audience}}` | string | Target audience |
| `{{usp}}` | string | Unique selling prop |
| `{{competitors}}` | array | Competitor list |

---

## Operations

### Load Template
```javascript
async function loadTemplate(name) {
  const templatePath = findTemplatePath(name);
  const template = await Read(templatePath);
  const parsed = parseTemplateFrontmatter(template);

  return {
    name: parsed.name,
    content: parsed.content,
    variables: parsed.variables,
    render: (data) => renderTemplate(parsed.content, data)
  };
}
```

### Render Template
```javascript
function renderTemplate(template, data) {
  let rendered = template;

  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value);
  }

  return rendered;
}
```

### Create Custom Template
```javascript
async function createTemplate(name, category, content) {
  const templatePath = `/root/.claude/templates/${category}/${name}.md`;

  const fullTemplate = `---
name: ${name}
category: ${category}
version: 1.0
created: ${new Date().toISOString()}
---

${content}`;

  await Write(templatePath, fullTemplate);

  // Store in memory for quick access
  mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "templates",
    key: `template-${name}`,
    value: JSON.stringify({ path: templatePath, name, category }),
    ttl: 0
  });
}
```

---

## Template Examples

### Video Script (Short)
```markdown
---
name: video-short
duration: 15-60s
---

# {{topic}} - Short Video Script

## HOOK (0-3s)
{{hook}}

## PROBLEM (3-10s)
{{problem}}

## SOLUTION (10-25s)
{{solution}}

## PROOF (25-40s)
{{proof}}

## CTA (40-60s)
{{cta}}

---
Tone: {{brand_voice}}
Client: {{client_name}}
```

### LinkedIn Post
```markdown
---
name: linkedin-post
platform: LinkedIn
---

{{hook}}

{{body}}

{{cta}}

---
{{hashtags}}
```

---

## Client-Specific Templates

Each client can have custom templates stored at:
```
/root/ai-acrobatics/clients/{client-slug}/brand/templates/
```

Load priority:
1. Client-specific template
2. Industry template
3. Default template

```javascript
async function getTemplate(name, clientSlug) {
  // Check client templates first
  const clientPath = `/root/ai-acrobatics/clients/${clientSlug}/brand/templates/${name}.md`;
  if (await exists(clientPath)) {
    return loadTemplate(clientPath);
  }

  // Fall back to default
  return loadTemplate(name);
}
```

---

## Memory Integration

### Store Template Registry
```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "templates",
  key: "registry",
  value: JSON.stringify({
    templates: templateList,
    lastUpdated: new Date().toISOString()
  }),
  ttl: 0
})
```

### Quick Template Lookup
```javascript
mcp__claude-flow__memory_search({
  pattern: "template-*",
  namespace: "templates"
})
```

---

## Requirements

$ARGUMENTS

## Instructions

1. Parse the template command
2. For listing: show templates with categories
3. For using: load template and apply variables
4. For creating: generate new template file
5. For preview: render with sample data
6. Store templates in memory for quick access
