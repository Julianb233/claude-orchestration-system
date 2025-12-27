#!/bin/bash
# Claude Flow Workflow Checkpoint Script
# Saves current workflow state for recovery after connection loss

RECOVERY_DIR="/root/.claude-flow/recovery"
STATE_FILE="$RECOVERY_DIR/workflow-state.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Function to save checkpoint
save_checkpoint() {
    local workflow_id="$1"
    local task_description="$2"
    local current_step="$3"
    local context="$4"

    # Create checkpoint entry
    local checkpoint=$(cat <<EOF
{
  "id": "checkpoint_$(date +%s)",
  "workflowId": "$workflow_id",
  "task": "$task_description",
  "currentStep": "$current_step",
  "context": "$context",
  "timestamp": "$TIMESTAMP"
}
EOF
)

    # Append to checkpoints file
    echo "$checkpoint" >> "$RECOVERY_DIR/checkpoints.jsonl"
    echo "Checkpoint saved: $workflow_id at step $current_step"
}

# Function to list recent checkpoints
list_checkpoints() {
    if [ -f "$RECOVERY_DIR/checkpoints.jsonl" ]; then
        echo "Recent checkpoints:"
        tail -10 "$RECOVERY_DIR/checkpoints.jsonl" | jq -r '.workflowId + " | " + .task + " | " + .timestamp'
    else
        echo "No checkpoints found"
    fi
}

# Function to get latest checkpoint for a workflow
get_latest() {
    local workflow_id="$1"
    if [ -f "$RECOVERY_DIR/checkpoints.jsonl" ]; then
        grep "\"workflowId\": \"$workflow_id\"" "$RECOVERY_DIR/checkpoints.jsonl" | tail -1
    fi
}

# Main
case "$1" in
    save)
        save_checkpoint "$2" "$3" "$4" "$5"
        ;;
    list)
        list_checkpoints
        ;;
    get)
        get_latest "$2"
        ;;
    *)
        echo "Usage: checkpoint.sh [save|list|get] [args...]"
        echo "  save <workflow_id> <task> <step> <context>"
        echo "  list"
        echo "  get <workflow_id>"
        ;;
esac
