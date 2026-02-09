# AI Automation Platform Architecture

## Overview

Full-stack automation platform for:
- Lead generation & enrichment
- Multi-channel outreach (Phone, Email, SMS)
- Call center operations with dashboard
- CRM integration (GoHighLevel)
- Automated follow-up sequences
- Analytics & reporting

**Sellable as white-label template to clients.**

---

## System Components

### 1. Lead Generation Engine

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Data Sources  │────▶│   Enrichment    │────▶│    Database     │
│ Yelp, Google,   │     │ Clearbit, Hunter│     │ Leads + Scores  │
│ Scraping, CSV   │     │ FullContact     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**APIs:**
- Yelp Fusion API - Local business data
- Google Places API - Business info
- Bright Data/ScrapingBee - Web scraping
- Hunter.io - Email finder
- Clearbit - Company enrichment
- FullContact - Person enrichment

### 2. Outreach Engine

```
┌─────────────────┐
│  Lead Database  │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Router  │
    └────┬────┘
         │
    ┌────┴────┬───────────┐
    ▼         ▼           ▼
┌───────┐ ┌───────┐ ┌──────────┐
│ Email │ │  SMS  │ │  Phone   │
│Mailgun│ │Twilio │ │  VAPI    │
└───────┘ └───────┘ └──────────┘
```

**Channels:**
- VAPI - AI phone calls
- Twilio - SMS/Voice
- Mailgun/SendGrid - Email
- GoHighLevel - CRM + Campaigns

### 3. Call Center Dashboard

```
┌────────────────────────────────────────────────┐
│              CALL CENTER DASHBOARD             │
├──────────────┬──────────────┬─────────────────┤
│   Metrics    │   Active     │    Queues       │
│   Overview   │   Calls      │    Status       │
├──────────────┴──────────────┴─────────────────┤
│              Call History + Recordings         │
├───────────────────────────────────────────────┤
│              Agent Performance                 │
└───────────────────────────────────────────────┘
```

**Features:**
- Real-time call monitoring
- Call recordings & transcripts
- Agent performance metrics
- Queue management
- SLA tracking

### 4. Follow-up Automation

```
Cron Scheduler
     │
     ├──▶ Check pending follow-ups
     │
     ├──▶ Evaluate lead status
     │
     ├──▶ Select channel (email/SMS/call)
     │
     └──▶ Execute & log
```

**Rules Engine:**
- Time-based triggers
- Event-based triggers
- Lead score thresholds
- Engagement signals

---

## Data Flow

```
1. ACQUISITION
   Yelp/Google → Scraper → Raw Leads DB

2. ENRICHMENT
   Raw Leads → Enrichment APIs → Enriched Leads DB

3. SCORING
   Enriched Leads → AI Scoring → Qualified Leads

4. OUTREACH
   Qualified Leads → Channel Router → Campaign Execution

5. FOLLOW-UP
   Responses → CRM Update → Cron Follow-up

6. ANALYTICS
   All Events → Metrics DB → Dashboard
```

---

## API Integrations

### Lead Generation
| Service | Use | API Docs |
|---------|-----|----------|
| Yelp Fusion | Business search | api.yelp.com |
| Google Places | Business details | developers.google.com/maps |
| Hunter.io | Email finder | hunter.io/api |
| Clearbit | Company data | clearbit.com/docs |
| ScrapingBee | Web scraping | scrapingbee.com |

### Communication
| Service | Use | API Docs |
|---------|-----|----------|
| VAPI | AI phone calls | docs.vapi.ai |
| Twilio | SMS + Voice | twilio.com/docs |
| Mailgun | Transactional email | documentation.mailgun.com |
| SendGrid | Email campaigns | docs.sendgrid.com |

### CRM & Automation
| Service | Use | API Docs |
|---------|-----|----------|
| GoHighLevel | CRM + Marketing | developers.gohighlevel.com |
| Zapier | Workflow automation | zapier.com/developer |
| n8n | Self-hosted workflows | docs.n8n.io |

### Data Storage
| Service | Use |
|---------|-----|
| PostgreSQL | Leads, contacts, history |
| Redis | Caching, queues |
| Supabase | Real-time, auth |

---

## MCP Servers Required

### Existing
- `n8n-mcp` - Workflow automation
- `vapi-mcp` - Phone AI calls
- `github-mcp` - Code management
- `notion-mcp` - Documentation

