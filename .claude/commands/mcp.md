# MCP Management Command

Manage MCP servers - create, list, status, or discover.

## Input: $ARGUMENTS

## Subcommands

### No arguments or "list"
List all installed MCP servers:
```bash
/root/scripts/mcp-factory.sh list
```
Show status of each (configured, needs setup, etc.)

### "create <name-or-url>"
Create a new MCP server:
- Run `/mcp-create <name-or-url>` workflow

### "status"
Show MCP factory status:
```bash
/root/scripts/mcp-factory.sh status
```

### "discover"
Scan Notion for APIs with credentials and auto-create MCPs:
1. Search Notion for "API" and "credentials"
2. For each found, check if MCP exists
3. If not, queue for creation

### "queue <name>"
Add to MCP creation queue:
```bash
/root/scripts/mcp-factory.sh queue "<name>"
```

### "process"
Process the MCP queue:
```bash
/root/scripts/mcp-factory.sh process
```

### "daemon start|stop|status"
Control the MCP factory daemon:
```bash
/root/scripts/mcp-factory-daemon.sh <action>
```

## Examples

- `/mcp list` - Show all MCPs
- `/mcp create stripe` - Create Stripe MCP
- `/mcp create https://api.linear.app` - Create from URL
- `/mcp discover` - Find APIs in Notion and create MCPs
- `/mcp daemon start` - Start autonomous daemon
