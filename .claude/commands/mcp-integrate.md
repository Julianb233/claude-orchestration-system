# MCP-Integrate - Autonomous API Integration

Automatically discover, configure, and integrate new APIs as MCP servers.

## Usage

`/mcp-integrate [service|url]`

## Examples

```bash
/mcp-integrate Buffer
/mcp-integrate https://buffer.com
/mcp-integrate https://stripe.com/docs/api
/mcp-integrate "Later scheduling API"
```

## Autonomous Operation

This command runs **without permission prompts**:
- Searches web for API documentation
- Fetches credentials from Notion
- Creates MCP configuration files
- Generates usage documentation
- Updates relevant agents

## Workflow

### 1. Discovery Phase

```javascript
// Search for API docs
WebSearch({ query: "{service} API documentation developer" })

// Check for existing MCP servers
WebSearch({ query: "{service} MCP server npm github" })
mcp__github__search_repositories({ query: "{service} mcp" })

// Fetch API documentation
WebFetch({ url: "{api_docs_url}", prompt: "Extract API endpoints, auth method, base URL" })
```

### 2. Credential Phase

```javascript
// Search Julian's Notion for credentials
mcp__notion__API-post-search({ query: "{service} API key" })

// Check API Keys notebook
mcp__notion__API-post-database-query({
  database_id: "1bdc283b-4ad9-8050-9944-d59acadcc570",
  filter: { "property": "title", "title": { "contains": "{service}" }}
})
```

### 3. Configuration Phase

Create MCP config at `/root/.claude/mcp-servers/{service}-mcp.json`:

```json
{
  "mcpServers": {
    "{service}": {
      "command": "npx",
      "args": ["-y", "@{org}/{service}-mcp"],
      "env": {
        "{SERVICE}_API_KEY": "${NOTION_FETCHED_KEY}"
      }
    }
  }
}
```

### 4. Documentation Phase

Create knowledge file at `/root/.claude/knowledge/mcp-{service}.md`:

```markdown
# {Service} MCP Integration

## Available Tools
| Tool | Description |
|------|-------------|
| mcp__{service}__tool1 | ... |

## When to Use
- Use case 1
- Use case 2

## Examples
...
```

### 5. Integration Phase

```javascript
// Store in Claude Flow memory
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "mcp-integrations",
  key: "{service}-integration",
  value: { service, status: "active", config, knowledge }
})

// Update relevant agents (optional)
// Add to CLAUDE.md tools section
```

## Output

```
MCP Integration Complete!

Service: Buffer
Status: Active
Config: /root/.claude/mcp-servers/buffer-mcp.json
Docs: /root/.claude/knowledge/mcp-buffer.md

Available Tools:
- mcp__buffer__schedule_post
- mcp__buffer__get_analytics
- mcp__buffer__list_profiles

Relevant Agents Updated:
- social-media-agent (added Buffer integration)

To use: The tools are now available in your workspace.
```

## Error Handling

| Issue | Resolution |
|-------|------------|
| No API docs found | Search alternative URLs, GitHub |
| No credentials in Notion | Prompt user or check env vars |
| No existing MCP | Create custom integration |
| Rate limited | Queue for retry |

## Background Mode

For long integrations, run in background:

```javascript
mcp__claude-flow__task_orchestrate({
  task: "Integrate {service} API",
  strategy: "sequential",
  priority: "medium"
})
```

Check status with `/mcp-status`.
