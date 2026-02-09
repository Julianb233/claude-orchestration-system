# Cloudflare AI Agents Integration SOP

## Overview

This SOP covers integration with Cloudflare's AI workforce including Workers AI, Cloudflare Agents SDK, and AI Gateway. These services enable serverless AI model execution, autonomous agents, and real-time communication.

**Official Documentation:**
- Agents SDK: https://developers.cloudflare.com/agents/
- Workers AI: https://developers.cloudflare.com/workers-ai/
- AI Gateway: https://developers.cloudflare.com/ai-gateway/

---

## Quick Start

### Create New Agent Project
```bash
npm create cloudflare@latest my-agent -- --template=cloudflare/agents-starter
cd my-agent
npx wrangler@latest deploy
```

### Add to Existing Project
```bash
npm i agents
```

---

## Core Concepts

### Agent Class (Server-Side)

Every Cloudflare agent extends the base `Agent` class:

```typescript
import { Agent, AgentNamespace } from "agents";

export class MyAgent extends Agent<Env, State> {
  // Initial state for this agent
  initialState = {
    messages: [],
    context: {},
    status: "idle"
  };

  // Called when agent starts or resumes
  async onStart() {
    console.log("Agent started with state:", this.state);
  }

  // Handle HTTP requests
  async onRequest(request: Request): Promise<Response> {
    return new Response("Agent is running");
  }

  // Handle WebSocket connections
  async onConnect(connection: Connection, ctx: ConnectionContext) {
    connection.accept();
    connection.send(JSON.stringify({ type: "connected" }));
  }

  // Handle incoming WebSocket messages
  async onMessage(connection: Connection, message: WSMessage) {
    const data = JSON.parse(message as string);
    // Process message...
    this.setState({ ...this.state, lastMessage: data });
  }

  // Handle state changes (from any source)
  onStateUpdate(state: State, source: "server" | Connection) {
    // React to state changes
  }
}
```

### wrangler.toml Configuration

```toml
name = "my-agent-worker"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[[durable_objects.bindings]]
name = "MyAgent"
class_name = "MyAgent"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyAgent"]
```

---

## State Management

### Reading State
```typescript
// Access current state
const currentState = this.state;

// Query SQL database (each agent has embedded SQLite)
const users = this.sql`SELECT * FROM users WHERE active = ${true}`;
```

### Updating State
```typescript
// Update state (auto-persists and notifies clients)
this.setState({
  ...this.state,
  status: "processing",
  lastUpdated: Date.now()
});
```

### Connection-Specific State
```typescript
// Each connection can have its own state
connection.setState({ userId: "user-123", role: "admin" });

// Read connection state
const connState = connection.state;
```

---

## Scheduling Tasks

### Schedule Methods
```typescript
// Run at specific time
await this.schedule(new Date("2025-01-15T09:00:00Z"), "dailyReport", { type: "summary" });

// Run in X seconds
await this.schedule(300, "checkStatus", { taskId: "abc123" });

// Cron schedule (every day at 8am)
await this.schedule("0 8 * * *", "morningDigest", {});
```

### Managing Schedules
```typescript
// Get specific schedule
const schedule = await this.getSchedule("schedule-id-123");

// List schedules
const allSchedules = this.getSchedules({ type: "cron" });

// Cancel schedule
await this.cancelSchedule("schedule-id-123");
```

---

## Client-Side Integration

### AgentClient (Vanilla JS)
```typescript
import { AgentClient } from "agents/client";

const client = new AgentClient({
  agent: "my-agent",
  name: "session-123",
  host: window.location.host
});

// Listen for state updates
client.addEventListener("state", (event) => {
  console.log("New state:", event.data);
});

// Send message
client.send(JSON.stringify({ type: "action", payload: { ... } }));
```

### React Hooks
```typescript
import { useAgent, useAgentChat } from "agents/react";

function ChatComponent() {
  const agent = useAgent({
    agent: "chat-agent",
    name: "user-session-123",
    onStateUpdate: (state, source) => {
      console.log("State updated:", state, "from:", source);
    }
  });

  const { messages, input, setInput, handleSubmit, isLoading } = useAgentChat({
    agent,
    initialMessages: [],
    resume: true // Resume interrupted streams
  });

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button type="submit" disabled={isLoading}>Send</button>
    </form>
  );
}
```

---

## AI Chat Agent

For chat-specific agents, extend `AIChatAgent`:

```typescript
import { AIChatAgent } from "agents/ai-chat-agent";

export class MyChatAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish: OnFinishCallback) {
    // Access conversation history
    const messages = this.messages;

    // Generate AI response
    const response = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    // Stream response back
    return response;
  }

  async saveMessages(messages: Message[]) {
    // Persist to SQL database
    this.sql`INSERT INTO conversations (messages) VALUES (${JSON.stringify(messages)})`;
  }
}
```

---

## Workers AI Integration

### Run AI Models
```typescript
export default {
  async fetch(request, env) {
    // Text generation
    const textResult = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [{ role: "user", content: "Hello!" }]
    });

    // Image classification
    const imageResult = await env.AI.run("@cf/microsoft/resnet-50", {
      image: await request.arrayBuffer()
    });

    // Embeddings
    const embeddings = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: ["Hello world", "How are you?"]
    });

    return Response.json({ text: textResult, embeddings });
  }
};
```

