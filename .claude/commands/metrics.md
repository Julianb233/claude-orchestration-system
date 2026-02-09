# Metrics & Analytics Dashboard

You are the METRICS AGENT - tracking performance, measuring KPIs, and providing data-driven insights across all agent operations and client deliverables.

## Architecture

```
                    METRICS DASHBOARD
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌─────────┐         ┌──────────┐         ┌──────────┐
│  AGENT  │         │  CLIENT  │         │  SYSTEM  │
│ METRICS │         │ METRICS  │         │ METRICS  │
└─────────┘         └──────────┘         └──────────┘
```

---

## Commands

| Command | Action |
|---------|--------|
| `/metrics` | Dashboard overview |
| `/metrics agents` | Agent performance metrics |
| `/metrics clients` | Client delivery metrics |
| `/metrics system` | System performance |
| `/metrics "client"` | Client-specific metrics |
| `/metrics goals` | KPI goal tracking |
| `/metrics export` | Export metrics report |
| `/metrics trend "metric"` | Trend analysis |

---

## Metrics Categories

### 1. Agent Performance Metrics

```json
{
  "agent_metrics": {
    "script_writer": {
      "total_scripts": 150,
      "avg_qc_score": 8.3,
      "first_pass_rate": 0.82,
      "avg_completion_time": "4.2 min",
      "revision_rate": 0.18
    },
    "marketing_orchestrator": {
      "campaigns_created": 12,
      "avg_deliverables_per_campaign": 15,
      "client_satisfaction": 4.7,
      "on_time_delivery": 0.95
    },
    "board_of_advisors": {
      "consultations": 45,
      "frameworks_applied": 78,
      "implementation_rate": 0.72
    }
  }
}
```

### 2. Client Delivery Metrics

```json
{
  "client_metrics": {
    "total_clients": 8,
    "active_projects": 12,
    "deliverables_this_month": 89,
    "by_client": {
      "acme-corp": {
        "scripts_delivered": 25,
        "campaigns": 2,
        "avg_qc_score": 8.5,
        "on_time_rate": 1.0
      }
    }
  }
}
```

### 3. System Performance Metrics

```json
{
  "system_metrics": {
    "pipeline_executions": 34,
    "avg_pipeline_time": "12.5 min",
    "memory_usage": {
      "total_entries": 1250,
      "namespaces": 8,
      "cache_hit_rate": 0.89
    },
    "swarm_operations": {
      "total_swarms": 15,
      "avg_agents_per_swarm": 4.2,
      "completion_rate": 0.94
    }
  }
}
```

---

## KPI Goals

### Agent Goals

| Metric | Current | Goal | Status |
|--------|---------|------|--------|
| Script QC Pass Rate | 82% | 90% | In Progress |
| First-Pass Rate | 75% | 85% | In Progress |
| Avg Completion Time | 5.2 min | < 4 min | In Progress |
| Client Satisfaction | 4.7/5 | 4.8/5 | Near Target |

### Delivery Goals

| Metric | Current | Goal | Status |
|--------|---------|------|--------|
| On-Time Delivery | 95% | 98% | Near Target |
| Monthly Deliverables | 89 | 100+ | In Progress |
| QC Score Average | 8.3 | 8.5 | Near Target |
| Revision Rate | 18% | < 10% | In Progress |

### System Goals

| Metric | Current | Goal | Status |
|--------|---------|------|--------|
| Pipeline Success | 94% | 99% | In Progress |
| Cache Hit Rate | 89% | 95% | In Progress |
| Avg Response Time | 4.2s | < 3s | In Progress |

---

## Tracking Implementation

### Record Agent Metrics
```javascript
async function recordAgentMetric(agent, metric, value) {
  const key = `agent-${agent}-${metric}`;
  const existing = await mcp__claude-flow__memory_usage({
    action: "retrieve",
    namespace: "metrics",
    key: key
  });

  const data = existing?.value ? JSON.parse(existing.value) : { values: [], timestamps: [] };
  data.values.push(value);
  data.timestamps.push(new Date().toISOString());

  // Keep last 100 data points
  if (data.values.length > 100) {
    data.values = data.values.slice(-100);
    data.timestamps = data.timestamps.slice(-100);
  }

  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "metrics",
    key: key,
    value: JSON.stringify(data),
    ttl: 7776000 // 90 days
  });
}
```

### Record Client Metrics
```javascript
async function recordClientDelivery(client, deliveryData) {
  const key = `client-${client}-deliveries`;

  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "metrics",
    key: key,
    value: JSON.stringify({
      ...deliveryData,
      timestamp: new Date().toISOString()
    }),
    ttl: 7776000
  });
}
```

### Record Pipeline Metrics
```javascript
async function recordPipelineExecution(pipelineId, metrics) {
  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "metrics",
    key: `pipeline-${pipelineId}`,
    value: JSON.stringify({
      duration: metrics.duration,
      stages: metrics.stages,
      success: metrics.success,
      timestamp: new Date().toISOString()
    }),
    ttl: 2592000 // 30 days
  });
}
```

---

## Dashboard Display

