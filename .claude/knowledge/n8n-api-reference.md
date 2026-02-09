# N8n API Quick Reference

## Base URL
`{N8N_HOST}/api/v1`

## Authentication
Header: `X-N8N-API-KEY: {API_KEY}`

---

## Workflow Endpoints

### Create Workflow
```
POST /workflows
Body: { name, nodes[], connections{}, settings?, active? }
```

### Get Workflow
```
GET /workflows/{id}
```

### Update Workflow
```
PUT /workflows/{id}
Body: { name, nodes[], connections{}, settings?, active? }
```

### Delete Workflow
```
DELETE /workflows/{id}
```

### List Workflows
```
GET /workflows?active=true&limit=100
```

### Activate/Deactivate
```
POST /workflows/{id}/activate
POST /workflows/{id}/deactivate
```

---

## Execution Endpoints

### Get Executions
```
GET /executions?workflowId={id}&limit=100
```

### Get Execution
```
GET /executions/{executionId}
```

### Delete Execution
```
DELETE /executions/{executionId}
```

---

## Webhook Triggers

### Trigger Webhook Workflow
```
POST /webhook/{webhookPath}
POST /webhook-test/{webhookPath}  (test mode)
```

---

## Workflow JSON Structure

```json
{
  "name": "Workflow Name",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1.1,
      "position": [250, 300],
      "id": "uuid-string",
      "name": "Webhook Trigger",
      "parameters": {
        "httpMethod": "POST",
        "path": "unique-path"
      },
      "webhookId": "optional"
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [[
        { "node": "Next Node", "type": "main", "index": 0 }
      ]]
    }
  },
  "settings": { "executionOrder": "v1" },
  "active": false
}
```

---

## Common Node Types

| Node Type | Purpose |
|-----------|---------|
| `n8n-nodes-base.webhook` | HTTP trigger |
| `n8n-nodes-base.httpRequest` | Make API calls |
| `n8n-nodes-base.set` | Set variables |
| `n8n-nodes-base.if` | Conditional |
| `n8n-nodes-base.code` | JavaScript |
| `@n8n/n8n-nodes-langchain.agent` | AI Agent |
| `@n8n/n8n-nodes-langchain.lmChatOpenAi` | OpenAI |

---

## MCP Tools (n8n-mcp)

When n8n-mcp is configured, use these tools directly:

- `n8n_create_workflow` - Create new workflow
- `n8n_update_partial_workflow` - Diff-based updates (efficient)
- `n8n_validate_workflow` - Validate before deploy
- `n8n_trigger_webhook_workflow` - Execute via webhook
- `n8n_health_check` - Check connection

---

## Expression Syntax

```
{{ $json.fieldName }}                    // Current node data
{{ $node["NodeName"].json.field }}       // Other node data
{{ $json.field ? 'yes' : 'no' }}         // Conditional
{{ $input.first().json.data }}           // First input item
{{ DateTime.now().toISO() }}             // Current time
```
