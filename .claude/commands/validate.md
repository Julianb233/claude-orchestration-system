# /validate - E2E Testing Command

Run end-to-end tests to validate features work correctly in production.

## Usage

```bash
/validate                           # Auto-detect project URL
/validate https://piedrive.ai       # Test specific URL
/validate --debug                   # Use Browserbase for live view
/validate --no-record               # Skip video recording
/validate --screenshots-only        # Only take screenshots, no interaction tests
```

## What It Does

1. **Spawns e2e-tester agent** with Playwright MCP access
2. **Loads credentials** from Notion (Google App Password)
3. **Navigates to production URL** (auto-detected or specified)
4. **Runs tests**:
   - Visual validation (screenshots, element verification)
   - Functional tests (click-through, form submission)
5. **Records session** as video (unless --no-record)
6. **Generates report** with pass/fail status
7. **Stores results** in Claude Flow memory + commits to GitHub

## Auto-Trigger

This command runs automatically when:
- TodoWrite marks a feature/fix as "completed"
- Deployment succeeds (Vercel webhook)

## Output Location

Results stored in:
- Local: `/root/.claude-flow/test-results/{project}/{timestamp}/`
- Memory: `test-results` namespace in Claude Flow
- GitHub: `{project}/tests/e2e-results/` (summary only)

## Example Output

```
E2E Test: Dashboard Feature
Status: PASS
URL: https://piedrive.ai/dashboard
Duration: 12.3s

Visual: 4/4 checks passed
Functional: 3/3 tests passed

Screenshots:
  [1] Initial state
  [2] After login
  [3] Dashboard loaded
  [4] Feature verified

Recording: session.webm (2.1 MB)
```

## Shortcuts

| Shortcut | Command |
|----------|---------|
| `/v` | `/validate` |
| `/test` | `/validate` |

## Flags

| Flag | Description |
|------|-------------|
| `--debug` | Use Browserbase for live browser view |
| `--no-record` | Skip video recording |
| `--screenshots-only` | Only visual tests |
| `--full` | Complete test suite including edge cases |
| `--auth-only` | Only test authentication flow |
