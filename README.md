# Claude Code Orchestration System

A comprehensive AI agent orchestration framework for Claude Code featuring 115+ specialized agents, 25 workflows, and deep Claude Flow integration.

## Features

- **115+ Specialized Agents**: From Bubba (autonomous orchestrator) to Tyler (TypeScript), Rex (reviewer), and more
- **25 Automation Workflows**: Session startup, recovery, night shift, hive coordination
- **200+ Custom Commands**: Quick actions for common tasks
- **Multi-Terminal Coordination**: Agents share state via Claude Flow memory namespaces
- **Board of Advisors**: Business frameworks from Alex Hormozi, Russell Brunson, Dan Martell

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Julianb233/claude-orchestration-system.git

# Run the installer
cd claude-orchestration-system
chmod +x install.sh
./install.sh
```

## Setup Instructions

1. **Clone and Install**
   ```bash
   git clone https://github.com/Julianb233/claude-orchestration-system.git
   cd claude-orchestration-system
   ./install.sh
   ```

2. **Configure Credentials**
   Edit `~/.claude/.credentials.json` with your API keys:
   ```json
   {
     "notion": { "token": "YOUR_NOTION_TOKEN" },
     "github": { "token": "YOUR_GITHUB_TOKEN" }
   }
   ```

3. **Configure Local Settings**
   Edit `~/.claude/settings.local.json` with your preferences.

4. **Restart Claude Code**
   The system will auto-load on next session.

## Agent Tiers

| Tier | Agents | Purpose |
|------|--------|---------|
| 0 | Bubba | Autonomous orchestration (set & forget) |
| 1 | Marcus, Tyler, Rex, Diana, Archie | Core development |
| 2 | Tessa, Petra, Helena, Sage, Otto | Quality & operations |
| 3 | Peter, Dana, Fiona, Adam, Kirk | Specialized development |
| 4 | Morgan, Sophie, Scarlett, Gina, Bella | Business & content |

## Key Commands

| Command | Description |
|---------|-------------|
| `/bubba` | Invoke autonomous orchestrator |
| `/st` | Status check |
| `/r` | Quick code review |
| `/cm` | Smart commit |
| `/pr` | Create pull request |
| `/night-shift` | 8-hour autonomous mode |

## Directory Structure

```
~/.claude/
├── CLAUDE.md           # Main configuration
├── agents/             # 115 specialized agents
├── workflows/          # 25 automation workflows
├── knowledge/          # 35+ knowledge bases
├── commands/           # 200+ custom commands
├── config/             # Configuration files
├── templates/          # Reusable templates
└── functions/          # Helper functions

~/.claude-flow/
├── context-loading/    # Auto-loading triggers
├── mcp-factory/        # MCP server configs
└── sync/               # Sync configurations
```

## Requirements

- Claude Code CLI
- Claude Flow MCP server (optional, for advanced features)
- GitHub CLI (authenticated)
- Node.js 18+

## Updating

Pull the latest changes:
```bash
cd ~/.claude
git pull origin main
```

## License

MIT License

---

Created by Julian @ AI Acrobatics
