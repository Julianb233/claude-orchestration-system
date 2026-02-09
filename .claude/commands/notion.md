Smart Notion assistant - automatically detect intent and execute the right action.

## Intent Detection Rules

Analyze "$ARGUMENTS" to determine the action:

### SEARCH for Credentials (use when):
- Contains: "api key", "credentials", "token", "secret", "password", "login", "auth"
- Contains service names: "github", "vercel", "openai", "stripe", "twilio", "notion api", "cursor", "govee"
- Phrasing: "get", "find", "lookup", "what is", "fetch"

**Action:** Query Notes & References DB
```
database_id: 1b5c283b-4ad9-81cb-b1b0-cf2d3198c224
filter: Category = "Login info" AND title contains [SERVICE]
filter_properties: ["title", "FUsY", "c~eS"]
page_size: 3
```

### SEARCH for Client (use when):
- Contains: "client", "contact", "company", "customer", "lead"
- Contains: "email for", "phone for", "info on"
- Phrasing: "who is", "find", "lookup", "get info"

**Action:** Query CRM DB
```
database_id: 1b5c283b-4ad9-81bb-b13a-fc1dc815bfb4
filter: "Name / Company" contains [NAME]
filter_properties: ["title", "y/XJ", "Mj$g", "qeOI", "osj;"]
page_size: 5
```

### SEARCH for Meeting (use when):
- Contains: "meeting", "call", "summary", "action items", "notes from"
- Contains: "last meeting", "recent meeting"

**Action:** Query Meeting Summaries DB
```
database_id: 283c283b-4ad9-8069-b43c-e542f684bbb0
filter: title contains [SEARCH] OR Date in past_week
filter_properties: ["title", "YkTe", "_r]J", "nvr|"]
page_size: 10
sorts: [{ "property": "Date", "direction": "descending" }]
```

### SEARCH for Project (use when):
- Contains: "project", "active project", "project status"

**Action:** Query Client Projects DB
```
database_id: 1b5c283b-4ad9-8121-9daf-c80f8fd9f2a6
filter: title contains [PROJECT_NAME]
page_size: 10
```

### CREATE Credential (use when):
- Contains: "add", "save", "store", "create" + "credential", "api key", "token", "secret"
- Format detected: "service | value" or "save X as Y"

**Action:** Create in Notes & References
```
database_id: 1b5c283b-4ad9-81cb-b1b0-cf2d3198c224
properties:
  Title: [SERVICE_NAME] + " credentials"
  Category: select "Login info"
  Quick Summary: [CREDENTIAL_VALUE]
```

### CREATE Contact (use when):
- Contains: "add", "create", "new" + "contact", "client", "lead"
- Format detected: "name | email" or "name | email | phone"

**Action:** Create in CRM
```
database_id: 1b5c283b-4ad9-81bb-b13a-fc1dc815bfb4
properties:
  "Name / Company": [NAME]
  "1st Email": [EMAIL]
  "Phone": [PHONE] (if provided)
  "Contact Type": status "Lead"
```

### CREATE Note (use when):
- Contains: "add note", "save note", "quick note", "jot down", "remember"
- Default category: "Tech" unless specified

**Action:** Create in Notes & References
```
database_id: 1b5c283b-4ad9-81cb-b1b0-cf2d3198c224
properties:
  Title: [NOTE_TITLE]
  Category: select [CATEGORY or "Tech"]
  Quick Summary: [CONTENT]
```

### CREATE Meeting Summary (use when):
- Contains: "add meeting", "log meeting", "meeting with", "save meeting notes"

**Action:** Create in Meeting Summaries
```
database_id: 283c283b-4ad9-8069-b43c-e542f684bbb0
properties:
  "Meeting Title": [TITLE]
  "Date": today's date
  "Meeting Type": [TYPE or "Check-in"]
  "AI Summary": [SUMMARY]
  "Key Action Items": [ACTION_ITEMS]
```

## Response Format

After executing, respond with:
1. What action was taken
2. Key data found or created
3. Notion page URL (if applicable)

## Examples

- `/notion github token` → SEARCH credentials for GitHub
- `/notion client acme` → SEARCH CRM for Acme
- `/notion add credential stripe | sk_live_xxx` → CREATE credential
- `/notion new contact John Smith | john@test.com` → CREATE contact
- `/notion save note about deployment | Tech | Fixed nginx config` → CREATE note
- `/notion last meeting with client` → SEARCH recent meetings
