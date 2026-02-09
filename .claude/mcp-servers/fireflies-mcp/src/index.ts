#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_URL = "https://api.fireflies.ai/graphql";
const API_KEY = process.env.FIREFLIES_API_KEY;

if (!API_KEY) {
  console.error("FIREFLIES_API_KEY environment variable is required");
  process.exit(1);
}

async function graphqlRequest(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors.map((e: { message: string }) => e.message).join(", "));
  }
  return result.data;
}

const server = new Server(
  { name: "fireflies-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_transcripts",
      description: "List all meeting transcripts from Fireflies.ai. Returns title, date, duration, and participants for each transcript.",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of transcripts to return (default: 50)",
          },
        },
      },
    },
    {
      name: "get_transcript",
      description: "Get a specific transcript by ID with full content including sentences, speakers, and timestamps.",
      inputSchema: {
        type: "object",
        properties: {
          transcript_id: {
            type: "string",
            description: "The transcript ID to retrieve",
          },
        },
        required: ["transcript_id"],
      },
    },
    {
      name: "get_transcript_summary",
      description: "Get the AI-generated summary, action items, and key points for a transcript.",
      inputSchema: {
        type: "object",
        properties: {
          transcript_id: {
            type: "string",
            description: "The transcript ID to get summary for",
          },
        },
        required: ["transcript_id"],
      },
    },
    {
      name: "search_transcripts",
      description: "Search through transcripts by keyword or phrase. Returns matching transcripts with relevance.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query to find in transcripts",
          },
          limit: {
            type: "number",
            description: "Maximum results to return (default: 20)",
          },
        },
        required: ["query"],
      },
    },
    {
      name: "get_user",
      description: "Get the current Fireflies user information including email, name, and account details.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_transcript_sentences",
      description: "Get all sentences from a transcript with speaker identification and timestamps. Useful for detailed analysis.",
      inputSchema: {
        type: "object",
        properties: {
          transcript_id: {
            type: "string",
            description: "The transcript ID to retrieve sentences from",
          },
        },
        required: ["transcript_id"],
      },
    },
    {
      name: "get_recent_meetings",
      description: "Get the most recent meetings with summaries. Quick way to see what meetings happened recently.",
      inputSchema: {
        type: "object",
        properties: {
          days: {
            type: "number",
            description: "Number of days to look back (default: 7)",
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_transcripts": {
        const limit = (args?.limit as number) || 50;
        const data = await graphqlRequest(`
          query {
            transcripts {
              id
              title
              date
              duration
              participants
              host_email
              organizer_email
            }
          }
        `);
        const transcripts = data.transcripts.slice(0, limit).map((t: Record<string, unknown>) => ({
          ...t,
          date: t.date ? new Date(t.date as number).toISOString() : null,
          duration_minutes: t.duration ? Math.round((t.duration as number) / 60 * 10) / 10 : null,
        }));
        return { content: [{ type: "text", text: JSON.stringify(transcripts, null, 2) }] };
      }

      case "get_transcript": {
        const transcriptId = args?.transcript_id as string;
        const data = await graphqlRequest(`
          query GetTranscript($id: String!) {
            transcript(id: $id) {
              id
              title
              date
              duration
              participants
              host_email
              organizer_email
              transcript_url
              audio_url
              video_url
              sentences {
                text
                speaker_name
                speaker_id
                start_time
                end_time
              }
            }
          }
        `, { id: transcriptId });

        const transcript = {
          ...data.transcript,
          date: data.transcript.date ? new Date(data.transcript.date).toISOString() : null,
          duration_minutes: data.transcript.duration ? Math.round(data.transcript.duration / 60 * 10) / 10 : null,
        };
        return { content: [{ type: "text", text: JSON.stringify(transcript, null, 2) }] };
      }

      case "get_transcript_summary": {
        const transcriptId = args?.transcript_id as string;
        const data = await graphqlRequest(`
          query GetTranscriptSummary($id: String!) {
            transcript(id: $id) {
              id
              title
              date
              summary {
                overview
                shorthand_bullet
                action_items
                outline
                keywords
                questions
              }
            }
          }
        `, { id: transcriptId });

        return { content: [{ type: "text", text: JSON.stringify(data.transcript, null, 2) }] };
      }

      case "search_transcripts": {
        const query = args?.query as string;
        const limit = (args?.limit as number) || 20;

        // First get all transcripts
        const data = await graphqlRequest(`
          query {
            transcripts {
              id
              title
              date
              duration
              participants
            }
          }
        `);

        // Filter by title match (basic search)
        const queryLower = query.toLowerCase();
        const matches = data.transcripts
          .filter((t: Record<string, unknown>) => {
            const title = (t.title as string || "").toLowerCase();
            const participants = (t.participants as string[] || []).join(" ").toLowerCase();
            return title.includes(queryLower) || participants.includes(queryLower);
          })
          .slice(0, limit)
          .map((t: Record<string, unknown>) => ({
            ...t,
            date: t.date ? new Date(t.date as number).toISOString() : null,
          }));

        return { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }] };
      }

      case "get_user": {
        const data = await graphqlRequest(`
          query {
            user {
              user_id
              email
              name
              num_transcripts
              recent_meeting
              minutes_consumed
              is_admin
            }
          }
        `);
        return { content: [{ type: "text", text: JSON.stringify(data.user, null, 2) }] };
      }

      case "get_transcript_sentences": {
        const transcriptId = args?.transcript_id as string;
        const data = await graphqlRequest(`
          query GetSentences($id: String!) {
            transcript(id: $id) {
              id
              title
              sentences {
                text
                speaker_name
                speaker_id
                start_time
                end_time
              }
            }
          }
        `, { id: transcriptId });

        // Format sentences for readability
        const formatted = data.transcript.sentences?.map((s: Record<string, unknown>) => ({
          speaker: s.speaker_name || `Speaker ${s.speaker_id}`,
          text: s.text,
          time: `${Math.floor((s.start_time as number) / 60)}:${String(Math.floor((s.start_time as number) % 60)).padStart(2, '0')}`,
        }));

        return { content: [{ type: "text", text: JSON.stringify({ title: data.transcript.title, sentences: formatted }, null, 2) }] };
      }

      case "get_recent_meetings": {
        const days = (args?.days as number) || 7;
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

        const data = await graphqlRequest(`
          query {
            transcripts {
              id
              title
              date
              duration
              participants
              summary {
                overview
              }
            }
          }
        `);

        const recent = data.transcripts
          .filter((t: Record<string, unknown>) => (t.date as number) >= cutoff)
          .map((t: Record<string, unknown>) => ({
            id: t.id,
            title: t.title,
            date: new Date(t.date as number).toISOString(),
            duration_minutes: Math.round((t.duration as number) / 60 * 10) / 10,
            participants: t.participants,
            overview: (t.summary as Record<string, unknown>)?.overview || null,
          }));

        return { content: [{ type: "text", text: JSON.stringify(recent, null, 2) }] };
      }

      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
