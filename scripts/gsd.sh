#!/bin/bash
# GSD Loop - Ralph-style autonomous agent loop for Get Shit Done framework
# Usage: ./gsd.sh [max_iterations] [--skip-tests]
#
# Each iteration spawns a FRESH Claude Code instance with clean context.
# Memory persists via: STATE.md, ROADMAP.md, PLAN/SUMMARY files, git history
#
# Based on Ralph pattern: https://github.com/snarktank/ralph
# Integrated with GSD: https://github.com/[your-repo]/get-shit-done

set -e

# Parse arguments
MAX_ITERATIONS=50
SKIP_TESTS=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    --help|-h)
      echo "GSD Loop - Autonomous Get Shit Done"
      echo ""
      echo "Usage: ./gsd.sh [max_iterations] [--skip-tests]"
      echo ""
      echo "Options:"
      echo "  max_iterations    Maximum loop iterations (default: 50)"
      echo "  --skip-tests      Skip running tests after each iteration"
      echo "  --help, -h        Show this help"
      echo ""
      echo "The loop will:"
      echo "  1. Spawn fresh Claude Code instances (clean context)"
      echo "  2. Run /gsd:progress to determine next action"
      echo "  3. Execute that action"
      echo "  4. Run tests (unless --skip-tests)"
      echo "  5. Repeat until milestone complete or max iterations"
      exit 0
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

# Find project root (look for .planning directory)
find_project_root() {
  local dir="$PWD"
  while [[ "$dir" != "/" ]]; do
    if [[ -d "$dir/.planning" ]]; then
      echo "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  echo "$PWD"
}

PROJECT_ROOT=$(find_project_root)
PLANNING_DIR="$PROJECT_ROOT/.planning"
STATE_FILE="$PLANNING_DIR/STATE.md"
GSD_LOG="$PLANNING_DIR/gsd-loop.log"
HANDOFF_FILE="$PLANNING_DIR/handoff.md"

cd "$PROJECT_ROOT"

# Check for .planning directory
if [[ ! -d "$PLANNING_DIR" ]]; then
  echo "Error: No .planning directory found."
  echo "Run /gsd:new-project first to initialize a GSD project."
  exit 1
fi

# Initialize log
echo "# GSD Loop Log" > "$GSD_LOG"
echo "Started: $(date)" >> "$GSD_LOG"
echo "Max iterations: $MAX_ITERATIONS" >> "$GSD_LOG"
echo "Skip tests: $SKIP_TESTS" >> "$GSD_LOG"
echo "Project: $PROJECT_ROOT" >> "$GSD_LOG"
echo "---" >> "$GSD_LOG"

echo ""
echo "=============================================="
echo "  GSD Loop - Autonomous Get Shit Done"
echo "=============================================="
echo "  Max iterations: $MAX_ITERATIONS"
echo "  Skip tests: $SKIP_TESTS"
echo "  Project: $PROJECT_ROOT"
echo "=============================================="
echo ""

# Function to extract next command from output
extract_next_command() {
  local output="$1"

  # Try to extract from <gsd-next> tag first (from /gsd:11 command)
  local next_cmd=$(echo "$output" | grep -oP '(?<=<gsd-next>).*(?=</gsd-next>)' | head -1)

  if [[ -n "$next_cmd" ]]; then
    echo "$next_cmd"
    return
  fi

  # Try to extract /gsd: commands from output
  next_cmd=$(echo "$output" | grep -oP '/gsd:(execute-plan|plan-phase|complete-milestone|verify-work)[^\`\n]*' | head -1)

  if [[ -n "$next_cmd" ]]; then
    echo "$next_cmd"
    return
  fi

  # Default to progress check
  echo "/gsd:progress"
}

