# Deliverable Auto-Publish Workflow

**Triggered by:** Bubba completing client work
**Agent:** Derek-Deliverables
**Destination:** https://julianb233.github.io/client-deliverables/

---

## Workflow Steps

### 1. Receive Deliverable from Agent

Derek receives metadata from the completing agent:

```json
{
  "client": "better-together",
  "title": "Holiday Promo Script",
  "type": "script",
  "description": "30-second promo video script",
  "createdBy": "Scarlett-Script",
  "files": [
    {"name": "script.md", "content": "..."},
    {"name": "notes.md", "content": "..."}
  ]
}
```

### 2. Validate & Format

```javascript
// Get client slug mapping
const mapping = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "clients",
  key: "slug-mapping"
});

// Validate client exists
const clientSlug = mapping.clients[metadata.client] || metadata.client;

// Format date
const date = new Date().toISOString().split('T')[0]; // 2024-12-17

// Create folder name
const folderName = `${date}-${metadata.type}-${slugify(metadata.title)}`;
```

### 3. Generate README

Use template from `/root/.claude/templates/deliverable-readme.md`:

```markdown
# {{TITLE}}

**Client:** {{CLIENT_NAME}}
**Date:** {{DATE}}
**Created by:** {{AGENT_NAME}}
**Type:** {{TYPE}}

---

## Description

{{DESCRIPTION}}

---

## Files Included

{{FILE_LIST}}

---

*Generated automatically by Derek-Deliverables agent*
```

### 4. Push to GitHub

```javascript
await mcp__github__push_files({
  owner: "Julianb233",
  repo: "client-deliverables",
  branch: "main",
  message: `Add ${metadata.type}: ${metadata.title} for ${metadata.client}`,
  files: [
    {
      path: `clients/${clientSlug}/deliverables/${folderName}/README.md`,
      content: generatedReadme
    },
    ...metadata.files.map(f => ({
      path: `clients/${clientSlug}/deliverables/${folderName}/${f.name}`,
      content: f.content
    }))
  ]
});
```

### 5. Update Client Index

Regenerate `clients/{slug}/index.html` with new deliverable card.

### 6. Update Main Portal

Add to recent deliverables feed in `index.html`.

### 7. Store to History

```javascript
await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "deliverables",
  key: `${clientSlug}-${date}-${folderName}`,
  value: {
    client: clientSlug,
    title: metadata.title,
    type: metadata.type,
    createdBy: metadata.createdBy,
    publishedAt: new Date().toISOString(),
    portalUrl: `https://julianb233.github.io/client-deliverables/clients/${clientSlug}/`
  },
  ttl: 2592000 // 30 days
});
```

### 8. Send Email Notification (If Enabled)

```javascript
// Check if notifications are enabled
const config = await mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "clients",
  key: "notification-config"
});

if (config.value.enabled) {
  // Get client contact
  const contact = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "clients",
    key: `contact-${clientSlug}`
  });

  if (contact.found && contact.value.email !== "PENDING") {
    // Render email template
    const subject = config.value.template.subject
      .replace("{{TITLE}}", metadata.title);

    const body = config.value.template.body
      .replace("{{CLIENT_NAME}}", contact.value.name)
      .replace("{{TYPE}}", metadata.type)
      .replace("{{TITLE}}", metadata.title)
      .replace("{{DESCRIPTION}}", metadata.description)
      .replace("{{PORTAL_URL}}", portalUrl);

    // Send via Mailgun API
    // POST https://api.mailgun.net/v3/{domain}/messages
    // Authorization: Basic {api-key}
    // from, to, subject, text

    emailStatus = `Sent to ${contact.value.email}`;
  } else {
    emailStatus = "Client email not configured";
  }
} else {
  emailStatus = "Notifications disabled (add Mailgun API key to enable)";
}
```

### 9. Return Portal URL

```
✅ Published to client portal

**Client:** Better Together
**Deliverable:** Holiday Promo Script
**Type:** Script
**Files:** 2

**View:** https://julianb233.github.io/client-deliverables/clients/better-together/

📧 Email: {emailStatus}

Portal updates in ~1 minute (GitHub Pages deploying)
```

---

## Bubba Integration

Bubba automatically adds Derek as final phase:

```
PHASE N (Final - Auto-added):
└─ Derek-Deliverables → Publish to client portal
```

Derek receives work from previous phases and publishes.

---

## Client Slug Lookup

Stored in Claude Flow memory:

```javascript
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "clients",
  key: "slug-mapping"
})
```

Returns:
```json
{
  "clients": {
    "Better Together": "better-together",
    "Acme Corp": "acme-corp"
  },
  "portalUrl": "https://julianb233.github.io/client-deliverables/",
  "repo": "Julianb233/client-deliverables"
}
```

---

## Adding New Clients

1. Update slug mapping in memory
2. Derek auto-creates client folder on first publish
3. Client index page generated automatically

```javascript
await mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "clients",
  key: "slug-mapping",
  value: {
    ...existingMapping,
    clients: {
      ...existingMapping.clients,
      "New Client Name": "new-client-slug"
    }
  }
});
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| GitHub push fails | Retry 3x, then alert Bubba |
| Client not found | Use slugified client name |
| Invalid files | Skip invalid, publish valid |
| Pages not deploying | Note in response, retry later |
