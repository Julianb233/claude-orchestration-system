# GoHighLevel (GHL) Reference Guide

**Last Updated:** 2025-12-17
**Platform:** GoHighLevel / HighLevel CRM

---

## Overview

GoHighLevel is an all-in-one marketing and CRM platform for agencies. It includes:
- CRM & Pipeline Management
- Marketing Automation
- Funnels & Websites
- Reputation Management
- Unified Messaging
- Appointment Scheduling
- Workflows & Automations

---

## Core Concepts

### 1. Locations (Sub-Accounts)
- Each client gets their own "location"
- Isolated data, branding, settings
- Can have multiple pipelines, workflows, etc.

### 2. Contacts
- Central record for leads/customers
- Custom fields for additional data
- Tags for segmentation
- Full activity timeline

### 3. Opportunities
- Deals/sales in pipelines
- Move through stages
- Assigned to team members
- Linked to contacts

### 4. Workflows
- Automation engine
- Trigger → Actions → Conditions
- Can span multiple channels

---

## Custom Value Fields

### Contact Custom Fields
```
{{contact.first_name}}
{{contact.last_name}}
{{contact.full_name}}
{{contact.email}}
{{contact.phone}}
{{contact.address1}}
{{contact.city}}
{{contact.state}}
{{contact.postal_code}}
{{contact.company_name}}
{{contact.date_of_birth}}
```

### Custom Field Syntax
```
{{contact.custom_field_key}}
{{contact.custom.Field Name}}
```

### Opportunity Fields
```
{{opportunity.name}}
{{opportunity.monetary_value}}
{{opportunity.pipeline_stage}}
{{opportunity.assigned_user}}
{{opportunity.source}}
```

### Appointment Fields
```
{{appointment.title}}
{{appointment.start_time}}
{{appointment.end_time}}
{{appointment.calendar_name}}
{{appointment.meeting_location}}
```

### User Fields
```
{{user.first_name}}
{{user.last_name}}
{{user.email}}
{{user.phone}}
{{user.calendar_link}}
```

### Location/Business Fields
```
{{location.name}}
{{location.address}}
{{location.city}}
{{location.state}}
{{location.phone}}
{{location.email}}
{{location.website}}
```

### Date/Time Fields
```
{{current.date}}
{{current.time}}
{{current.day_of_week}}
```

---

## Workflow Triggers

### Contact Triggers
| Trigger | When It Fires |
|---------|---------------|
| Contact Created | New contact added |
| Contact Changed | Field updated |
| Contact Tag Added | Tag applied |
| Contact Tag Removed | Tag removed |
| Contact DND | Do Not Disturb toggled |
| Birthday Reminder | X days before birthday |

### Opportunity Triggers
| Trigger | When It Fires |
|---------|---------------|
| Opportunity Created | New opp added |
| Pipeline Stage Changed | Opp moves stages |
| Opportunity Status Changed | Won/Lost/Open |
| Stale Opportunity | No activity for X days |

### Communication Triggers
| Trigger | When It Fires |
|---------|---------------|
| Customer Replied | Any reply received |
| Email Opened | Email tracking detected |
| Email Link Clicked | Link in email clicked |
| SMS Received | Incoming SMS |
| Call Completed | Call ends |
| Voicemail Received | New voicemail |

### Appointment Triggers
| Trigger | When It Fires |
|---------|---------------|
| Appointment Booked | New appointment |
| Appointment Reminder | X minutes/hours before |
| Appointment No Show | Marked as no-show |
| Appointment Cancelled | Cancelled |
| Appointment Completed | Marked complete |

### Form/Survey Triggers
| Trigger | When It Fires |
|---------|---------------|
| Form Submitted | Form completion |
| Survey Submitted | Survey completion |

### Payment Triggers
| Trigger | When It Fires |
|---------|---------------|
| Invoice Paid | Payment received |
| Payment Failed | Payment declined |
| Subscription Created | New subscription |

---

## Workflow Actions

### Communication Actions
- Send Email
- Send SMS
- Send Voicemail Drop
- Manual Call
- Send to Messenger
- Send Internal Notification

### CRM Actions
- Create/Update Contact
- Add/Remove Tag
- Add to Workflow
- Remove from Workflow
- Create Opportunity
- Update Opportunity Stage
- Assign to User

