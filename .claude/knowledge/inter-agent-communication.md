# Inter-Agent Communication Protocol

Version: 1.0
Created: 2025-12-17

## Overview

This protocol defines how agents communicate, coordinate, and share information within the Claude Flow ecosystem.

## Communication Channels

### 1. Memory-Based Communication (Primary)

Agents communicate through Claude Flow memory namespaces:

```javascript
// Send message to specific agent
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "messages",
  key: "msg_{from}_{to}_{timestamp}",
  value: {
    from: "agent-coder-1",
    to: "agent-reviewer-1",
    type: "task_handoff",
    payload: { files: [...], context: "..." },
    priority: "high",
    timestamp: "2025-12-17T00:00:00Z"
  },
  ttl: 3600
})

// Check for incoming messages
mcp__claude-flow__memory_search({
  pattern: "msg_*_agent-reviewer-1_*",
  namespace: "messages"
})
```

### 2. Message Types

| Type | Purpose | Priority |
|------|---------|----------|
| `task_handoff` | Transfer task to another agent | high |
| `status_update` | Report progress | medium |
| `request_help` | Ask for assistance | high |
| `share_findings` | Share discovered information | medium |
| `error_alert` | Report failure | critical |
| `completion` | Task finished | high |
| `coordination` | Swarm-level coordination | critical |

### 3. Message Format

```json
{
  "id": "msg_unique_id",
  "from": "agent_id",
  "to": "agent_id|broadcast|swarm_id",
  "type": "message_type",
  "priority": "low|medium|high|critical",
  "payload": {
    "action": "specific_action",
    "data": {},
    "context": "relevant_context",
    "requires_response": true
  },
  "metadata": {
    "timestamp": "ISO_timestamp",
    "ttl": 3600,
    "retry_count": 0,
    "correlation_id": "related_message_id"
  }
}
```

## Coordination Patterns

### Pattern 1: Task Handoff

```
Agent A                Memory                Agent B
   |                     |                     |
   |-- store handoff --> |                     |
   |                     | <-- search/poll --- |
   |                     | --- return msg ---> |
   |                     |                     |
   | <---------------- ack ------------------- |
```

### Pattern 2: Broadcast

```javascript
// Coordinator broadcasts to all workers
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "messages",
  key: "broadcast_{swarm_id}_{timestamp}",
  value: {
    from: "coordinator",
    to: "broadcast",
    type: "coordination",
    payload: { instruction: "pause_all" }
  }
})
```

### Pattern 3: Request-Response

```javascript
// Agent A sends request
const requestId = `req_${timestamp}`;
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "messages",
  key: requestId,
  value: {
    type: "request_help",
    from: "agent-a",
    to: "agent-b",
    payload: { question: "How to handle X?" },
    requires_response: true
  }
})

// Agent B responds
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "messages",
  key: `${requestId}_response`,
  value: {
    type: "response",
    from: "agent-b",
    to: "agent-a",
    correlation_id: requestId,
    payload: { answer: "Handle it by..." }
  }
})
```

## Error Escalation

### Escalation Chain

```
Worker Agent → Team Lead Agent → Coordinator → Human
     ↓              ↓                ↓
   retry        reassign         alert
```

### Error Handling Protocol

1. **Retry** (3 attempts with exponential backoff)
2. **Escalate** to supervisor agent
3. **Alert** via memory broadcast
4. **Graceful degradation** - continue with partial results

```javascript
// Error escalation message
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "alerts",
  key: "error_{agent}_{timestamp}",
  value: {
    type: "error_alert",
    severity: "high",
    agent: "agent-id",
    error: "Error description",
    context: { task: "...", attempt: 3 },
    requires_intervention: true
  }
})
```

## Resource Coordination

### File Locking

Prevent conflicts when multiple agents work on same files:

```javascript
// Acquire lock
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "locks",
  key: "file_{filepath_hash}",
  value: {
    agent: "agent-id",
    file: "/path/to/file",
    acquired: "timestamp",
    expires: "timestamp + 5min"
  },
  ttl: 300
})

// Release lock
mcp__claude-flow__memory_usage({
  action: "delete",
  namespace: "locks",
  key: "file_{filepath_hash}"
})
```

### Task Claiming

```javascript
// Claim a task from queue
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "tasks",
  key: "task_{id}_claimed",
  value: {
    task_id: "task-123",
    claimed_by: "agent-id",
    claimed_at: "timestamp"
  }
})
```

## Swarm Synchronization

### Barrier Synchronization

Wait for all agents to reach a point before proceeding:

```javascript
// Agent signals ready
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "sync",
  key: "barrier_{phase}_{agent_id}",
  value: { ready: true, timestamp: "..." }
})

// Coordinator checks all ready
const ready = await mcp__claude-flow__memory_search({
  pattern: "barrier_{phase}_*",
  namespace: "sync"
})
// Proceed when ready.count === total_agents
```

### Progress Tracking

```javascript
// Update progress
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "progress",
  key: "agent_{id}_progress",
  value: {
    agent: "agent-id",
    task: "current task",
    progress: 75,
    eta: "estimated completion",
    last_update: "timestamp"
  }
})
```

## Best Practices

1. **Use TTLs** - Always set TTL on messages to prevent memory bloat
2. **Correlation IDs** - Link related messages for traceability
3. **Idempotency** - Design messages to be safely retried
4. **Heartbeats** - Agents should periodically signal they're alive
5. **Graceful shutdown** - Notify others before terminating
6. **Priority handling** - Process critical messages first
7. **Deduplication** - Check for duplicate messages before processing

## Implementation in Agents

Agents should implement these methods:

```python
class AgentCommunication:
    def send_message(self, to, type, payload):
        """Send message to another agent"""

    def receive_messages(self):
        """Poll for incoming messages"""

    def broadcast(self, type, payload):
        """Send to all agents in swarm"""

    def acknowledge(self, message_id):
        """Confirm message receipt"""

    def escalate_error(self, error, context):
        """Escalate error to supervisor"""
```

## Monitoring

Track communication health:

```javascript
mcp__claude-flow__memory_analytics({
  timeframe: "1h"
})
```

Metrics to monitor:
- Message throughput
- Average response time
- Error rate
- Queue depth
- Lock contention
