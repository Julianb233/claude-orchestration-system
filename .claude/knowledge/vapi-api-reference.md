# VAPI API Quick Reference

## Base URL
`https://api.vapi.ai`

## Authentication
Header: `Authorization: Bearer {VAPI_API_KEY}`

---

## Phone Calls

### Create Outbound Call
```
POST /call
{
  "phoneNumberId": "pn_xxx",
  "assistantId": "asst_xxx",
  "customer": {
    "number": "+14155551234",
    "name": "John Doe"
  },
  "type": "outboundPhoneCall"
}
```

### Get Call Status
```
GET /call/{callId}
```

### List Calls
```
GET /call?limit=100
```

### End Call
```
POST /call/{callId}/end
```

---

## Assistants

### Create Assistant
```
POST /assistant
{
  "name": "Sales Agent",
  "voice": {
    "provider": "playht",
    "voiceId": "jennifer"
  },
  "model": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant..." }
    ]
  },
  "firstMessage": "Hello, how can I help you today?",
  "firstMessageMode": "assistant-speaks-first"
}
```

### Get Assistant
```
GET /assistant/{assistantId}
```

### Update Assistant
```
PATCH /assistant/{assistantId}
```

### Delete Assistant
```
DELETE /assistant/{assistantId}
```

---

## Phone Numbers

### List Phone Numbers
```
GET /phone-number
```

### Get Phone Number
```
GET /phone-number/{phoneNumberId}
```

---

## Voice Providers

| Provider | Voices | Notes |
|----------|--------|-------|
| `playht` | jennifer, will, michael | Natural sounding |
| `elevenlabs` | Custom IDs | High quality |
| `deepgram` | aura-asteria-en | Fast |
| `openai` | alloy, echo, fable | Standard |

---

## Model Providers

| Provider | Models |
|----------|--------|
| `openai` | gpt-4o, gpt-4o-mini, gpt-3.5-turbo |
| `anthropic` | claude-3-sonnet, claude-3-haiku |

---

## Call Body (Full Example)

```json
{
  "phoneNumberId": "pn_xxx",
  "customer": {
    "number": "+14155551234",
    "name": "Customer Name"
  },
  "type": "outboundPhoneCall",
  "assistant": {
    "name": "AI Agent",
    "voice": {
      "provider": "playht",
      "voiceId": "jennifer"
    },
    "model": {
      "provider": "openai",
      "model": "gpt-4o-mini",
      "messages": [
        {
          "role": "system",
          "content": "You are calling to follow up on..."
        }
      ],
      "temperature": 0.7
    },
    "firstMessage": "Hi, this is...",
    "firstMessageMode": "assistant-speaks-first",
    "backgroundSound": "office",
    "serverMessages": ["end-of-call-report"],
    "endCallFunctionEnabled": true,
    "endCallMessage": "Thank you for your time. Goodbye!"
  },
  "serverUrl": "https://your-webhook.com/vapi-events"
}
```

---

## Webhook Events (serverUrl)

VAPI sends events to your webhook:

| Event | Description |
|-------|-------------|
| `assistant-request` | Call started, request assistant config |
| `status-update` | Call status changed |
| `end-of-call-report` | Call ended, get transcript |
| `transcript` | Real-time transcript update |
| `function-call` | AI wants to call a function |

---

## N8n Integration Pattern

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.vapi.ai/call",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ phoneNumberId: 'pn_xxx', assistantId: 'asst_xxx', customer: { number: $json.phone } }) }}"
  }
}
```

---

## Common Use Cases

1. **Outbound Sales Call**: Create call with sales prompt
2. **Appointment Reminder**: Schedule call with reminder message
3. **Survey Call**: Use structured questions in system prompt
4. **Support Follow-up**: Call after ticket resolution