### Task Actions
- Create Task
- Mark Task Complete

### Conditional Actions
- If/Else Branch
- Wait
- Goal (wait until condition met)
- Split (A/B testing)

### Integration Actions
- HTTP Webhook
- Custom Code (JavaScript)
- Zapier Integration
- API calls

---

## Pipeline Setup

### Standard Sales Pipeline Stages
1. **New Lead** - Just came in
2. **Contacted** - Initial outreach done
3. **Qualified** - Confirmed interest/fit
4. **Proposal Sent** - Quote/proposal delivered
5. **Negotiation** - Back and forth
6. **Won** - Closed deal
7. **Lost** - Did not close

### Service Pipeline Stages
1. **New Request**
2. **Scheduled**
3. **In Progress**
4. **Completed**
5. **Follow-up**

---

## Common Workflow Patterns

### Lead Nurture Sequence
```
Trigger: Form Submitted
→ Add Tag: "New Lead"
→ Send Email: Welcome
→ Wait 1 day
→ Send SMS: Follow-up
→ Wait 2 days
→ Send Email: Value content
→ Wait 3 days
→ Create Task: Manual follow-up
```

### Appointment Reminder Sequence
```
Trigger: Appointment Booked
→ Send Email: Confirmation
→ Wait until 24 hours before
→ Send SMS: Reminder
→ Wait until 1 hour before
→ Send SMS: Final reminder
```

### Missed Call Follow-up
```
Trigger: Call Completed (missed)
→ Wait 1 minute
→ Send SMS: "Sorry we missed you..."
→ Add Tag: "Missed Call"
→ Create Task: Call back
```

### Review Request
```
Trigger: Invoice Paid
→ Wait 3 days
→ If/Else: Has review tag?
  → No: Send Email/SMS: Review request
  → Yes: End workflow
```

---

## API Basics

### Base URL
```
https://rest.gohighlevel.com/v1/
```

### Authentication
```
Authorization: Bearer {api_key}
```

### Common Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/contacts/` | GET/POST | List/Create contacts |
| `/contacts/{id}` | GET/PUT/DELETE | Single contact |
| `/opportunities/` | GET/POST | List/Create opps |
| `/pipelines/` | GET | List pipelines |
| `/calendars/` | GET | List calendars |
| `/conversations/` | GET | List conversations |

### Webhook Events
- contact.created
- contact.updated
- contact.deleted
- opportunity.created
- opportunity.updated
- appointment.created
- form.submitted

---

## Integration Points

### Native Integrations
- Stripe (payments)
- Twilio (SMS/Voice)
- Mailgun (email)
- Google Calendar
- Outlook Calendar
- Facebook
- Google My Business
- Quickbooks

### Zapier/Make Triggers
- New Contact
- Contact Updated
- New Opportunity
- Stage Changed
- Appointment Booked
- Form Submitted

---

## Best Practices

### 1. Workflow Organization
- Use clear naming: `[Type] - Purpose - Version`
- Example: `[Nurture] - New Lead - v2`
- Add descriptions to complex workflows

### 2. Tag Strategy
- Use prefixes: `status:`, `source:`, `interest:`
- Examples: `status:active`, `source:facebook`, `interest:product-a`

### 3. Custom Fields
- Create once, use everywhere
- Standard naming convention
- Document field purposes

### 4. Testing
- Always test workflows with test contacts
- Check all branches of If/Else
- Verify merge tags render correctly

---

## Troubleshooting

### Workflow Not Triggering
1. Check trigger conditions
2. Verify contact matches criteria
3. Check if contact is in another workflow
4. Review workflow enrollment settings

### Merge Tags Not Working
1. Verify field has data
2. Check exact field key spelling
3. Use fallback: `{{contact.first_name|there}}`

### SMS Not Sending
1. Check phone number format
2. Verify Twilio connection
3. Check character limit
4. Review DND settings

---

## Documentation Links

- Main Docs: https://help.gohighlevel.com/
- API Docs: https://highlevel.stoplight.io/
- Community: https://community.gohighlevel.com/

---

## Update Log

| Date | Updates |
|------|---------|
| 2025-12-17 | Initial reference created |
