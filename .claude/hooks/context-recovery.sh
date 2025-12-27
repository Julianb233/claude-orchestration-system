#!/bin/bash
# Bubba's Auto-Recovery Hook
# Triggered when context compaction fails
# Restores swarm state and re-initializes session

set -e

RECOVERY_NAMESPACE="recovery"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_FILE="/root/.claude/logs/recovery-$(date +%Y%m%d).log"

log() {
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1" >> "$LOG_FILE"
}

mkdir -p /root/.claude/logs

log "Recovery hook triggered"

# Check if this is a compaction failure
if [ "$1" = "compaction_failed" ]; then
    log "Compaction failure detected - initiating recovery"

    # Store current terminal info
    TERMINAL_ID="${TERMINAL:-T0}"

    # Create recovery prompt file
    cat > /tmp/bubba-recovery-prompt.txt << 'EOF'
Bubba, I'm back - auto-recovery activated.

Recovery Context:
- Previous session experienced context compaction failure
- Swarm state should be restored from memory namespace "recovery"
- Check for any interrupted tasks in "agents" namespace
- Resume work on active projects: PieDrive-AI, better-together-live

Actions to take:
1. Retrieve swarm state from mcp__claude-flow__memory_usage(action="retrieve", namespace="recovery", key="swarm-checkpoint")
2. Check agent statuses in mcp__claude-flow__memory_search(pattern="*-status", namespace="agents")
3. Restore any file locks that were active
4. Continue where we left off
EOF

    log "Recovery prompt created at /tmp/bubba-recovery-prompt.txt"

    # Signal to Claude Code that recovery is needed
    # This creates a marker file that the session startup can detect
    echo "{\"recovery_needed\": true, \"timestamp\": \"$TIMESTAMP\", \"terminal\": \"$TERMINAL_ID\"}" > /root/.claude/.recovery-pending

    log "Recovery marker created - session will auto-restore on next start"

    exit 0
fi

# If called with "checkpoint" argument, create a checkpoint
if [ "$1" = "checkpoint" ]; then
    log "Creating checkpoint"
    # The actual checkpoint is done via Claude Flow memory, this just logs it
    echo "{\"checkpoint_created\": true, \"timestamp\": \"$TIMESTAMP\"}"
    exit 0
fi

log "Hook called with unknown argument: $1"
exit 1
