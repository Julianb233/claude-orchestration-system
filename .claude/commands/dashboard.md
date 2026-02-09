# Central Command Dashboard

You are the DASHBOARD CONTROLLER - managing the central command view that aggregates all agent activity, client status, and system metrics.

## Architecture

```
              CENTRAL COMMAND DASHBOARD
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────┐      ┌──────────┐      ┌──────────┐
│  AGENT  │      │  CLIENT  │      │  SYSTEM  │
│ STATUS  │      │ OVERVIEW │      │  HEALTH  │
└─────────┘      └──────────┘      └──────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────┐      ┌──────────┐      ┌──────────┐
│ CONTENT │      │  METRICS │      │  ALERTS  │
│ CALENDAR│      │ SUMMARY  │      │   LOG    │
└─────────┘      └──────────┘      └──────────┘
```

---

## Commands

| Command | Action |
|---------|--------|
| `/dashboard` or `/d` | Show full dashboard |
| `/dashboard agents` | Agent activity overview |
| `/dashboard clients` | Client status view |
| `/dashboard calendar` | Content calendar view |
| `/dashboard alerts` | Active alerts |
| `/dashboard metrics` | Metrics summary |
| `/dashboard setup` | Configure Notion dashboard |
| `/dashboard refresh` | Force refresh all data |

---

## Dashboard Views

### Main Dashboard View
```
╔══════════════════════════════════════════════════════════════════╗
║                    AI ACROBATICS COMMAND CENTER                   ║
║                         Dec 17, 2025                              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  AGENTS                          QUICK ACTIONS                    ║
║  ───────                         ─────────────                    ║
║  ✓ Pipeline Orchestrator         [1] /pipeline content            ║
║  ✓ Script Writer                 [2] /client list                 ║
║  ✓ Marketing Orchestrator        [3] /schedule                    ║
║  ✓ Board of Advisors             [4] /metrics                     ║
║  ✓ QC Agent                      [5] /templates                   ║
║  ✓ Client Manager                                                 ║
║  ✓ Scheduler                                                      ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  TODAY'S SCHEDULE                ACTIVE CLIENTS                   ║
║  ────────────────                ──────────────                   ║
║  09:00 Acme Corp - LinkedIn      Acme Corp      3 active          ║
║  11:00 Widget Inc - YouTube      Widget Inc     2 active          ║
║  14:00 Tech Co - IG Reels        Tech Co        1 active          ║
║                                                                   ║
║  3 items due today               8 total clients                  ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  METRICS SNAPSHOT                ALERTS                           ║
║  ────────────────                ──────                           ║
║  Deliverables MTD: 89/100        ⚠ 1 deadline approaching         ║
║  Avg QC Score: 8.3               ⚠ QC score dip on project X      ║
║  On-Time Rate: 95%                                                ║
║  Pipeline Success: 94%           2 alerts active                  ║
║                                                                   ║
╚══════════════════════════════════════════════════════════════════╝
```

### Agent Status View
```
╔══════════════════════════════════════════════════════════════════╗
║                        AGENT STATUS                               ║
╠═══════════════════╦═══════════╦═══════════╦═══════════╦══════════╣
║ Agent             ║ Status    ║ Tasks/Day ║ Avg Score ║ Trend    ║
╠═══════════════════╬═══════════╬═══════════╬═══════════╬══════════╣
║ Script Writer     ║ Active    ║ 12        ║ 8.5       ║ ↑ +0.2   ║
║ Marketing Orch    ║ Active    ║ 3         ║ 8.3       ║ → stable ║
║ Board of Advisors ║ Active    ║ 5         ║ 8.7       ║ ↑ +0.1   ║
║ QC Agent          ║ Active    ║ 15        ║ 9.0       ║ → stable ║
║ Client Manager    ║ Active    ║ 8         ║ -         ║ -        ║
║ Pipeline Orch     ║ Active    ║ 6         ║ -         ║ -        ║
║ Scheduler         ║ Active    ║ 20        ║ -         ║ -        ║
╚═══════════════════╩═══════════╩═══════════╩═══════════╩══════════╝
```

