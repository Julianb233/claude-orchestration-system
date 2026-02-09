# Notion MCP Optimization Reference

## Database IDs (Direct Access)

### Primary Databases
| Database | ID | Primary Use |
|----------|-----|-------------|
| Notes & References | `1b5c283b-4ad9-81cb-b1b0-cf2d3198c224` | Credentials, login info, notes, references |
| CRM Database | `1b5c283b-4ad9-81bb-b13a-fc1dc815bfb4` | Clients, contacts, leads |
| Client Projects | `1b5c283b-4ad9-8121-9daf-c80f8fd9f2a6` | Project management |
| Meeting Summaries | `283c283b-4ad9-8069-b43c-e542f684bbb0` | AI meeting notes |
| Client Portals | `1b5c283b-4ad9-814d-b48e-c57c36f6c9f0` | Client portal pages |

### Secondary Databases
| Database | ID | Primary Use |
|----------|-----|-------------|
| Topics/Resources | `1b5c283b-4ad9-81d4-8a7e-d7c5bfdb874a` | Resource organization |
| Notebooks | `1b5c283b-4ad9-819a-bfc7-c7e95f670e48` | Notebook collections |
| Life Areas | `1b5c283b-4ad9-81ce-afb2-d0ad7cd14601` | Life area organization |
| Journal Entries | `1b5c283b-4ad9-81bd-8409-f32c80b68c01` | Personal journal |
| Content Database | `1b5c283b-4ad9-817d-92f3-f00bd01ef87b` | Content management |
| Global SOPs | `7682877c-b3fe-4f12-9a8d-effc23988e37` | Standard procedures |

### Financial Databases
| Database | ID | Primary Use |
|----------|-----|-------------|
| Income Tracking | `1b5c283b-4ad9-8126-852b-e063cde4e347` | Income records |
| Expenditure | `1b5c283b-4ad9-8115-9e92-f132fb63a28c` | Expense tracking |
| Budgets | `1b5c283b-4ad9-813a-89d2-d81b6cc404e3` | Budget management |

---

## Property IDs for filter_properties

### Notes & References Database
```
title        → Title (name field)
FUsY         → Quick Summary
c~eS         → AI summary
JO\F         → Category (select)
ZXnM         → Type (select)
QIHo         → Created (date)
=ORN         → Last Edited (date)
c353c43d...  → URL
D~{w         → Related Notebook
fzvb         → Topic/Resource
```

### CRM Database
```
title        → Name / Company
y/XJ         → 1st Email
Mj$g         → Phone
qeOI         → Contact Type (status)
osj;         → Website 1
D[wi         → Website 2
Vv\:         → Twitter
YuPf         → Instagram
qsQE         → Client Portal Page
m~\c         → Projects (relation)
```

### Client Projects Database
```
title        → Project Name
(lookup property IDs as needed)
```

### Meeting Summaries Database
```
title        → Meeting Title
YkTe         → Date
<iEh         → Meeting Type
_r]J         → AI Summary
bB^Z         → Source
nvr|         → Key Action Items
kv\r         → Follow-up Required
```

---

## Optimized Query Templates

### 1. Find Credentials (Login Info)
```json
{
  "database_id": "1b5c283b-4ad9-81cb-b1b0-cf2d3198c224",
  "filter": {
    "and": [
      { "property": "Category", "select": { "equals": "Login info" } },
      { "property": "title", "title": { "contains": "SERVICE_NAME" } }
    ]
  },
  "filter_properties": ["title", "FUsY", "c~eS"],
  "page_size": 3
}
```

### 2. Find Client by Name
```json
{
  "database_id": "1b5c283b-4ad9-81bb-b13a-fc1dc815bfb4",
  "filter": {
    "property": "Name / Company",
    "title": { "contains": "CLIENT_NAME" }
  },
  "filter_properties": ["title", "y/XJ", "Mj$g", "qeOI", "osj;"],
  "page_size": 5
}
```

### 3. Find Recent Meeting Notes
```json
{
  "database_id": "283c283b-4ad9-8069-b43c-e542f684bbb0",
  "filter": {
    "property": "Date",
    "date": { "past_week": {} }
  },
  "filter_properties": ["title", "YkTe", "_r]J", "nvr|"],
  "page_size": 10,
  "sorts": [{ "property": "Date", "direction": "descending" }]
}
```

### 4. Find All Login Info Entries
```json
{
  "database_id": "1b5c283b-4ad9-81cb-b1b0-cf2d3198c224",
  "filter": {
    "property": "Category",
    "select": { "equals": "Login info" }
  },
  "filter_properties": ["title", "FUsY"],
  "page_size": 25
}
```

### 5. Find Active Client Projects
```json
{
  "database_id": "1b5c283b-4ad9-8121-9daf-c80f8fd9f2a6",
  "filter": {
    "property": "Status",
    "status": { "does_not_equal": "Completed" }
  },
  "page_size": 20
}
```

