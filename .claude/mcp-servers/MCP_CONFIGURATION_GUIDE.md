# MCP Servers Configuration Guide

This guide provides comprehensive configuration for integrating Stripe, Neon, Airtable, and Google Gemini MCP servers with Claude Code.

## Table of Contents
1. [Stripe MCP Server](#stripe-mcp-server)
2. [Neon Database MCP Server](#neon-database-mcp-server)
3. [Airtable MCP Server](#airtable-mcp-server)
4. [Google Gemini MCP Server](#google-gemini-mcp-server)
5. [Complete JSON Configuration](#complete-json-configuration)

---

## Stripe MCP Server

### Overview
The Stripe MCP server enables direct integration with Stripe APIs, allowing you to manage customers, products, payments, and more through natural language.

### Required Credentials
- **STRIPE_API_KEY**: Your Stripe secret key (starts with `sk_test_` for test mode or `sk_live_` for production)

### Where to Get API Key
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (never share this publicly)
4. For testing, use the test mode key; for production, use the live mode key

### Configuration Options

#### Option 1: Using npx with inline API key (recommended)
```json
{
  "stripe": {
    "command": "npx",
    "args": [
      "-y",
      "@stripe/mcp",
      "--tools=all",
      "--api-key=$STRIPE_API_KEY"
    ],
    "env": {
      "STRIPE_API_KEY": "sk_test_YOUR_STRIPE_SECRET_KEY_HERE"
    }
  }
}
```

#### Option 2: Specific tools only
```json
{
  "stripe": {
    "command": "npx",
    "args": [
      "-y",
      "@stripe/mcp",
      "--tools=customers.create,customers.read,products.create",
      "--api-key=$STRIPE_API_KEY"
    ],
    "env": {
      "STRIPE_API_KEY": "sk_test_YOUR_STRIPE_SECRET_KEY_HERE"
    }
  }
}
```

#### Option 3: With connected account
```json
{
  "stripe": {
    "command": "npx",
    "args": [
      "-y",
      "@stripe/mcp",
      "--tools=all",
      "--api-key=$STRIPE_API_KEY",
      "--stripe-account=CONNECTED_ACCOUNT_ID"
    ],
    "env": {
      "STRIPE_API_KEY": "sk_test_YOUR_STRIPE_SECRET_KEY_HERE"
    }
  }
}
```

### Available Tools
- Customer management (create, read, update, delete)
- Product and price management
- Payment processing
- Subscription management
- Invoice operations
- And many more Stripe API operations

### References
- [Stripe MCP Documentation](https://docs.stripe.com/mcp)
- [Build on Stripe with LLMs](https://docs.stripe.com/building-with-llms)
- [@stripe/mcp on npm](https://www.npmjs.com/package/@stripe/mcp)

---

## Neon Database MCP Server

### Overview
The Neon MCP server enables natural language interaction with Neon Postgres databases, including project management, database queries, and migrations.

### Required Credentials
- **NEON_API_KEY**: Your Neon API key for authentication

### Where to Get API Key
1. Log in to your [Neon Console](https://console.neon.tech/)
2. Navigate to **Account Settings** → **API Keys**
3. Click **Generate new API key**
4. Give it a descriptive name and copy the key immediately (it won't be shown again)
5. Store the key securely

### Configuration Options

#### Option 1: Remote Server with OAuth (Recommended - Preview)
```json
{
  "neon": {
    "command": "npx",
    "args": [
      "-y",
      "mcp-remote",
      "https://mcp.neon.tech/mcp"
    ]
  }
}
```
**Note**: Uses OAuth for authentication - no API key management needed!

#### Option 2: Local Server with API Key
```json
{
  "neon": {
    "command": "npx",
    "args": [
      "-y",
      "@neondatabase/mcp-server-neon",
      "start",
      "$NEON_API_KEY"
    ],
    "env": {
      "NEON_API_KEY": "YOUR_NEON_API_KEY_HERE"
    }
  }
}
```

#### Option 3: Read-Only Mode
```json
{
  "neon": {
    "url": "https://mcp.neon.tech/mcp",
    "headers": {
      "x-read-only": "true"
    }
  }
}
```

### Available Tools
- **list_projects**: Lists your Neon projects
- **list_shared_projects**: Lists projects shared with you
- **describe_project**: Get detailed project information
- **create_project**: Create new Neon projects
- **delete_project**: Delete projects and associated resources
- **prepare_database_migration**: Plan database migrations
- **complete_database_migration**: Execute database migrations
- **explain_sql_statement**: Get SQL query explanations
- **prepare_query_tuning**: Analyze query performance
- **complete_query_tuning**: Optimize SQL queries

### Security Note
The Neon MCP Server is intended for **local development and IDE integrations only**. Not recommended for production environments.

### References
- [Neon MCP Server Documentation](https://neon.com/docs/ai/neon-mcp-server)
- [Neon MCP Server GitHub](https://github.com/neondatabase/mcp-server-neon)
- [Using Claude Code with Neon](https://composio.dev/blog/neondb-mcp-with-claude-code)

---

## Airtable MCP Server

### Overview
The Airtable MCP server provides read and write access to Airtable databases, enabling schema inspection and record management through natural language.

### Required Credentials
- **AIRTABLE_API_KEY**: Your Airtable personal access token

### Where to Get API Key
1. Log in to [Airtable](https://airtable.com/)
2. Click your account icon → **Developer hub**
3. Click **Personal access tokens** → **Create token**
4. Give it a name and select the required scopes:
   - **Required**: `schema.bases:read`, `data.records:read`
   - **Optional**: `schema.bases:write`, `data.records:write`, `data.recordComments:read`, `data.recordComments:write`
5. Select the bases you want to grant access to
6. Click **Create token** and copy it immediately

### Configuration Options

#### Option 1: domdomegg/airtable-mcp-server (Most Popular)
```json
{
  "airtable": {
    "command": "npx",
    "args": [
      "-y",
      "airtable-mcp-server"
    ],
    "env": {
      "AIRTABLE_API_KEY": "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  }
}
```

#### Option 2: felores/airtable-mcp-server (Advanced table building)
```json
{
  "airtable": {
    "command": "npx",
    "args": [
      "-y",
      "@felores/airtable-mcp-server"
    ],
    "env": {
      "AIRTABLE_API_KEY": "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  }
}
```

#### Option 3: rashidazarang/airtable-mcp (Comprehensive features)
```json
{
  "airtable": {
    "command": "npx",
    "args": [
      "-y",
      "@rashidazarang/airtable-mcp"
    ],
    "env": {
      "AIRTABLE_TOKEN": "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  }
}
```

### Available Features
- Inspect database schemas
- Read and write records
- Create and update tables
- Manage fields and relationships
- Query and filter data
- Bulk operations
- Comment management (with appropriate scopes)

### Token Format
Airtable personal access tokens start with `pat` followed by a series of alphanumeric characters.

### References
- [Airtable MCP Server GitHub](https://github.com/domdomegg/airtable-mcp-server)
- [Airtable Community Discussion](https://community.airtable.com/development-apis-11/airtable-mcp-is-here-46183)
- [Felores Airtable MCP](https://github.com/felores/airtable-mcp)

---

## Google Gemini MCP Server

### Overview
The Gemini MCP server acts as a bridge between Claude and Google's Gemini API, enabling you to leverage Gemini's capabilities within Claude workflows.

### Required Credentials
- **GOOGLE_API_KEY** or **GEMINI_API_KEY**: Your Google AI Studio API key

### Where to Get API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API key** in the left sidebar
4. Click **Create API key** (or use an existing one)
5. Select a Google Cloud project (or create a new one)
6. Copy your API key

### Configuration Options

#### Option 1: Using npx (Simple Setup)
```json
{
  "gemini": {
    "command": "npx",
    "args": [
      "-y",
      "github:aliargun/mcp-server-gemini"
    ],
    "env": {
      "GEMINI_API_KEY": "YOUR_GOOGLE_API_KEY_HERE"
    }
  }
}
```

#### Option 2: With specific model configuration
```json
{
  "gemini": {
    "command": "npx",
    "args": [
      "-y",
      "@bar0n/gemini-mcp"
    ],
    "env": {
      "GEMINI_API_KEY": "YOUR_GOOGLE_API_KEY_HERE",
      "GEMINI_MODEL": "gemini-2.5-pro-latest",
      "GEMINI_FLASH_MODEL": "gemini-2.5-flash",
      "GEMINI_PRO_MODEL": "gemini-2.5-pro"
    }
  }
}
```

#### Option 3: Docker Configuration
```json
{
  "gemini": {
    "command": "docker",
    "args": [
      "run",
      "--rm",
      "-i",
      "--network",
      "host",
      "-e",
      "GEMINI_API_KEY",
      "-e",
      "GEMINI_MODEL",
      "gemini-mcp-server:latest"
    ],
    "env": {
      "GEMINI_API_KEY": "YOUR_GOOGLE_API_KEY_HERE",
      "GEMINI_MODEL": "gemini-2.5-flash"
    }
  }
}
```

### Environment Variables
- **GEMINI_API_KEY** (required): Your Google Gemini API key
- **GEMINI_MODEL** (optional): Default model (default: "gemini-2.5-pro-latest")
- **GEMINI_PRO_MODEL** (optional): Pro model variant (default: "gemini-2.5-pro")
- **GEMINI_FLASH_MODEL** (optional): Flash model variant (default: "gemini-2.5-flash")
- **GEMINI_BASE_URL** (optional): Custom API endpoint

### Available Models
- **gemini-2.5-pro**: Most capable model for complex tasks
- **gemini-2.5-flash**: Fastest model for quick responses
- **gemini-1.5-pro**: Previous generation pro model
- **gemini-1.5-flash**: Previous generation flash model

### References
- [Gemini MCP GitHub](https://github.com/aliargun/mcp-server-gemini)
- [Gemini MCP Setup Guide](https://skywork.ai/blog/how-to-set-up-gemini-mcp-server-claude-desktop-cli/)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

## Complete JSON Configuration

Here's the complete configuration snippet to add all four MCP servers to your `/root/.mcp.json` file:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": [
        "-y",
        "@stripe/mcp",
        "--tools=all",
        "--api-key=$STRIPE_API_KEY"
      ],
      "env": {
        "STRIPE_API_KEY": "sk_test_YOUR_STRIPE_SECRET_KEY_HERE"
      }
    },
    "neon": {
      "command": "npx",
      "args": [
        "-y",
        "@neondatabase/mcp-server-neon",
        "start",
        "$NEON_API_KEY"
      ],
      "env": {
        "NEON_API_KEY": "YOUR_NEON_API_KEY_HERE"
      }
    },
    "airtable": {
      "command": "npx",
      "args": [
        "-y",
        "airtable-mcp-server"
      ],
      "env": {
        "AIRTABLE_API_KEY": "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      }
    },
    "gemini": {
      "command": "npx",
      "args": [
        "-y",
        "github:aliargun/mcp-server-gemini"
      ],
      "env": {
        "GEMINI_API_KEY": "YOUR_GOOGLE_API_KEY_HERE"
      }
    }
  }
}
```

### Integration with Existing Configuration

If you already have MCP servers configured (like Fireflies, Vercel, HeyGen, Playwright), simply add these new entries to your existing `mcpServers` object:

```json
{
  "mcpServers": {
    "fireflies": {
      "command": "node",
      "args": ["/root/.claude/mcp-servers/fireflies-mcp/dist/index.js"],
      "env": {
        "FIREFLIES_API_KEY": "your-existing-key"
      }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@robinson_ai_systems/vercel-mcp"],
      "env": {
        "VERCEL_API_TOKEN": "your-existing-token"
      }
    },
    "heygen": {
      "command": "npx",
      "args": ["-y", "heygen-mcp-server"],
      "env": {
        "HEYGEN_API_KEY": "your-existing-key"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all", "--api-key=$STRIPE_API_KEY"],
      "env": {
        "STRIPE_API_KEY": "sk_test_YOUR_STRIPE_SECRET_KEY_HERE"
      }
    },
    "neon": {
      "command": "npx",
      "args": ["-y", "@neondatabase/mcp-server-neon", "start", "$NEON_API_KEY"],
      "env": {
        "NEON_API_KEY": "YOUR_NEON_API_KEY_HERE"
      }
    },
    "airtable": {
      "command": "npx",
      "args": ["-y", "airtable-mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      }
    },
    "gemini": {
      "command": "npx",
      "args": ["-y", "github:aliargun/mcp-server-gemini"],
      "env": {
        "GEMINI_API_KEY": "YOUR_GOOGLE_API_KEY_HERE"
      }
    }
  }
}
```

---

## Next Steps

1. **Obtain API Keys**: Follow the instructions for each service to get your API keys
2. **Update Configuration**: Replace the placeholder values in `/root/.mcp.json`
3. **Restart Claude Code**: Restart your Claude Code session to load the new MCP servers
4. **Test Integration**: Try asking Claude to interact with each service to verify the configuration

---

## Retrieving API Keys from Julian's Notion

According to your global configuration, you can search Julian's Notion database for credentials:

### Search Terms
- **Stripe**: "Stripe API key" or "Stripe credentials"
- **Neon**: "Neon API key" or "Neon credentials"
- **Airtable**: "Airtable API key" or "Airtable credentials"
- **Google Gemini**: "Gemini API key" or "Google API key"

### Notion Locations to Check
- **Notes & References database** - Category: "Login info"
- **API Keys notebook** (ID: 1bdc283b-4ad9-8050-9944-d59acadcc570)
- Project-specific pages

---

## Troubleshooting

### Common Issues

1. **Server Not Loading**
   - Check JSON syntax (no trailing commas)
   - Verify API keys are correct
   - Restart Claude Code

2. **Authentication Errors**
   - Verify API key format (check prefixes: `sk_` for Stripe, `pat` for Airtable)
   - Check API key permissions/scopes
   - Ensure keys haven't expired

3. **npx Command Fails**
   - Update Node.js to version 18 or higher
   - Clear npm cache: `npm cache clean --force`
   - Try reinstalling the package

4. **Permission Errors**
   - For Airtable: Verify token scopes
   - For Neon: Check API key permissions in console
   - For Stripe: Ensure using correct key (test vs. live)

### Debug Mode

Enable debug logging by setting environment variables:
```json
{
  "env": {
    "DEBUG": "*",
    "NODE_ENV": "development"
  }
}
```

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Rotate keys regularly**, especially after sharing or potential exposure
4. **Use test/sandbox keys** for development when available
5. **Limit API key permissions** to only what's necessary
6. **Monitor API usage** in service dashboards for unusual activity

---

## Resources & Documentation

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://www.anthropic.com/claude-code)
- [MCP Server Directory](https://github.com/modelcontextprotocol/servers)

---

**Last Updated**: December 12, 2025
**Configuration Version**: 1.0
