#!/bin/bash
set -e

echo "=== Claude Orchestration System Installer ==="
echo ""

# Determine target directories
TARGET="${HOME}/.claude"
FLOW_TARGET="${HOME}/.claude-flow"

# Backup existing config if present
if [ -d "$TARGET" ]; then
    BACKUP_NAME="${TARGET}.backup.$(date +%Y%m%d%H%M%S)"
    echo "Backing up existing .claude to $BACKUP_NAME"
    mv "$TARGET" "$BACKUP_NAME"
fi

if [ -d "$FLOW_TARGET" ]; then
    BACKUP_NAME="${FLOW_TARGET}.backup.$(date +%Y%m%d%H%M%S)"
    echo "Backing up existing .claude-flow to $BACKUP_NAME"
    mv "$FLOW_TARGET" "$BACKUP_NAME"
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copy configuration
echo "Installing .claude configuration..."
cp -r "$SCRIPT_DIR/.claude" "$TARGET"

echo "Installing .claude-flow configuration..."
cp -r "$SCRIPT_DIR/.claude-flow" "$FLOW_TARGET"

# Create required runtime directories
echo "Creating runtime directories..."
mkdir -p "$TARGET/debug"
mkdir -p "$TARGET/session-env"
mkdir -p "$TARGET/todos"
mkdir -p "$TARGET/projects"
mkdir -p "$TARGET/plans"
mkdir -p "$TARGET/file-history"
mkdir -p "$TARGET/shell-snapshots"
mkdir -p "$FLOW_TARGET/workers"
mkdir -p "$FLOW_TARGET/logs"
mkdir -p "$FLOW_TARGET/hive"

# Create credential templates if they don't exist
if [ ! -f "$TARGET/.credentials.json" ]; then
    echo "Creating .credentials.json template..."
    cat > "$TARGET/.credentials.json" << 'CRED_EOF'
{
  "notion": {
    "token": "YOUR_NOTION_TOKEN",
    "database_id": "YOUR_DATABASE_ID"
  },
  "github": {
    "token": "YOUR_GITHUB_TOKEN"
  },
  "slack": {
    "webhook_url": "YOUR_SLACK_WEBHOOK"
  },
  "email": {
    "smtp_host": "smtp.gmail.com",
    "smtp_user": "YOUR_EMAIL",
    "smtp_pass": "YOUR_APP_PASSWORD"
  }
}
CRED_EOF
    echo "  >>> Edit ~/.claude/.credentials.json with your API keys <<<"
fi

# Create local settings if they don't exist
if [ ! -f "$TARGET/settings.local.json" ]; then
    echo "Creating settings.local.json template..."
    cat > "$TARGET/settings.local.json" << 'SETTINGS_EOF'
{
  "user": {
    "name": "Your Name",
    "email": "your@email.com"
  },
  "notifications": {
    "email": "your@email.com",
    "slack_channel": "#your-channel"
  },
  "paths": {
    "repos": "/path/to/your/repos"
  }
}
SETTINGS_EOF
    echo "  >>> Edit ~/.claude/settings.local.json with your preferences <<<"
fi

echo ""
echo "=== Installation Complete ==="
echo ""
echo "Next steps:"
echo "1. Edit ~/.claude/.credentials.json with your API keys"
echo "2. Edit ~/.claude/settings.local.json with your preferences"
echo "3. Restart Claude Code"
echo ""
echo "Quick test: Run 'claude' and type '/st' for status"
echo ""
echo "Enjoy! - Bubba"
