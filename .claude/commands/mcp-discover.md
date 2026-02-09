# MCP-Discover - API Discovery

Discover API information for a service without full integration.

## Usage

`/mcp-discover [service|url]`

## Purpose

Research and document API capabilities before deciding to integrate:
- Find API documentation
- Identify authentication requirements
- List available endpoints
- Check for existing MCP implementations
- Estimate integration complexity

## Workflow

### 1. Web Search

```javascript
WebSearch({ query: "{service} API documentation developer portal" })
WebSearch({ query: "{service} REST API reference" })
```

### 2. Documentation Fetch

```javascript
WebFetch({
  url: "{api_docs_url}",
  prompt: "Extract: base URL, authentication method, main endpoints, rate limits, pricing"
})
```

### 3. Existing MCP Check

```javascript
WebSearch({ query: "{service} MCP server" })
mcp__github__search_repositories({ query: "{service} mcp" })
```

### 4. Credential Check

```javascript
mcp__notion__API-post-search({ query: "{service} API" })
```

## Output

```
API Discovery: Buffer

Documentation: https://buffer.com/developers/api
Auth Type: OAuth 2.0 / API Key
Base URL: https://api.buffer.com/1/

Key Endpoints:
- POST /updates/create - Schedule posts
- GET /profiles - List connected accounts
- GET /updates/{id} - Get post details
- GET /profiles/{id}/analytics - Get analytics

Rate Limits: 60 requests/minute
Pricing: Free tier available, Pro for higher limits

Existing MCP: @bufferapp/buffer-mcp (npm)
Credentials in Notion: Found (API Keys notebook)

Complexity: Low (existing MCP available)
Recommended: /mcp-integrate Buffer

Would you like to proceed with integration? [Y/n]
```

## Discovery Cache

Results cached in Claude Flow:

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "mcp-integrations",
  key: "discovery-{service}",
  value: { apiInfo, existingMcp, credentialsFound, complexity },
  ttl: 604800  // 7 days
})
```

## Use Cases

- Research before committing to integration
- Compare multiple services
- Document API capabilities for planning
- Check if credentials exist
