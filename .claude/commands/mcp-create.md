# MCP Create - Auto-Generate MCP from Company/URL

Create an MCP server automatically from a company name, API URL, or by discovering from Notion.

## Input: $ARGUMENTS

## Your Task

1. **Parse the Input**:
   - If it's a company name (e.g., "stripe", "linear", "monday")
   - If it's a URL (e.g., "https://api.example.com/docs")
   - If it's "notion" - scan Notion for API credentials

2. **Discover the API**:
   - Check `/root/.claude-flow/mcp-factory/config.json` for known APIs
   - If known, get the docs URL and spec URL
   - If URL, try to find OpenAPI/Swagger spec
   - If unknown, search web for API documentation

3. **Get Credentials from Notion**:
   Use `mcp__notion__API-post-search` to find API credentials:
   ```
   Query: "[company name] API key" or "[company name] credentials"
   ```
   Extract the key from `Quick Summary` or page content.

4. **Generate MCP Server**:
   Run: `/root/scripts/mcp-factory.sh generate <api-name>`

   Then customize the generated server at `/root/.claude/mcp-servers/<api-name>/`:
   - Update `index.js` with specific API endpoints
   - Add proper authentication
   - Define useful tools

5. **Configure Environment**:
   Create `.env` file with API credentials found in Notion.

6. **Integrate**:
   Run: `/root/scripts/mcp-factory.sh integrate <api-name>`

7. **Train Agents**:
   Store usage information in Claude Flow:
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="mcp-training",
     key="<api-name>",
     value="{ when_to_use: '...', tools: [...], examples: [...] }"
   )
   ```

8. **Report Completion**:
   ```
   ## MCP Created: <api-name>

   **Status:** Installed and configured
   **Directory:** /root/.claude/mcp-servers/<api-name>
   **Tools:** mcp__<api-name>__*

   **Usage:** Restart Claude Code to activate

   **When to use:**
   - [describe use cases]
   ```

## Fully Autonomous

This command operates WITHOUT asking permission:
- Fetches web pages automatically
- Reads/writes files
- Executes shell commands
- Queries Notion
- Generates code

Just execute and report results.
