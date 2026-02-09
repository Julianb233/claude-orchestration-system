# SM-Preview - Social Media Preview Generator

Generate beautiful HTML mockups of social media posts.

## Usage

`/sm-preview [source] [options]`

## Sources

| Source | Description |
|--------|-------------|
| `drafts` | All current drafts from memory |
| `scheduled` | Upcoming scheduled posts |
| `all` | Both drafts and scheduled |
| `[post-id]` | Specific post by ID |

## Options

- `--output [path]` - Save location (default: `/tmp/social-preview-{timestamp}.html`)
- `--calendar` - Include calendar view
- `--platform [platform]` - Filter by platform

## Instructions

### 1. Load Posts to Preview

**From Memory (drafts):**
```javascript
mcp__claude-flow__memory_search({
  pattern: "draft-posts-*",
  namespace: "social-media"
})
```

**From Notion (scheduled):**
```javascript
mcp__notion__API-post-database-query({
  database_id: "[Social Media Calendar ID]",
  filter: { "property": "Status", "status": { "equals": "Scheduled" }}
})
```

### 2. Load HTML Template

Read template from `/root/.claude/templates/social-preview.html`

### 3. Generate Platform Cards

For each post, generate appropriate HTML card:

**LinkedIn Card:**
- Professional blue styling
- Avatar with initials
- Name, headline, connection degree
- Post content with proper line breaks
- Hashtags in brand blue
- Reaction bar (Like, Comment, Repost, Send)

**Instagram Card:**
- Gradient avatar ring
- Username and verified badge option
- Square image placeholder
- Heart/comment/share/bookmark icons
- Caption with @mentions and #hashtags
- Timestamp

**Twitter/X Card:**
- Minimal design with avatar
- Name, handle, verified badge
- Tweet content with hashtag styling
- Media preview area
- Reply/Retweet/Like/Views/Share bar

### 4. Build Final HTML

Replace template placeholders:
- `{{DATE}}` - Current date
- `{{TIMESTAMP}}` - Generation time
- `{{POSTS}}` - Generated platform cards
- `{{CALENDAR}}` - Optional calendar view

### 5. Save and Open

```javascript
// Write to file
Write({ file_path: outputPath, content: html })

// Return path for user
"Preview saved to: {outputPath}"
"Open in browser to view"
```

## Card HTML Templates

See `/root/.claude/templates/social-preview.html` for full templates.

Each card includes:
- Platform badge (LinkedIn blue, Instagram gradient, Twitter/X black)
- Status badge (Draft=yellow, Scheduled=green, Published=blue)
- Scheduled time display
- Realistic platform mockup

## Output

Returns:
1. File path to generated HTML
2. Count of posts included
3. Platforms represented
4. Option to open in browser
