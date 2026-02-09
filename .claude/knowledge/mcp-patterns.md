# MCP Integration Patterns

Knowledge base for creating and managing MCP server integrations.

## MCP Server Architecture

### Standard Structure

```
mcp-server/
├── package.json
├── src/
│   ├── index.ts          # Server entry point
│   ├── tools/            # Tool implementations
│   └── resources/        # Resource providers
└── README.md
```

### Configuration Format

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx | node | python",
      "args": ["path/to/server", "--options"],
      "env": {
        "API_KEY": "${ENV_VAR}",
        "BASE_URL": "https://api.example.com"
      },
      "disabled": false
    }
  }
}
```

## Common Authentication Patterns

### API Key Authentication

```json
{
  "env": {
    "SERVICE_API_KEY": "${SERVICE_API_KEY}"
  }
}
```

### OAuth 2.0 Authentication

```json
{
  "env": {
    "CLIENT_ID": "${SERVICE_CLIENT_ID}",
    "CLIENT_SECRET": "${SERVICE_CLIENT_SECRET}",
    "REFRESH_TOKEN": "${SERVICE_REFRESH_TOKEN}"
  }
}
```

## Tool Naming Conventions

| Pattern | Example | Use Case |
|---------|---------|----------|
| `service__action` | `buffer__schedule_post` | Single action |
| `service__resource_action` | `github__repo_create` | Resource-based |
| `service__get_X` | `notion__get_page` | Read operations |
| `service__create_X` | `stripe__create_payment` | Create operations |

## Integration Categories

### Social Media APIs
| Service | Auth | Priority |
|---------|------|----------|
| Buffer | OAuth/API Key | High |
| Later | API Key | High |
| LinkedIn | OAuth | Medium |
| Twitter/X | OAuth | Medium |

### Marketing APIs
| Service | Auth | Priority |
|---------|------|----------|
| HubSpot | API Key | High |
| Mailchimp | API Key | Medium |

## Credential Storage

### Notion Locations
| Location | Database ID | Use |
|----------|-------------|-----|
| API Keys Notebook | 1bdc283b-4ad9-8050-9944-d59acadcc570 | Primary |
| Notes & References | (search) | Secondary |

## Best Practices

1. **Never hardcode credentials** - Use environment variables
2. **Respect API limits** - Implement backoff
3. **Document all tools** - Include examples
4. **Test connections** - Validate on startup
