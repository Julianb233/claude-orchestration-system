# N8N Reference Guide

**Last Updated:** Auto-updates from documentation
**Source:** n8n.io documentation + local examples

---

## Overview

N8N is a workflow automation platform. Workflows are defined as JSON with nodes, connections, and configurations.

---

## Workflow JSON Structure

```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": {...},
  "staticData": null,
  "pinData": {}
}
```

### Node Structure
```json
{
  "parameters": {...},
  "type": "@n8n/n8n-nodes-langchain.chatTrigger",
  "typeVersion": 1.1,
  "position": [x, y],
  "id": "uuid",
  "name": "Node Display Name",
  "credentials": {...}
}
```

### Connection Structure
```json
{
  "NodeName": {
    "main": [
      [
        {
          "node": "TargetNodeName",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

---

## Common Node Types

### Triggers
| Node | Type | Use Case |
|------|------|----------|
| Webhook | `n8n-nodes-base.webhook` | HTTP trigger |
| Chat Trigger | `@n8n/n8n-nodes-langchain.chatTrigger` | AI chat interface |
| Schedule | `n8n-nodes-base.scheduleTrigger` | Cron/interval |
| Manual | `n8n-nodes-base.manualTrigger` | Manual execution |

### AI/LangChain Nodes
| Node | Type | Use Case |
|------|------|----------|
| OpenAI | `@n8n/n8n-nodes-langchain.lmChatOpenAi` | GPT models |
| Anthropic | `@n8n/n8n-nodes-langchain.lmChatAnthropic` | Claude models |
| Agent | `@n8n/n8n-nodes-langchain.agent` | AI agent with tools |
| Memory | `@n8n/n8n-nodes-langchain.memoryBufferWindow` | Conversation memory |

### Data Nodes
| Node | Type | Use Case |
|------|------|----------|
| HTTP Request | `n8n-nodes-base.httpRequest` | API calls |
| Set | `n8n-nodes-base.set` | Set/transform data |
| Code | `n8n-nodes-base.code` | JavaScript/Python |
| If | `n8n-nodes-base.if` | Conditional branching |
| Switch | `n8n-nodes-base.switch` | Multi-way branching |
| Merge | `n8n-nodes-base.merge` | Combine data streams |
| Split In Batches | `n8n-nodes-base.splitInBatches` | Process items in batches |

### Integrations
| Node | Type | Use Case |
|------|------|----------|
| Airtable | `n8n-nodes-base.airtable` | Airtable CRUD |
| Google Sheets | `n8n-nodes-base.googleSheets` | Sheets operations |
| Slack | `n8n-nodes-base.slack` | Slack messaging |
| Discord | `n8n-nodes-base.discord` | Discord bots |
| Gmail | `n8n-nodes-base.gmail` | Email operations |

---

## Agent Patterns

### Basic AI Agent
```json
{
  "nodes": [
    {"type": "chatTrigger", "name": "Trigger"},
    {"type": "lmChatAnthropic", "name": "Claude"},
    {"type": "agent", "name": "AI Agent"}
  ],
  "connections": {
    "Trigger": {"main": [[{"node": "AI Agent"}]]},
    "Claude": {"ai_languageModel": [[{"node": "AI Agent"}]]}
  }
}
```

### Agent with Tools
```json
{
  "nodes": [
    {"type": "agent", "name": "Agent"},
    {"type": "toolHttpRequest", "name": "HTTP Tool"},
    {"type": "toolCode", "name": "Code Tool"}
  ],
  "connections": {
    "HTTP Tool": {"ai_tool": [[{"node": "Agent"}]]},
    "Code Tool": {"ai_tool": [[{"node": "Agent"}]]}
  }
}
```

### Agent with Memory
```json
{
  "nodes": [
    {"type": "agent", "name": "Agent"},
    {"type": "memoryBufferWindow", "name": "Memory"}
  ],
  "connections": {
    "Memory": {"ai_memory": [[{"node": "Agent"}]]}
  }
}
```

---

## Credential Types

| Service | Credential Type |
|---------|-----------------|
| Anthropic | `anthropicApi` |
| OpenAI | `openAiApi` |
| Airtable | `airtableApi` |
| Google | `googleSheetsOAuth2Api` |
| Slack | `slackOAuth2Api` |
| n8n API | `n8nApi` |

---

## Local Example Library

**Location:** `/root/n8n agents/`

### Available Examples
- `n8n_Developer_Agent 2.json` - Meta agent that creates workflows
- `Blog Generator.json` - Content generation pipeline
- `CRM_Magic.json` - CRM automation
- `Email AI Agent.json` - Email processing agent
- `Gmail Agent.json` - Gmail-specific operations
- `Airtable Agent.json` - Airtable automation
- `Document Agent.json` - Document processing

### AI Acrobatics Examples
**Location:** `/root/n8n/Ai acrobatics/Ai agents/`
- Social Media workflows
- Lead generation
- Client intelligence systems

---

## Best Practices

1. **Error Handling**: Use Error Trigger nodes
2. **Logging**: Add Set nodes to log key data points
3. **Batching**: Use Split In Batches for large datasets
4. **Memory**: Use window memory for conversations
5. **Credentials**: Never hardcode, use n8n credential system

---

## Common Patterns

### Error Handling Pattern
```
Main Flow → Try Node → Success Path
              ↓
         Error Trigger → Error Handler → Notification
```

### Retry Pattern
```
HTTP Request → If (success?) → Continue
                    ↓ (no)
              Wait → Retry Counter → HTTP Request (loop)
```

### Webhook → Process → Respond Pattern
```
Webhook → Validate → Process → Format Response → Respond to Webhook
```

---

## Documentation Links

- Main Docs: https://docs.n8n.io/
- Node Reference: https://docs.n8n.io/integrations/builtin/
- Workflow Examples: https://n8n.io/workflows/
- API Reference: https://docs.n8n.io/api/

---

## Update Log

| Date | Updates |
|------|---------|
| 2025-12-17 | Initial reference created |

*This guide is auto-updated by the N8N Agent*