### Client Overview
```
╔══════════════════════════════════════════════════════════════════╗
║                      CLIENT OVERVIEW                              ║
╠═══════════════════╦═══════════╦═══════════╦═══════════╦══════════╣
║ Client            ║ Projects  ║ Due Today ║ QC Avg    ║ Status   ║
╠═══════════════════╬═══════════╬═══════════╬═══════════╬══════════╣
║ Acme Corp         ║ 3 active  ║ 2 items   ║ 8.5       ║ On Track ║
║ Widget Inc        ║ 2 active  ║ 1 item    ║ 8.2       ║ On Track ║
║ Tech Co           ║ 1 active  ║ 0 items   ║ 8.8       ║ Ahead    ║
║ Startup XYZ       ║ 2 active  ║ 1 item    ║ 7.9       ║ At Risk  ║
╚═══════════════════╩═══════════╩═══════════╩═══════════╩══════════╝
```

---

## Notion Dashboard Setup

### Required Databases

1. **Agent Activity Log**
   ```json
   {
     "database": "agent-activity",
     "properties": {
       "Agent": "select",
       "Action": "title",
       "Client": "select",
       "Status": "select",
       "Score": "number",
       "Duration": "number",
       "Timestamp": "date"
     }
   }
   ```

2. **Client Dashboard**
   ```json
   {
     "database": "client-dashboard",
     "properties": {
       "Name": "title",
       "Status": "select",
       "Active Projects": "number",
       "Due Today": "number",
       "Avg QC Score": "number",
       "Last Updated": "date"
     }
   }
   ```

3. **Content Calendar**
   ```json
   {
     "database": "content-calendar",
     "properties": {
       "Title": "title",
       "Client": "select",
       "Platform": "multi_select",
       "Due Date": "date",
       "Status": "select",
       "QC Score": "number",
       "Assigned Agent": "select"
     }
   }
   ```

4. **Metrics Dashboard**
   ```json
   {
     "database": "metrics-dashboard",
     "properties": {
       "Metric": "title",
       "Value": "number",
       "Target": "number",
       "Status": "select",
       "Period": "select",
       "Updated": "date"
     }
   }
   ```

5. **Alert Log**
   ```json
   {
     "database": "alert-log",
     "properties": {
       "Alert": "title",
       "Severity": "select",
       "Status": "select",
       "Created": "date",
       "Resolved": "date",
       "Resolution": "rich_text"
     }
   }
   ```

### Setup Instructions

```javascript
async function setupNotionDashboard() {
  // 1. Get or create parent page
  const parentPage = await findOrCreatePage("AI Acrobatics Command Center");

  // 2. Create each database
  const databases = [
    createAgentActivityDB(parentPage.id),
    createClientDashboardDB(parentPage.id),
    createContentCalendarDB(parentPage.id),
    createMetricsDashboardDB(parentPage.id),
    createAlertLogDB(parentPage.id)
  ];

  await Promise.all(databases);

  // 3. Store database IDs in memory
  mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "config",
    key: "notion-dashboard-ids",
    value: JSON.stringify(databaseIds),
    ttl: 0 // permanent
  });

  return { success: true, databases: databaseIds };
}
```

---

## Data Sync

### Sync Agent Activity
```javascript
async function syncAgentActivity(agentId, activity) {
  const dbId = await getNotionDatabaseId("agent-activity");

  await mcp__notion__API-post-page({
    parent: { database_id: dbId },
    properties: {
      Agent: { select: { name: agentId } },
      Action: { title: [{ text: { content: activity.action } }] },
      Client: { select: { name: activity.client || "N/A" } },
      Status: { select: { name: activity.status } },
      Score: { number: activity.score || null },
      Duration: { number: activity.duration_ms },
      Timestamp: { date: { start: new Date().toISOString() } }
    }
  });
}
```

