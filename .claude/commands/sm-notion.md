# SM-Notion - Social Media Notion Sync

Sync posts between Claude Flow memory and Notion calendar.

## Usage

`/sm-notion [action]`

## Actions

| Action | Description |
|--------|-------------|
| `push` | Push drafts from memory to Notion (default) |
| `pull` | Pull scheduled posts from Notion to memory |
| `status` | Show sync status |
| `setup` | Create Social Media Calendar database |

## Instructions

### Push to Notion

1. **Get drafts from memory:**
```javascript
mcp__claude-flow__memory_search({
  pattern: "draft-posts-*",
  namespace: "social-media"
})
```

2. **Get database ID:**
```javascript
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "social-media",
  key: "notion-db-id"
})
```

3. **For each draft post, create Notion page:**
```javascript
mcp__notion__API-post-page({
  parent: { database_id: "[Social Media Calendar ID]" },
  properties: {
    "Post Title": { title: [{ text: { content: "[title]" }}]},
    "Content": { rich_text: [{ text: { content: "[content]" }}]},
    "Platform": { select: { name: "[LinkedIn|Instagram|Twitter/X]" }},
    "Status": { status: { name: "Draft" }},
    "Scheduled Date": { date: { start: "[ISO datetime]" }},
    "Content Type": { select: { name: "[Text|Image|Video|Carousel|Thread]" }},
    "Hashtags": { rich_text: [{ text: { content: "[hashtags]" }}]},
    "Image URL": { url: "[url or null]" }
  }
})
```

4. **Store Notion page IDs back in memory** for reference

5. **Clear processed drafts** from memory

### Pull from Notion

1. **Query Notion calendar:**
```javascript
mcp__notion__API-post-database-query({
  database_id: "[Social Media Calendar ID]",
  filter: {
    "property": "Status",
    "status": { "does_not_equal": "Published" }
  },
  sorts: [{ "property": "Scheduled Date", "direction": "ascending" }]
})
```

2. **Store in memory cache:**
```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "social-media",
  key: "calendar-cache",
  value: JSON.stringify({ posts: [...], synced: Date.now() }),
  ttl: 3600  // 1 hour cache
})
```

### Setup Database

If no Social Media Calendar exists, create one:

1. **Find or create parent page** (Marketing Hub)

2. **Create database:**
```javascript
mcp__notion__API-create-a-database({
  parent: { type: "page_id", page_id: "[Marketing Hub ID]" },
  title: [{ text: { content: "Social Media Calendar" }}],
  properties: {
    "Post Title": { title: {} },
    // Note: Additional properties must be added after creation
  }
})
```

3. **Store database ID:**
```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "social-media",
  key: "notion-db-id",
  value: "[database-id]",
  ttl: 0  // Permanent
})
```

### Status Check

Display:
- Last sync time
- Drafts pending push
- Posts in Notion calendar
- Any sync errors

## Database Schema

**Social Media Calendar Properties:**

| Property | Type | Values |
|----------|------|--------|
| Post Title | Title | - |
| Content | Rich Text | - |
| Platform | Select | LinkedIn, Instagram, Twitter/X |
| Status | Status | Idea, Draft, Scheduled, Published, Failed |
| Scheduled Date | Date | With time |
| Content Type | Select | Text, Image, Video, Carousel, Story, Thread |
| Hashtags | Rich Text | - |
| Image URL | URL | - |
| Client/Campaign | Relation | → Projects |
| Buffer Export Ready | Checkbox | - |
| Performance Notes | Rich Text | - |

## Memory Keys

| Key | Namespace | Purpose |
|-----|-----------|---------|
| `notion-db-id` | social-media | Database ID (permanent) |
| `calendar-cache` | social-media | Cached posts (1hr) |
| `draft-posts-*` | social-media | Unsaved drafts (7 days) |
| `sync-status` | social-media | Last sync info |