### Available Model Categories
- **Text Generation**: llama-2, mistral, phi-2
- **Text Classification**: bge-reranker
- **Embeddings**: bge-base, bge-large
- **Image Classification**: resnet-50
- **Object Detection**: yolov5
- **Speech Recognition**: whisper
- **Translation**: m2m100

---

## MCP (Model Context Protocol) Integration

Connect agents to external tool servers:

```typescript
// Add MCP server
const result = await this.addMcpServer(
  "my-tools",
  "https://tools.example.com/mcp",
  "https://my-agent.workers.dev/callback",
  "/agents"
);

// Returns auth URL if OAuth required
if (result.authUrl) {
  // Redirect user to authenticate
}

// List connected servers
const servers = this.getMcpServers();

// Remove server
await this.removeMcpServer(result.id);
```

---

## AI Gateway (Analytics & Control)

### Configure Gateway
```typescript
// Use AI Gateway for monitoring
const response = await fetch(
  `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_NAME}/workers-ai/@cf/meta/llama-2-7b-chat-int8`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Hello" }]
    })
  }
);
```

### Gateway Features
- **Analytics**: Request logging, latency tracking, error rates
- **Caching**: Cache identical requests to reduce costs
- **Rate Limiting**: Control request rates per user/key
- **Fallbacks**: Automatic failover to backup providers

---

## Integration with Julian's AI Workforce

### Agent Naming Convention
When creating Cloudflare agents that work with Claude agents:

| Claude Agent | Cloudflare Agent Name | Purpose |
|--------------|----------------------|---------|
| Tyler-TypeScript | `tyler-worker` | JS/TS execution |
| Petra-DevOps | `petra-deployer` | Deployment automation |
| Otto-Observer | `otto-monitor` | System monitoring |
| Diana-Debugger | `diana-analyzer` | Error analysis |

### Cross-Platform Communication

**From Claude to Cloudflare Agent:**
```typescript
// Use agentFetch from Claude agent
const response = await agentFetch({
  agent: "tyler-worker",
  name: "task-123"
}, {
  method: "POST",
  body: JSON.stringify({ task: "build", project: "my-app" })
});
```

**From Cloudflare to Claude (via webhook):**
```typescript
// In Cloudflare agent
await fetch("https://hooks.slack.com/services/...", {
  method: "POST",
  body: JSON.stringify({
    text: "Task completed by Cloudflare Agent",
    blocks: [/* Slack blocks */]
  })
});
```

### State Sync with Claude Flow Memory
```typescript
// Store state that Claude agents can access
await env.KV.put(`agent-state:${agentName}`, JSON.stringify({
  status: "running",
  progress: 75,
  lastUpdate: Date.now()
}));
```

---

## Deployment

### Deploy Worker
```bash
npx wrangler deploy
```

### Environment Variables
```bash
# Set secrets
npx wrangler secret put API_KEY
npx wrangler secret put DATABASE_URL
```

### View Logs
```bash
npx wrangler tail
```

---

## Example: Full Agent Implementation

```typescript
// src/index.ts
import { Agent, AgentNamespace } from "agents";

interface Env {
  AI: Ai;
  KV: KVNamespace;
  MyAgent: AgentNamespace<MyAgent>;
}

interface State {
  tasks: Array<{ id: string; status: string; result?: any }>;
  context: Record<string, any>;
}

export class MyAgent extends Agent<Env, State> {
  initialState: State = {
    tasks: [],
    context: {}
  };

  async onStart() {
    // Check for pending tasks on startup
    const pending = this.state.tasks.filter(t => t.status === "pending");
    for (const task of pending) {
      await this.processTask(task.id);
    }
  }

  async onMessage(connection: Connection, message: WSMessage) {
    const { type, payload } = JSON.parse(message as string);

    switch (type) {
      case "submit_task":
        const taskId = crypto.randomUUID();
        this.setState({
          ...this.state,
          tasks: [...this.state.tasks, { id: taskId, status: "pending" }]
        });
        await this.processTask(taskId);
        break;

      case "get_status":
        connection.send(JSON.stringify({
          type: "status",
          tasks: this.state.tasks
        }));
        break;
    }
  }

  async processTask(taskId: string) {
    // Update status
    this.updateTaskStatus(taskId, "processing");

    try {
      // Run AI model
      const result = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
        messages: [{ role: "user", content: "Process this task" }]
      });

      this.updateTaskStatus(taskId, "completed", result);
    } catch (error) {
      this.updateTaskStatus(taskId, "failed", { error: error.message });
    }
  }

  updateTaskStatus(taskId: string, status: string, result?: any) {
    this.setState({
      ...this.state,
      tasks: this.state.tasks.map(t =>
        t.id === taskId ? { ...t, status, result } : t
      )
    });
  }
}

export default {
  fetch: MyAgent.mount("/agent")
};
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Agent not found" | Check wrangler.toml durable_objects config |
| WebSocket disconnect | Implement reconnection in client |
| State not persisting | Ensure migrations tag is set |
| AI model timeout | Use streaming responses for long tasks |

### Debug Mode
```typescript
// Enable verbose logging
export class MyAgent extends Agent {
  async onMessage(connection: Connection, message: WSMessage) {
    console.log("[DEBUG] Received:", message);
    // ...
  }
}
```

---

## Resources

- [Cloudflare Agents Starter](https://github.com/cloudflare/agents-starter)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
- [AI Gateway Docs](https://developers.cloudflare.com/ai-gateway/)
- [Durable Objects](https://developers.cloudflare.com/durable-objects/)

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-18 | 1.0 | Initial SOP created |