### To Build
| MCP Server | Purpose |
|------------|---------|
| `ghl-mcp` | GoHighLevel CRM integration |
| `twilio-mcp` | SMS/Voice management |
| `lead-enrichment-mcp` | Hunter, Clearbit, FullContact |
| `scraping-mcp` | Yelp, Google, web scraping |
| `analytics-mcp` | Dashboard data |

---

## N8n Workflow Templates

### Lead Generation
1. **Yelp Business Scraper** - Search + extract
2. **Google Places Enricher** - Add details
3. **Email Finder Pipeline** - Hunter.io lookup
4. **Lead Scoring Engine** - AI-based qualification

### Outreach
1. **Email Campaign Sender** - Personalized emails
2. **SMS Blast** - Twilio integration
3. **AI Call Scheduler** - VAPI campaigns
4. **Multi-touch Sequence** - Coordinated outreach

### Follow-up
1. **Cron Follow-up Checker** - Scheduled checks
2. **Response Handler** - Route by channel
3. **Appointment Booker** - Calendar integration
4. **Lead Handoff** - To sales team

### Dashboard
1. **Metrics Aggregator** - Collect stats
2. **Real-time Updates** - WebSocket push
3. **Report Generator** - Daily/weekly reports

---

## Database Schema

```sql
-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  source VARCHAR(50),
  business_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  enrichment_data JSONB,
  lead_score INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  title VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50), -- email, sms, call
  status VARCHAR(50),
  config JSONB,
  created_at TIMESTAMP
);

-- Outreach
CREATE TABLE outreach (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  campaign_id UUID REFERENCES campaigns(id),
  channel VARCHAR(50),
  status VARCHAR(50),
  sent_at TIMESTAMP,
  response JSONB
);

-- Calls
CREATE TABLE calls (
  id UUID PRIMARY KEY,
  vapi_call_id VARCHAR(100),
  lead_id UUID REFERENCES leads(id),
  status VARCHAR(50),
  duration INTEGER,
  transcript TEXT,
  recording_url VARCHAR(500),
  outcome VARCHAR(100),
  created_at TIMESTAMP
);

-- Follow-ups
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  scheduled_at TIMESTAMP,
  channel VARCHAR(50),
  template_id UUID,
  status VARCHAR(50),
  executed_at TIMESTAMP
);

-- Analytics
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id UUID,
  data JSONB,
  created_at TIMESTAMP
);
```

---

## Dashboard Components

### Overview Metrics
- Total leads
- Leads by source
- Conversion rate
- Revenue pipeline

### Call Center
- Active calls (real-time)
- Calls today/week/month
- Average call duration
- Success rate
- Agent leaderboard

### Outreach
- Emails sent/opened/clicked
- SMS delivered/responded
- Calls completed/booked

### Follow-up Queue
- Pending follow-ups
- Overdue follow-ups
- Next 24h schedule

---

## Cron Jobs

| Schedule | Job | Action |
|----------|-----|--------|
| */5 * * * * | check_follow_ups | Execute due follow-ups |
| 0 * * * * | aggregate_metrics | Update dashboard stats |
| 0 9 * * * | morning_report | Send daily report email |
| 0 6 * * 1 | weekly_report | Weekly summary |
| */15 * * * * | sync_ghl | Sync with GoHighLevel |
| 0 */6 * * * | enrich_leads | Process enrichment queue |

---

## Client Template Package

### Deliverables
1. **N8n Workflows** (JSON exports)
2. **MCP Servers** (npm packages)
3. **Database Schema** (SQL migrations)
4. **Dashboard** (React/Next.js app)
5. **API Documentation**
6. **Setup Guide**
7. **White-label Configuration**

### Configuration Points
- Branding (logo, colors)
- API credentials
- Domain settings
- Email templates
- Call scripts
- Pricing tiers

---

## Next Steps

1. **Create GHL MCP Server** - GoHighLevel integration
2. **Create Twilio MCP Server** - SMS/Voice
3. **Create Lead Enrichment MCP** - Hunter, Clearbit
4. **Build Scraping Workflows** - Yelp, Google
5. **Design Dashboard** - React + real-time updates
6. **Implement Cron System** - N8n scheduled triggers
7. **Package for Clients** - Template + docs