# Function to run tests
run_tests() {
  if [[ "$SKIP_TESTS" == true ]]; then
    echo "Skipping tests (--skip-tests flag)"
    return 0
  fi

  echo ""
  echo "--- Running test feedback loop ---"

  local test_failed=false

  if [[ -f "$PROJECT_ROOT/package.json" ]]; then
    # Run typecheck first (faster feedback)
    if grep -qE '"(typecheck|type-check)"' "$PROJECT_ROOT/package.json"; then
      echo "Running: npm run typecheck"
      if ! npm run typecheck 2>&1 | tail -20; then
        echo "⚠ Typecheck failed"
        test_failed=true
      fi
    fi

    # Run tests
    if grep -q '"test"' "$PROJECT_ROOT/package.json"; then
      echo "Running: npm test"
      if ! npm test 2>&1 | tail -30; then
        echo "⚠ Tests failed"
        test_failed=true
      fi
    fi
  fi

  # Python projects
  if [[ -f "$PROJECT_ROOT/pyproject.toml" ]] || [[ -f "$PROJECT_ROOT/setup.py" ]]; then
    if command -v pytest &> /dev/null; then
      echo "Running: pytest"
      if ! pytest 2>&1 | tail -30; then
        echo "⚠ Tests failed"
        test_failed=true
      fi
    fi
  fi

  if [[ "$test_failed" == true ]]; then
    echo "--- Tests had failures ---"
    return 1
  fi

  echo "--- Tests passed ---"
  return 0
}

# Main loop
for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  GSD Iteration $i of $MAX_ITERATIONS"
  echo "  $(date '+%Y-%m-%d %H:%M:%S')"
  echo "==============================================================="

  # Log iteration start
  echo "" >> "$GSD_LOG"
  echo "## Iteration $i - $(date '+%Y-%m-%d %H:%M:%S')" >> "$GSD_LOG"

  # Determine what command to run
  COMMAND="/gsd:progress"

  # Check for handoff file with next command
  if [[ -f "$HANDOFF_FILE" ]]; then
    HANDOFF_CMD=$(grep -A1 "## Next Command" "$HANDOFF_FILE" 2>/dev/null | tail -1 | tr -d '`' | xargs)
    if [[ -n "$HANDOFF_CMD" && "$HANDOFF_CMD" == /gsd:* ]]; then
      COMMAND="$HANDOFF_CMD"
      rm -f "$HANDOFF_FILE"  # Clean up handoff after reading
      echo "Using command from handoff: $COMMAND"
    fi
  fi

  echo "Running: $COMMAND"
  echo "Command: $COMMAND" >> "$GSD_LOG"

  # Run Claude Code with the determined command
  # --dangerously-skip-permissions for autonomous operation
  # --print for capturing output
  OUTPUT=$(claude --dangerously-skip-permissions --print "$COMMAND" 2>&1 | tee /dev/stderr) || true

  # Log output summary (first 500 chars)
  echo "Output summary: ${OUTPUT:0:500}..." >> "$GSD_LOG"

  # Check for completion signals
  if echo "$OUTPUT" | grep -qiE "milestone.*complete|all phases complete|<gsd>COMPLETE</gsd>|🎉.*Milestone Complete"; then
    echo "" >> "$GSD_LOG"
    echo "COMPLETED at iteration $i" >> "$GSD_LOG"

    echo ""
    echo "=============================================="
    echo "  GSD COMPLETE!"
    echo "  Finished at iteration $i of $MAX_ITERATIONS"
    echo "=============================================="
    exit 0
  fi

  # Check for blocked/error states
  if echo "$OUTPUT" | grep -qi "blocked\|fatal error\|cannot proceed"; then
    echo "" >> "$GSD_LOG"
    echo "BLOCKED at iteration $i - manual intervention needed" >> "$GSD_LOG"

    echo ""
    echo "=============================================="
    echo "  GSD BLOCKED - Manual intervention needed"
    echo "  Check STATE.md and logs for details"
    echo "=============================================="
    exit 2
  fi

  # Run tests after execution (feedback loop)
  if ! run_tests; then
    echo "Tests failed - next iteration will address"
    echo "Test failure at iteration $i" >> "$GSD_LOG"
  fi

  # Extract next command for logging
  NEXT_CMD=$(extract_next_command "$OUTPUT")
  echo "Next likely command: $NEXT_CMD" >> "$GSD_LOG"

  echo ""
  echo "Iteration $i complete. Sleeping 3s before next iteration..."
  sleep 3
done

echo "" >> "$GSD_LOG"
echo "REACHED MAX ITERATIONS ($MAX_ITERATIONS)" >> "$GSD_LOG"

echo ""
echo "=============================================="
echo "  GSD reached max iterations ($MAX_ITERATIONS)"
echo "  Check $STATE_FILE for current status"
echo "=============================================="
exit 1
