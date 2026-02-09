# Social Media Agent

Smart social media assistant for creating, previewing, and scheduling posts across LinkedIn, Instagram, and Twitter/X.

## Usage

`/social [action] [arguments]`

## Actions

| Action | Description | Example |
|--------|-------------|---------|
| `create` | Create new post(s) | `/social create "Product launch announcement"` |
| `calendar` | View/manage calendar | `/social calendar` or `/social calendar week` |
| `preview` | Generate HTML preview | `/social preview` |
| `schedule` | Schedule post to Notion | `/social schedule "Post title" 2025-01-15 10:00` |
| `export` | Export to Buffer/Later CSV | `/social export buffer` |
| `sync` | Sync with Notion | `/social sync` |
| `ideas` | Generate post ideas | `/social ideas [topic]` |
| `drafts` | View current drafts | `/social drafts` |

## Quick Aliases

- `/sm` - Same as `/social`
- `/sm-calendar` - Direct to `/social calendar`
- `/sm-preview` - Direct to `/social preview`
- `/sm-notion` - Direct to `/social sync`
- `/sm-export` - Direct to `/social export`

## Workflow

### Create Multi-Platform Posts

```
/social create "We just shipped our new AI feature"
```

This will:
1. Parse the brief/topic
2. Check for active client brand profile
3. Generate 3 platform-optimized versions:
   - **LinkedIn**: Professional, 3-5 hashtags, thought-leadership
   - **Instagram**: Visual-focused, emoji-rich, 20-30 hashtags
   - **Twitter/X**: Punchy, 280 chars, thread if needed
4. Store drafts in Claude Flow memory
5. Offer: [Preview] [Schedule] [Edit] [Export]

### View Calendar

```
/social calendar week
```

Displays:
- Current week's scheduled posts by platform
- Content gaps highlighted
- Draft posts ready for scheduling
- Suggestions to fill gaps

### Generate Preview

```
/social preview
```

Creates HTML file with platform mockups:
- LinkedIn card (professional blue styling)
- Instagram card (gradient, square format)
- Twitter/X card (minimal design)

Opens in browser for review.

### Schedule to Notion

```
/social schedule "AI Feature Launch" 2025-01-15 10:00
```

Creates page in Social Media Calendar database with:
- Post content
- Platform
- Scheduled date/time
- Hashtags
- Status: Scheduled

### Export for Scheduling Tools

```
/social export buffer
/social export later
/social export csv
```

Generates CSV file compatible with:
- **Buffer**: Text, Link, Image, Scheduled At, Platform
- **Later**: caption, image_url, date, time, hashtags, platform

## Memory Integration

### Claude Flow Namespace: `social-media`

| Key | Purpose |
|-----|---------|
| `draft-posts-*` | Unsaved post drafts |
| `calendar-cache` | Cached Notion calendar |
| `hashtag-library` | Curated hashtags |
| `notion-db-id` | Social Media Calendar DB ID |

### Check/Store Drafts

```javascript
// Store drafts
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "social-media",
  key: `draft-posts-${Date.now()}`,
  value: JSON.stringify({ posts: [...] }),
  ttl: 604800
})

// Retrieve drafts
mcp__claude-flow__memory_search({
  pattern: "draft-posts-*",
  namespace: "social-media"
})
```

## Notion Integration

### Database: Social Media Calendar

Query scheduled posts:
```javascript
mcp__notion__API-post-database-query({
  database_id: "[from memory: notion-db-id]",
  filter: { "property": "Status", "status": { "does_not_equal": "Published" }},
  sorts: [{ "property": "Scheduled Date", "direction": "ascending" }]
})
```

Create new post:
```javascript
mcp__notion__API-post-page({
  parent: { database_id: "[db-id]" },
  properties: {
    "Post Title": { title: [{ text: { content: "[title]" }}]},
    "Content": { rich_text: [{ text: { content: "[content]" }}]},
    "Platform": { select: { name: "LinkedIn|Instagram|Twitter/X" }},
    "Status": { status: { name: "Scheduled" }},
    "Scheduled Date": { date: { start: "[ISO datetime]" }},
    "Hashtags": { rich_text: [{ text: { content: "[hashtags]" }}]}
  }
})
```

## Platform Guidelines

### LinkedIn
- Professional tone, thought-leadership
- First 2 lines = hook (before "see more")
- 3-5 relevant hashtags
- Best times: Tue-Thu 8-10am, 12pm

### Instagram
- Visual-first, emoji-rich
- 20-30 hashtags (first comment or end)
- Suggest carousel/reel/story format
- Best times: Mon/Wed/Fri 11am-1pm

### Twitter/X
- Punchy, conversational
- 280 chars or thread for longer content
- 1-3 hashtags max
- Best times: Mon-Fri 8am-4pm

## Video Content Creation

### Video Commands

| Action | Description | Example |
|--------|-------------|---------|
| `video` | Create video script | `/sm video "Product launch" --platform reels` |
| `video-brief` | Create video brief only | `/sm video-brief "Customer testimonial"` |
| `hooks` | Generate hook variations | `/sm hooks "Time management" --count 5` |
| `video-full` | Full package (script + hooks + caption) | `/sm video-full "Course launch"` |

### Video Options

- `--platform [reels|tiktok|linkedin|youtube-shorts|youtube]` - Target platform
- `--duration [15s|30s|60s|3min]` - Target duration
- `--product "Name"` - Product/service being promoted
- `--cta "Action"` - Specific call to action
- `--style [educational|promotional|testimonial|bts]` - Content style

### Example: Full Video Script

```bash
/sm video "AI Automation Tool Launch" --platform reels --duration 30s --product "Claude Flow" --cta "Link in bio"
```

**Outputs:**
1. Complete script with HOOK → PROBLEM → SOLUTION → CTA structure
2. 3 alternative hooks
3. Platform-optimized caption with hashtags
4. Visual/B-roll suggestions
5. Music mood recommendation

### Video Brief Analysis

Before any video script, the agent gathers:

| Element | Purpose |
|---------|---------|
| **Purpose** | Why does this video exist? |
| **Outcome** | What should viewer KNOW, FEEL, or DO? |
| **CTA** | Single action we want |
| **Product** | What transformation does it provide? |
| **Audience** | Pain points and desires |

### Story Structures Available

- **PAS** - Problem → Agitate → Solution
- **BAB** - Before → After → Bridge
- **HSO** - Hook → Story → Offer
- **AIDA** - Attention → Interest → Desire → Action

## Integration with Other Agents

- **branding-agent**: Apply client brand styling
- **ebook-asset-manager**: Source images for posts
- **seo-keyword-strategist**: Optimize hashtags
- **content-marketer**: Campaign planning
