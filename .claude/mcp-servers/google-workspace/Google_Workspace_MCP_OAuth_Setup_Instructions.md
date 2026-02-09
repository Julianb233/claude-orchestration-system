# Google Workspace MCP Setup Guide

## Current Status

**Currently Authenticated:**
- `julianb233@gmail.com` (Gmail App Password only - for email sending)

**Needs OAuth Setup:**
- Both `julianb233@gmail.com` and `julian@aiacrobatics.com` need full OAuth 2.0 authentication for Google Workspace MCP

## What's Different?

| Feature | Gmail App Password | Google Workspace MCP |
|---------|-------------------|---------------------|
| Email Sending | Yes | Yes |
| Email Reading | No | Yes |
| Google Drive | No | Yes |
| Google Calendar | No | Yes |
| Google Docs | No | Yes |
| Google Sheets | No | Yes |
| Google Contacts | No | Yes |
| Google Forms | No | Yes |
| Google Tasks | No | Yes |

## Setup Steps

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "Claude MCP Integration"
3. Enable billing (if not already)

### Step 2: Enable Required APIs

Enable these APIs in the Google Cloud Console:
- Gmail API
- Google Drive API
- Google Calendar API
- Google Docs API
- Google Sheets API
- People API (Contacts)
- Google Forms API
- Tasks API

### Step 3: Create OAuth 2.0 Credentials

1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: **Desktop App**
4. Name: "Claude MCP"
5. Download the JSON credentials file

### Step 4: Configure Environment

Create `/root/.claude/mcp-servers/google-workspace/.env`:

```bash
# From your downloaded credentials JSON
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# OAuth Settings
GOOGLE_REDIRECT_URI=http://localhost:8080/oauth/callback
```

### Step 5: First-Time Authentication

Run:
```bash
workspace-mcp auth login
```

This will open a browser for you to:
1. Sign in with `julianb233@gmail.com`
2. Grant permissions
3. Repeat for `julian@aiacrobatics.com`

### Step 6: Test Connection

```bash
workspace-mcp test
```

## Multiple Account Support

The Google Workspace MCP supports multiple accounts. After initial setup:

```bash
# Add first account
workspace-mcp auth login --account julianb233@gmail.com

# Add second account
workspace-mcp auth login --account julian@aiacrobatics.com
```

## Available Tools After Setup

### Gmail
- `gmail_search` - Search emails
- `gmail_get_message` - Read specific email
- `gmail_send` - Send new email
- `gmail_reply` - Reply to email
- `gmail_create_draft` - Create draft
- `gmail_trash` - Delete email

### Calendar
- `calendar_list` - List calendars
- `calendar_get_events` - Get events
- `calendar_create_event` - Create event
- `calendar_update_event` - Modify event
- `calendar_delete_event` - Remove event

### Drive
- `drive_list` - List files/folders
- `drive_search` - Search files
- `drive_upload` - Upload file
- `drive_download` - Download file
- `drive_create_folder` - Create folder
- `drive_move` - Move file/folder
- `drive_share` - Share file

### Docs
- `docs_get` - Read document
- `docs_create` - Create document
- `docs_update` - Edit document
- `docs_append` - Add content

### Sheets
- `sheets_get` - Get spreadsheet
- `sheets_create` - Create spreadsheet
- `sheets_read_range` - Read cells
- `sheets_write_range` - Write cells

### Contacts
- `contacts_list` - List contacts
- `contacts_get` - Get contact
- `contacts_create` - Add contact
- `contacts_update` - Update contact

### Tasks
- `tasks_list` - List tasks
- `tasks_create` - Create task
- `tasks_complete` - Mark complete

## Need Help?

If you have Google Cloud credentials already, share the client ID and secret (save to Notion securely) and I'll complete the setup automatically.

---
*Created: December 18, 2025*
*MCP Server: workspace-mcp v1.6.2*