---

## Category Values (Notes & References)

For filtering by Category select field:
- `Login info` - Credentials and access tokens
- `Tech` - Technical notes
- `Meeting Notes` - Meeting records
- `Articles` - Saved articles
- `Books` - Book notes
- `Notion` - Notion-related
- `Ai` - AI tools and notes
- `SOP` - Standard procedures
- `Reference Material` - General references

---

## Best Practices

### DO:
- Use `database_id` directly instead of searching
- Use `filter` to narrow results server-side
- Use `filter_properties` to limit returned fields
- Set `page_size` to minimum needed (3-10 for lookups)
- Use `sorts` when you need most recent first

### DON'T:
- Use `API-post-search` unless database is unknown
- Request `page_size: 100` for simple lookups
- Omit `filter_properties` (returns ALL fields)
- Fetch all pages then filter in memory

---

## Common Credential Lookups

| Service | Title Contains |
|---------|----------------|
| GitHub | `GitHub` or `Claude code cloud` |
| Vercel | `Vercel` |
| OpenAI | `OpenAI` |
| Notion | `Notion API` |
| Twilio | `Twilio` |
| Cursor | `Cursor` |
| Govee | `Govee` |

---

## CREATE Templates (Copy-Paste Ready)

### New Note (Notes & References)
```
Tool: mcp__notion__API-post-page
parent: { "database_id": "1b5c283b-4ad9-81cb-b1b0-cf2d3198c224" }
properties: {
  "Title": { "title": [{ "text": { "content": "YOUR_TITLE" } }] },
  "Category": { "select": { "name": "CATEGORY" } },
  "Quick Summary": { "rich_text": [{ "text": { "content": "SUMMARY" } }] }
}
```
Categories: `Login info`, `Tech`, `Ai`, `SOP`, `Meeting Notes`, `Reference Material`

### New Credential Entry
```
Tool: mcp__notion__API-post-page
parent: { "database_id": "1b5c283b-4ad9-81cb-b1b0-cf2d3198c224" }
properties: {
  "Title": { "title": [{ "text": { "content": "SERVICE_NAME credentials" } }] },
  "Category": { "select": { "name": "Login info" } },
  "Quick Summary": { "rich_text": [{ "text": { "content": "API Key: xxx | Secret: yyy" } }] }
}
```

### New CRM Contact
```
Tool: mcp__notion__API-post-page
parent: { "database_id": "1b5c283b-4ad9-81bb-b13a-fc1dc815bfb4" }
properties: {
  "Name / Company": { "title": [{ "text": { "content": "COMPANY_NAME" } }] },
  "1st Email": { "email": "email@example.com" },
  "Phone": { "phone_number": "+1234567890" },
  "Contact Type": { "status": { "name": "Lead" } }
}
```
Contact Types: `Lead`, `Client`, `Sponsor`, `Employee`, `Freelancer`, `Friend`

### New Meeting Summary
```
Tool: mcp__notion__API-post-page
parent: { "database_id": "283c283b-4ad9-8069-b43c-e542f684bbb0" }
properties: {
  "Meeting Title": { "title": [{ "text": { "content": "MEETING_TITLE" } }] },
  "Date": { "date": { "start": "2025-12-12" } },
  "Meeting Type": { "select": { "name": "TYPE" } },
  "AI Summary": { "rich_text": [{ "text": { "content": "SUMMARY" } }] },
  "Key Action Items": { "rich_text": [{ "text": { "content": "- Item 1\n- Item 2" } }] }
}
```
Meeting Types: `Sales`, `Check-in`, `Onboarding`, `Strategy`, `1:1`, `Client Review`

### Add Content Blocks to a Page
```
Tool: mcp__notion__API-patch-block-children
block_id: "PAGE_ID"
children: [
  {
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{ "text": { "content": "Paragraph text here" } }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{ "text": { "content": "Bullet point" } }]
    }
  }
]
```

---

## Property Format Quick Reference

| Type | Format |
|------|--------|
| Title | `{ "title": [{ "text": { "content": "x" } }] }` |
| Text | `{ "rich_text": [{ "text": { "content": "x" } }] }` |
| Select | `{ "select": { "name": "x" } }` |
| Status | `{ "status": { "name": "x" } }` |
| Multi-select | `{ "multi_select": [{ "name": "x" }] }` |
| Email | `{ "email": "x@y.com" }` |
| Phone | `{ "phone_number": "+1" }` |
| URL | `{ "url": "https://x" }` |
| Checkbox | `{ "checkbox": true }` |
| Date | `{ "date": { "start": "YYYY-MM-DD" } }` |
| Number | `{ "number": 123 }` |
| Relation | `{ "relation": [{ "id": "page_id" }] }` |
