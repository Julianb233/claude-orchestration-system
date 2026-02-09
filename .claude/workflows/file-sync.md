# Agent File Sync System

**Multi-agent coordination for keeping related files in sync when changes occur.**

## Architecture Overview

```
┌─────────────────────────┐     ┌─────────────────────────┐
│   File Watcher Agent    │     │      Claude Code        │
│  (efficiency expert)    │     │     (main agent)        │
│                         │     │                         │
│  - Knows file structure │     │  - Receives sync alerts │
│  - Detects changes      │     │  - Updates related docs │
│  - Sends notifications  │     │  - Runs sync commands   │
└───────────┬─────────────┘     └───────────┬─────────────┘
            │                               │
            │    Claude Flow Memory         │
            │    namespace: "sync"          │
            └───────────┬───────────────────┘
                        │
            ┌───────────▼───────────┐
            │   Notification Queue  │
            │ /root/.claude-flow/   │
            │   sync/pending-*.jsonl│
            └───────────────────────┘
```

## How It Works

1. **File Watcher Agent** monitors directories for changes
2. When a file changes, it checks `/root/.claude-flow/file-relations.json`
3. If relations exist, it creates a sync notification
4. **Claude Code** receives notification on session start or via `/sync`
5. Related documents are updated (manually or via command)

## File Relations Configuration

Edit `/root/.claude-flow/file-relations.json` to define relationships:

```json
{
  "relations": {
    "patterns": [
      {
        "source": "api/**/*.ts",
        "targets": ["docs/api.md", "README.md"],
        "action": "update-api-docs",
        "priority": "normal"
      }
    ]
  }
}
```

## Predefined Relations

| Source Pattern | Targets | Action |
|----------------|---------|--------|
| `api/**/*.ts` | docs/api.md, README.md | Notify for doc update |
| `.claude/CLAUDE.md` | workflow docs | Sync workflow docs |
| `**/schema.prisma` | types.ts, generated/ | Run `prisma generate` |
| `package.json` | lock files | Run `npm install` |
| `.env` | .env.example, docs | Update env docs |

## Commands

| Command | What It Does |
|---------|--------------|
| `/sync` or `/s` | Check & process pending sync notifications |
| `file-watcher-agent.sh watch <dir>` | Start watching a directory |
| `file-watcher-agent.sh check` | Check pending updates |
| `agent-notify.sh send <target> <type> <msg>` | Send notification to agent |
| `agent-notify.sh check main` | Check main agent's inbox |

## Notification Protocol

Agents communicate via `/root/.claude-flow/notifications/`:

```bash
# Send notification from one agent to another
/root/scripts/agent-notify.sh send main file_change "API updated, docs need sync" high

# Check notifications
/root/scripts/agent-notify.sh check main

# Acknowledge processed notification
/root/scripts/agent-notify.sh ack notif_1234567890
```

## Priority Levels

| Priority | Behavior |
|----------|----------|
| `critical` | Auto-process, blocks other work |
| `high` | Process before other tasks |
| `normal` | Process when convenient |
| `low` | Informational only |
