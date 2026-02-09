# Test Watch & Fix

Run tests, monitor results, and auto-fix failures.

## Arguments
$ARGUMENTS - Optional: specific test file or pattern to watch

## Instructions

1. **Detect test framework:**
   - Node: Look for jest, vitest, mocha in package.json
   - Python: pytest, unittest
   - Rust: cargo test
   - Go: go test

2. **Run tests:**
   ```bash
   # Node/npm
   npm test -- --watchAll=false

   # Python
   pytest -v

   # Rust
   cargo test

   # Go
   go test ./...
   ```

3. **Parse results and categorize:**
   - ✅ Passing tests
   - ❌ Failing tests (with error details)
   - ⏭️ Skipped tests

4. **For each failure:**
   - Read the failing test file
   - Read the source file being tested
   - Analyze the error message
   - Determine if it's a test bug or source bug

5. **Auto-fix mode:**
   - Ask: "Found {N} failing tests. Auto-fix?"
   - If yes, spawn debugger agent to fix each failure
   - Re-run tests after each fix
   - Continue until all pass or user stops

6. **Store results in memory:**
   ```
   mcp__claude-flow__memory_usage(
     action="store",
     namespace="results",
     key="test-run_{project}_{timestamp}",
     value="{pass_count}/{total} passed, failures: [...]"
   )
   ```

7. **Output:**
   ```
   ## Test Results: {project}

   ✅ {pass_count} passed
   ❌ {fail_count} failed
   ⏭️ {skip_count} skipped

   ### Failures
   1. {test_name} - {brief error}
      → Suggested fix: {suggestion}

   **Action:** [Fix All] [Fix One-by-One] [Skip]
   ```