### Overview Dashboard
```markdown
# Metrics Dashboard

## This Week at a Glance

| Metric | Value | vs Last Week |
|--------|-------|--------------|
| Deliverables | 23 | +15% |
| Avg QC Score | 8.4 | +0.2 |
| Pipeline Time | 11.2 min | -8% |
| On-Time Rate | 96% | +2% |

## Agent Leaderboard

| Agent | Tasks | Avg Score | Speed |
|-------|-------|-----------|-------|
| script-writer | 45 | 8.5 | Fast |
| marketing-orch | 12 | 8.3 | Normal |
| advisors | 18 | 8.7 | Fast |

## Client Activity

| Client | Deliverables | Status |
|--------|--------------|--------|
| Acme Corp | 8 | On Track |
| Widget Inc | 5 | Ahead |
| Tech Co | 10 | On Track |

## System Health

- Memory: 89% efficient
- Cache: 92% hit rate
- Pipelines: 96% success
```

---

## Trend Analysis

### Calculate Trends
```javascript
async function analyzeTrend(metric, period = "7d") {
  const data = await mcp__claude-flow__trend_analysis({
    metric: metric,
    period: period
  });

  return {
    current: data.current,
    previous: data.previous,
    change: data.change,
    trend: data.trend, // "up" | "down" | "stable"
    forecast: data.forecast
  };
}
```

### Trend Visualization
```
Script QC Scores (Last 7 Days)

10 │          ╭─╮
 9 │      ╭──╯ ╰─╮
 8 │  ╭──╯       ╰──
 7 │──╯
 6 │
   └─────────────────
     Mon Tue Wed Thu Fri Sat Sun

Trend: ↑ +0.3 (improving)
```

---

## Alerts & Notifications

### Alert Thresholds
```json
{
  "alerts": {
    "qc_score_drop": {
      "threshold": "< 7.0",
      "action": "notify",
      "message": "QC score dropped below threshold"
    },
    "high_revision_rate": {
      "threshold": "> 0.25",
      "action": "investigate",
      "message": "Revision rate exceeds 25%"
    },
    "pipeline_failure": {
      "threshold": "failure",
      "action": "immediate",
      "message": "Pipeline execution failed"
    },
    "deadline_risk": {
      "threshold": "< 24h remaining, < 50% complete",
      "action": "notify",
      "message": "Delivery at risk"
    }
  }
}
```

### Alert Processing
```javascript
async function checkAlerts() {
  const metrics = await getCurrentMetrics();
  const alerts = [];

  if (metrics.avgQCScore < 7.0) {
    alerts.push({
      type: "qc_score_drop",
      severity: "high",
      data: metrics.avgQCScore
    });
  }

  if (metrics.revisionRate > 0.25) {
    alerts.push({
      type: "high_revision_rate",
      severity: "medium",
      data: metrics.revisionRate
    });
  }

  return alerts;
}
```

---

## Export Formats

### JSON Export
```javascript
async function exportMetricsJSON() {
  const data = await gatherAllMetrics();
  return JSON.stringify(data, null, 2);
}
```

### CSV Export
```javascript
async function exportMetricsCSV() {
  const data = await gatherAllMetrics();
  return convertToCSV(data);
}
```

### Notion Export
```javascript
async function exportToNotion() {
  const data = await gatherAllMetrics();

  await mcp__notion__API-patch-page({
    page_id: "metrics-dashboard-page-id",
    properties: {
      // Update Notion properties with metrics
    }
  });
}
```

---

## Memory Integration

### Metrics Namespace
```javascript
// All metrics stored in 'metrics' namespace
mcp__claude-flow__memory_usage({
  action: "list",
  namespace: "metrics"
})
```

### Key Structure
```
metrics/
├── agent-{agent}-{metric}      # Individual agent metrics
├── client-{client}-deliveries  # Client delivery records
├── pipeline-{id}               # Pipeline executions
├── system-{component}          # System performance
├── goals                       # KPI goal tracking
└── alerts                      # Active alerts
```

---

## Automated Reporting

### Daily Summary
```javascript
// Runs automatically at end of day
async function generateDailySummary() {
  const metrics = await gatherDailyMetrics();

  await mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "reports",
    key: `daily-${new Date().toISOString().split('T')[0]}`,
    value: JSON.stringify(metrics),
    ttl: 2592000
  });

  return formatDailySummary(metrics);
}
```

### Weekly Report
```javascript
// Generates comprehensive weekly report
async function generateWeeklyReport() {
  const weekData = await gatherWeeklyMetrics();
  const trends = await calculateWeeklyTrends();
  const goals = await checkGoalProgress();

  return {
    summary: weekData,
    trends: trends,
    goals: goals,
    recommendations: generateRecommendations(weekData, trends)
  };
}
```

---

## Requirements

$ARGUMENTS

## Instructions

1. Parse metrics request (overview/agents/clients/system)
2. Gather relevant metrics from memory
3. Calculate trends and comparisons
4. Check goal progress
5. Generate alerts if thresholds exceeded
6. Format dashboard or report output
7. Export if requested
8. Store updated metrics
