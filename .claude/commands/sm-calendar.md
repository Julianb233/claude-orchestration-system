# SM-Calendar - Social Media Calendar View

View and manage your social media content calendar.

## Usage

`/sm-calendar [view] [options]`

## Views

| View | Description |
|------|-------------|
| `week` | Current week (default) |
| `month` | Full month calendar |
| `list` | Upcoming posts as list |
| `gaps` | Days with no content |

## Options

- `--platform linkedin|instagram|twitter` - Filter by platform
- `--status draft|scheduled|published` - Filter by status
- `--client [name]` - Filter by client/campaign

## Instructions

### 1. Load Calendar from Notion

```javascript
mcp__notion__API-post-database-query({
  database_id: "[Social Media Calendar ID from memory]",
  filter: {
    "property": "Status",
    "status": { "does_not_equal": "Published" }
  },
  sorts: [{ "property": "Scheduled Date", "direction": "ascending" }]
})
```

### 2. Check Claude Flow for Unsaved Drafts

```javascript
mcp__claude-flow__memory_search({
  pattern: "draft-posts-*",
  namespace: "social-media"
})
```

### 3. Display Calendar

Format output based on requested view.

**Week View:**
```
## Social Media Calendar - Week of Dec 16, 2025

### Monday, Dec 16
  [LinkedIn] 10:00 AM - "AI trends for 2025..." (Scheduled)
  [Instagram] 2:00 PM - "Behind the scenes..." (Draft)

### Tuesday, Dec 17
  [Twitter/X] 9:00 AM - "Thread: 5 tips..." (Scheduled)
  No Instagram content

### Wednesday, Dec 18
  NO POSTS SCHEDULED - Content gap!

...
```

**Month View:**
Display as calendar grid with post indicators.

**List View:**
Chronological list of all upcoming posts.

**Gaps View:**
Only show days/platforms with no scheduled content.

### 4. Highlight Issues

- Content gaps (days with no posts)
- Platform imbalances (too much on one, nothing on another)
- Scheduling conflicts
- Drafts pending for too long

### 5. Offer Actions

After displaying calendar:
- Fill gaps with AI-generated ideas
- Move/reschedule posts
- Quick-create for specific dates
- Export to Buffer/Later

## Memory Keys

| Key | Purpose |
|-----|---------|
| `calendar-cache` | Cached Notion data (1hr TTL) |
| `draft-posts-*` | Unsaved drafts |
| `notion-db-id` | Social Media Calendar DB ID |