### Sync Client Status
```javascript
async function syncClientStatus(clientId) {
  const client = await loadClient(clientId);
  const projects = await getActiveProjects(clientId);
  const dueToday = await getContentDue(clientId, "today");
  const avgScore = await getAvgQCScore(clientId);

  const dbId = await getNotionDatabaseId("client-dashboard");

  // Find existing entry or create new
  const existing = await findClientEntry(dbId, clientId);

  if (existing) {
    await mcp__notion__API-patch-page({
      page_id: existing.id,
      properties: {
        "Active Projects": { number: projects.length },
        "Due Today": { number: dueToday.length },
        "Avg QC Score": { number: avgScore },
        "Last Updated": { date: { start: new Date().toISOString() } }
      }
    });
  } else {
    await createClientEntry(dbId, client);
  }
}
```

### Sync Metrics
```javascript
async function syncMetrics() {
  const metrics = await gatherAllMetrics();
  const dbId = await getNotionDatabaseId("metrics-dashboard");

  for (const [name, data] of Object.entries(metrics)) {
    await updateMetricEntry(dbId, name, data);
  }
}
```

---

## Auto-Refresh

### Scheduled Syncs
```javascript
// These run via the scheduler
const dashboardJobs = [
  {
    name: "sync-agent-activity",
    schedule: "*/15 * * * *", // Every 15 minutes
    action: syncAgentActivity
  },
  {
    name: "sync-client-status",
    schedule: "0 * * * *", // Every hour
    action: syncAllClientStatus
  },
  {
    name: "sync-metrics",
    schedule: "0 */6 * * *", // Every 6 hours
    action: syncMetrics
  },
  {
    name: "sync-calendar",
    schedule: "0 8 * * *", // Daily at 8 AM
    action: syncContentCalendar
  }
];
```

### Real-Time Updates
```javascript
// Trigger sync after significant events
async function onAgentComplete(agentId, result) {
  await syncAgentActivity(agentId, result);
  await updateDashboardSummary();
}

async function onDeliverableComplete(clientId, deliverable) {
  await syncClientStatus(clientId);
  await recordMetric("deliverable_complete", deliverable);
}
```

---

## Memory Integration

### Dashboard State
```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "dashboard",
  key: "current-state",
  value: JSON.stringify({
    last_refresh: new Date().toISOString(),
    agents_active: 7,
    clients_active: 8,
    alerts_active: 2,
    metrics_snapshot: {...}
  }),
  ttl: 3600
})
```

### Quick Access
```javascript
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "dashboard",
  key: "current-state"
})
```

---

## Alerts Integration

### Display Active Alerts
```javascript
async function getActiveAlerts() {
  return await mcp__claude-flow__memory_search({
    pattern: "alert-*-active",
    namespace: "alerts"
  });
}
```

### Alert Severity Colors

| Severity | Color | Action |
|----------|-------|--------|
| Critical | Red | Immediate attention |
| High | Orange | Address soon |
| Medium | Yellow | Review when possible |
| Low | Blue | Informational |

---

## Quick Actions

From the dashboard, execute common commands:

| Key | Action |
|-----|--------|
| `1` | `/pipeline content` |
| `2` | `/client list` |
| `3` | `/schedule` |
| `4` | `/metrics` |
| `5` | `/templates` |
| `a` | View all alerts |
| `r` | Refresh dashboard |
| `s` | Sync to Notion |

---

## Requirements

$ARGUMENTS

## Instructions

1. Parse dashboard command (main/agents/clients/calendar/alerts/metrics/setup)
2. Gather relevant data from memory and agents
3. For main view: display comprehensive dashboard
4. For specific views: show detailed section
5. For setup: configure Notion databases
6. For refresh: force sync all data
7. Display active alerts prominently
8. Provide quick action shortcuts
