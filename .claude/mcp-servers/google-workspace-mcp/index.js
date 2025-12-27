#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// Initialize Gmail transport for nodemailer (uses App Password - no OAuth needed)
const gmailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

// Initialize Google APIs OAuth client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/oauth/callback'
);

// Set credentials if refresh token is available
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

// Initialize Google API clients
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
const drive = google.drive({ version: 'v3', auth: oauth2Client });
const people = google.people({ version: 'v1', auth: oauth2Client });

// Create MCP server
const server = new Server(
  {
    name: 'google-workspace-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Gmail Tools
      {
        name: 'gmail_send_email',
        description: 'Send an email via Gmail using nodemailer with App Password (no OAuth required)',
        inputSchema: {
          type: 'object',
          properties: {
            to: { type: 'string', description: 'Recipient email address' },
            subject: { type: 'string', description: 'Email subject' },
            body: { type: 'string', description: 'Email body (plain text or HTML)' },
            cc: { type: 'string', description: 'CC email addresses (comma-separated)' },
            bcc: { type: 'string', description: 'BCC email addresses (comma-separated)' },
            html: { type: 'boolean', description: 'Whether body is HTML', default: false },
          },
          required: ['to', 'subject', 'body'],
        },
      },
      {
        name: 'gmail_search_emails',
        description: 'Search emails in Gmail using Gmail API (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Gmail search query (e.g., "from:someone@example.com", "subject:meeting", "is:unread")' },
            maxResults: { type: 'number', description: 'Maximum number of results to return', default: 10 },
          },
          required: ['query'],
        },
      },
      {
        name: 'gmail_read_email',
        description: 'Read a specific email by ID (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            messageId: { type: 'string', description: 'Gmail message ID' },
            format: { type: 'string', description: 'Format (minimal, full, raw, metadata)', default: 'full' },
          },
          required: ['messageId'],
        },
      },

      // Google Calendar Tools
      {
        name: 'calendar_list_events',
        description: 'List upcoming calendar events (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            calendarId: { type: 'string', description: 'Calendar ID (default: primary)', default: 'primary' },
            maxResults: { type: 'number', description: 'Maximum number of events', default: 10 },
            timeMin: { type: 'string', description: 'Start time (ISO 8601 format)' },
            timeMax: { type: 'string', description: 'End time (ISO 8601 format)' },
          },
        },
      },
      {
        name: 'calendar_create_event',
        description: 'Create a new calendar event (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            calendarId: { type: 'string', description: 'Calendar ID (default: primary)', default: 'primary' },
            summary: { type: 'string', description: 'Event title' },
            description: { type: 'string', description: 'Event description' },
            startDateTime: { type: 'string', description: 'Start date-time (ISO 8601)' },
            endDateTime: { type: 'string', description: 'End date-time (ISO 8601)' },
            attendees: { type: 'array', description: 'Attendee email addresses', items: { type: 'string' } },
            location: { type: 'string', description: 'Event location' },
          },
          required: ['summary', 'startDateTime', 'endDateTime'],
        },
      },
      {
        name: 'calendar_get_event',
        description: 'Get details of a specific calendar event (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            calendarId: { type: 'string', description: 'Calendar ID (default: primary)', default: 'primary' },
            eventId: { type: 'string', description: 'Event ID' },
          },
          required: ['eventId'],
        },
      },

      // Google Contacts Tools
      {
        name: 'contacts_list',
        description: 'List Google Contacts (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            pageSize: { type: 'number', description: 'Number of contacts to return', default: 10 },
            sortOrder: { type: 'string', description: 'Sort order', default: 'LAST_MODIFIED_DESCENDING' },
          },
        },
      },
      {
        name: 'contacts_search',
        description: 'Search Google Contacts by name or email (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query (name or email)' },
            pageSize: { type: 'number', description: 'Number of results', default: 10 },
          },
          required: ['query'],
        },
      },
      {
        name: 'contacts_get',
        description: 'Get details of a specific contact (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            resourceName: { type: 'string', description: 'Contact resource name (e.g., people/c1234567890)' },
          },
          required: ['resourceName'],
        },
      },

      // Google Drive Tools
      {
        name: 'drive_list_files',
        description: 'List files in Google Drive (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            pageSize: { type: 'number', description: 'Number of files', default: 10 },
            orderBy: { type: 'string', description: 'Sort order', default: 'modifiedTime desc' },
            folderId: { type: 'string', description: 'Folder ID to list from (optional)' },
          },
        },
      },
      {
        name: 'drive_search_files',
        description: 'Search files in Google Drive (requires OAuth)',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            pageSize: { type: 'number', description: 'Max results', default: 10 },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Gmail Tools
      case 'gmail_send_email': {
        const mailOptions = {
          from: process.env.GOOGLE_EMAIL,
          to: args.to,
          subject: args.subject,
          ...(args.html ? { html: args.body } : { text: args.body }),
        };

        if (args.cc) mailOptions.cc = args.cc;
        if (args.bcc) mailOptions.bcc = args.bcc;

        const info = await gmailTransport.sendMail(mailOptions);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, messageId: info.messageId, response: info.response }, null, 2) }],
        };
      }

      case 'gmail_search_emails': {
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: args.query,
          maxResults: args.maxResults || 10,
        });

        const messages = response.data.messages || [];
        const detailedMessages = [];

        for (const message of messages.slice(0, 5)) {
          const details = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'metadata',
            metadataHeaders: ['From', 'Subject', 'Date'],
          });

          const headers = details.data.payload.headers;
          detailedMessages.push({
            id: message.id,
            threadId: message.threadId,
            from: headers.find(h => h.name === 'From')?.value,
            subject: headers.find(h => h.name === 'Subject')?.value,
            date: headers.find(h => h.name === 'Date')?.value,
          });
        }

        return {
          content: [{ type: 'text', text: JSON.stringify({ resultCount: messages.length, messages: detailedMessages }, null, 2) }],
        };
      }

      case 'gmail_read_email': {
        const message = await gmail.users.messages.get({
          userId: 'me',
          id: args.messageId,
          format: args.format || 'full',
        });

        const headers = message.data.payload.headers;
        const result = {
          id: message.data.id,
          threadId: message.data.threadId,
          from: headers.find(h => h.name === 'From')?.value,
          to: headers.find(h => h.name === 'To')?.value,
          subject: headers.find(h => h.name === 'Subject')?.value,
          date: headers.find(h => h.name === 'Date')?.value,
          snippet: message.data.snippet,
        };

        // Extract body
        let body = '';
        if (message.data.payload.body.data) {
          body = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8');
        } else if (message.data.payload.parts) {
          const textPart = message.data.payload.parts.find(part => part.mimeType === 'text/plain');
          if (textPart && textPart.body.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
          }
        }
        result.body = body;

        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      // Calendar Tools
      case 'calendar_list_events': {
        const response = await calendar.events.list({
          calendarId: args.calendarId || 'primary',
          timeMin: args.timeMin || new Date().toISOString(),
          timeMax: args.timeMax,
          maxResults: args.maxResults || 10,
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = response.data.items.map(event => ({
          id: event.id,
          summary: event.summary,
          description: event.description,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
          location: event.location,
          attendees: event.attendees?.map(a => a.email),
          htmlLink: event.htmlLink,
        }));

        return { content: [{ type: 'text', text: JSON.stringify({ events }, null, 2) }] };
      }

      case 'calendar_create_event': {
        const event = {
          summary: args.summary,
          description: args.description,
          location: args.location,
          start: { dateTime: args.startDateTime, timeZone: 'America/Los_Angeles' },
          end: { dateTime: args.endDateTime, timeZone: 'America/Los_Angeles' },
        };

        if (args.attendees && args.attendees.length > 0) {
          event.attendees = args.attendees.map(email => ({ email }));
        }

        const response = await calendar.events.insert({
          calendarId: args.calendarId || 'primary',
          resource: event,
          sendUpdates: 'all',
        });

        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, eventId: response.data.id, htmlLink: response.data.htmlLink }, null, 2) }],
        };
      }

      case 'calendar_get_event': {
        const response = await calendar.events.get({
          calendarId: args.calendarId || 'primary',
          eventId: args.eventId,
        });

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              id: response.data.id,
              summary: response.data.summary,
              description: response.data.description,
              start: response.data.start,
              end: response.data.end,
              location: response.data.location,
              attendees: response.data.attendees,
              htmlLink: response.data.htmlLink,
            }, null, 2),
          }],
        };
      }

      // Contacts Tools
      case 'contacts_list': {
        const response = await people.people.connections.list({
          resourceName: 'people/me',
          pageSize: args.pageSize || 10,
          personFields: 'names,emailAddresses,phoneNumbers,organizations',
          sortOrder: args.sortOrder || 'LAST_MODIFIED_DESCENDING',
        });

        const contacts = response.data.connections?.map(person => ({
          resourceName: person.resourceName,
          name: person.names?.[0]?.displayName,
          email: person.emailAddresses?.[0]?.value,
          phone: person.phoneNumbers?.[0]?.value,
          organization: person.organizations?.[0]?.name,
        })) || [];

        return { content: [{ type: 'text', text: JSON.stringify({ contacts }, null, 2) }] };
      }

      case 'contacts_search': {
        const response = await people.people.searchContacts({
          query: args.query,
          pageSize: args.pageSize || 10,
          readMask: 'names,emailAddresses,phoneNumbers,organizations',
        });

        const contacts = response.data.results?.map(result => {
          const person = result.person;
          return {
            resourceName: person.resourceName,
            name: person.names?.[0]?.displayName,
            email: person.emailAddresses?.[0]?.value,
            phone: person.phoneNumbers?.[0]?.value,
            organization: person.organizations?.[0]?.name,
          };
        }) || [];

        return { content: [{ type: 'text', text: JSON.stringify({ contacts }, null, 2) }] };
      }

      case 'contacts_get': {
        const response = await people.people.get({
          resourceName: args.resourceName,
          personFields: 'names,emailAddresses,phoneNumbers,addresses,organizations,biographies',
        });

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              resourceName: response.data.resourceName,
              names: response.data.names,
              emailAddresses: response.data.emailAddresses,
              phoneNumbers: response.data.phoneNumbers,
              addresses: response.data.addresses,
              organizations: response.data.organizations,
              biographies: response.data.biographies,
            }, null, 2),
          }],
        };
      }

      // Drive Tools
      case 'drive_list_files': {
        let query = 'trashed=false';
        if (args.folderId) {
          query += ` and '${args.folderId}' in parents`;
        }

        const response = await drive.files.list({
          pageSize: args.pageSize || 10,
          fields: 'files(id, name, mimeType, modifiedTime, webViewLink, size)',
          orderBy: args.orderBy || 'modifiedTime desc',
          q: query,
        });

        return { content: [{ type: 'text', text: JSON.stringify({ files: response.data.files }, null, 2) }] };
      }

      case 'drive_search_files': {
        const response = await drive.files.list({
          pageSize: args.pageSize || 10,
          fields: 'files(id, name, mimeType, modifiedTime, webViewLink, size)',
          q: `${args.query} and trashed=false`,
        });

        return { content: [{ type: 'text', text: JSON.stringify({ files: response.data.files }, null, 2) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: error.message, stack: error.stack }, null, 2) }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Google Workspace MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
