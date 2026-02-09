# SM-Export - Social Media Export

Export scheduled posts to Buffer, Later, or generic CSV format.

## Usage

`/sm-export [format] [options]`

## Formats

| Format | Description |
|--------|-------------|
| `buffer` | Buffer CSV format |
| `later` | Later CSV format |
| `csv` | Generic CSV |
| `json` | JSON export |

## Options

- `--status scheduled` - Only scheduled posts (default)
- `--platform [platform]` - Filter by platform
- `--from [date]` - Start date (YYYY-MM-DD)
- `--to [date]` - End date (YYYY-MM-DD)
- `--output [path]` - Output file path

## Instructions

### 1. Get Posts from Notion

```javascript
mcp__notion__API-post-database-query({
  database_id: "[Social Media Calendar ID]",
  filter: {
    "and": [
      { "property": "Buffer Export Ready", "checkbox": { "equals": true }},
      { "property": "Status", "status": { "equals": "Scheduled" }}
    ]
  },
  sorts: [{ "property": "Scheduled Date", "direction": "ascending" }]
})
```

### 2. Transform to Target Format

**Buffer CSV Format:**
```csv
Text,Link,Image,Scheduled At,Platform
"Post content here",https://link.com,https://image.url,"2025-01-15 10:00",linkedin
```

**Later CSV Format:**
```csv
caption,image_url,date,time,hashtags,platform
"Post content here",https://image.url,2025-01-15,10:00:00,"#tag1 #tag2",Instagram
```

**Generic CSV Format:**
```csv
content,platform,scheduled_time,hashtags,image_url,status,content_type
"Post content",LinkedIn,2025-01-15T10:00:00Z,"#ai #tech",https://img.url,scheduled,text
```

### 3. Write File

Default path: `/tmp/social-export-{format}-{timestamp}.csv`

### 4. Return Summary

```
Export Complete!

Format: Buffer CSV
Posts: 12
Platforms: LinkedIn (5), Instagram (4), Twitter/X (3)
Date Range: Dec 16 - Dec 31, 2025

File: /tmp/social-export-buffer-1702789200.csv

Preview (first 3 rows):
| Content (truncated) | Platform | Scheduled |
|---------------------|----------|-----------|
| AI trends for 2025... | linkedin | Dec 16 10:00 |
| Behind the scenes... | instagram | Dec 16 14:00 |
| 5 tips for... | twitter | Dec 17 09:00 |
```

## Platform-Specific Notes

### Buffer
- Supports: LinkedIn, Instagram, Twitter, Facebook, Pinterest
- Time format: "YYYY-MM-DD HH:MM"
- Platform names: lowercase

### Later
- Supports: Instagram, TikTok, Pinterest, LinkedIn, Twitter, Facebook
- Time format: Separate date and time columns
- Platform names: Capitalized

### Generic
- ISO 8601 datetime format
- All metadata included
- Good for custom integrations
