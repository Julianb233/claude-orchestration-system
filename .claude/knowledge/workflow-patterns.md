# N8n Workflow Patterns

## 1. Basic Webhook Handler

```json
{
  "name": "Webhook Handler",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [250, 300],
      "id": "webhook-1",
      "name": "Webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "my-endpoint",
        "responseMode": "responseNode"
      }
    },
    {
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [450, 300],
      "id": "respond-1",
      "name": "Respond",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { success: true, data: $json } }}"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Respond", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## 2. AI Agent with Tools

```json
{
  "name": "AI Agent",
  "nodes": [
    {
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.1,
      "position": [250, 300],
      "id": "trigger-1",
      "name": "Chat Trigger",
      "parameters": {}
    },
    {
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [450, 300],
      "id": "agent-1",
      "name": "AI Agent",
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.chatInput }}",
        "options": {
          "systemMessage": "You are a helpful assistant."
        }
      }
    },
    {
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [450, 500],
      "id": "openai-1",
      "name": "OpenAI",
      "parameters": {
        "model": "gpt-4o-mini",
        "options": { "temperature": 0.7 }
      },
      "credentials": { "openAiApi": { "id": "xxx", "name": "OpenAI" } }
    }
  ],
  "connections": {
    "Chat Trigger": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "OpenAI": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    }
  }
}
```

---

## 3. HTTP API Call

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [450, 300],
  "id": "http-1",
  "name": "API Call",
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/endpoint",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify($json) }}"
  }
}
```

---

## 4. VAPI Phone Call

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [450, 300],
  "id": "vapi-call",
  "name": "VAPI Call",
  "parameters": {
    "method": "POST",
    "url": "https://api.vapi.ai/call",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "Bearer {{ $credentials.vapiApiKey }}" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ phoneNumberId: $env.VAPI_PHONE_ID, assistantId: $env.VAPI_ASSISTANT_ID, customer: { number: $json.phone }, type: 'outboundPhoneCall' }) }}"
  }
}
```

---

## 5. Conditional Branching

```json
{
  "type": "n8n-nodes-base.if",
  "typeVersion": 2.2,
  "position": [450, 300],
  "id": "if-1",
  "name": "Check Status",
  "parameters": {
    "conditions": {
      "options": { "version": 2 },
      "conditions": [
        {
          "leftValue": "={{ $json.status }}",
          "rightValue": "success",
          "operator": { "type": "string", "operation": "equals" }
        }
      ]
    }
  }
}
```

---

## 6. Data Transformation

```json
{
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4,
  "position": [450, 300],
  "id": "set-1",
  "name": "Transform Data",
  "parameters": {
    "mode": "manual",
    "assignments": {
      "assignments": [
        { "id": "1", "name": "fullName", "value": "={{ $json.firstName + ' ' + $json.lastName }}", "type": "string" },
        { "id": "2", "name": "timestamp", "value": "={{ DateTime.now().toISO() }}", "type": "string" }
      ]
    }
  }
}
```

---

## Connection Types

| Type | Use For |
|------|---------|
| `main` | Data flow (default) |
| `ai_tool` | Tools for AI agent |
| `ai_languageModel` | LLM for AI agent |
| `ai_memory` | Memory for AI agent |
| `ai_outputParser` | Output parser |

---

## Node Positioning

- Start X: 250
- Increment X: 200 per column
- Start Y: 300
- Increment Y: 200 per row
- AI sub-nodes: Y + 200 below main agent

---

## Credential Patterns

```json
"credentials": {
  "openAiApi": { "id": "cred-id", "name": "OpenAI API" },
  "httpHeaderAuth": { "id": "cred-id", "name": "VAPI API Key" }
}
```
