# Proactive Anticipation System

**CRITICAL: Anticipate Julian's next action and either DO IT or PRE-STAGE it for instant execution.**

## Philosophy: Think Ahead, Act Fast

Claude should always be thinking:
1. What will Julian likely want next?
2. Can I just do it automatically?
3. If not, can I have it ready to execute with one keystroke?

## Predictive Action Rules

| After This... | Predict This... | Action |
|---------------|-----------------|--------|
| Editing code | Run tests | Pre-stage: `npm test` |
| Tests pass | Commit changes | Pre-stage: `/g commit` |
| Commit succeeds | Push to remote | Pre-stage: `git push` |
| Push succeeds | Create PR | Pre-stage: `/g pr` |
| Fixing errors | Re-run build | Pre-stage: `npm run build` |
| Deployment | Check production | Pre-stage: `curl` health check |
| PR merged | Pull latest | Pre-stage: `git pull` |
| Session start | Load context | Auto-execute: `/c` |
| Entering project | Check state | Auto-execute: `/cf-recover` check |
| Task complete | Next task | Show next from todo list |

## Pre-Staged Commands Display

After completing any action, show suggested next steps:

```
✅ Tests passed (42/42)

**Next Actions:**
[1] git commit -m "feat: add user auth" ← Enter to run
[2] npm run build
[3] git push

Press number or Enter for [1]:
```

## Context-Aware Suggestions

**Based on file types being edited:**
| Files | Suggest |
|-------|---------|
| `*.test.ts` | Run that specific test file |
| `*.tsx` components | Run dev server, check browser |
| `api/*.ts` | Test API endpoint |
| `package.json` | Run npm install |
| `*.prisma` | Run prisma generate |
| `*.md` docs | Preview in editor |

**Based on git state:**
| State | Suggest |
|-------|---------|
| Uncommitted changes | Stage and commit |
| Ahead of remote | Push |
| Behind remote | Pull |
| On feature branch | Create PR |
| Merge conflicts | Show conflict files |

**Based on errors:**
| Error Type | Suggest |
|------------|---------|
| TypeScript error | Fix and re-check |
| Test failure | Fix and re-run that test |
| Build failure | Fix and re-build |
| Lint error | Auto-fix with eslint --fix |

## Efficiency Shortcuts

**Predictions:**
| Shortcut | What It Does |
|----------|--------------|
| `/n` | Show next predicted actions |
| `/y` | Execute recommended [1] action |
| `/1` `/2` `/3` | Execute numbered option |

**Git & Code:**
| Shortcut | What It Does |
|----------|--------------|
| `/st` | Git status (quick view) |
| `/diff` | Show changes |
| `/cm` | Smart commit (auto-message) |
| `/p` | Push to remote |
| `/pr` | Create pull request |
| `/new` | Create new branch |
| `/log` | Recent commit history |
| `/undo` | Undo last action (safe) |

**Build & Deploy:**
| Shortcut | What It Does |
|----------|--------------|
| `/b` | Build project |
| `/t` | Run tests |
| `/ok` | Run ALL checks (lint, types, test, build) |
| `/fix` | Auto-fix lint/format issues |
| `/d` | Deploy to production |
| `/serve` | Start dev server |

**Workflow:**
| Shortcut | What It Does |
|----------|--------------|
| `/done` | Ship it (check → commit → push → PR) |
| `/h` | View history |
| `/c` | Load project context |
| `/r` | Code review |

## Learning from Patterns

Store Julian's common sequences in Claude Flow:
```
mcp__claude-flow__memory_usage(
  action="store",
  namespace="patterns",
  key="common-sequences",
  value="{sequences array}"
)
```

Common sequences to learn:
- `edit → test → commit → push`
- `checkout branch → pull → edit → test`
- `deploy → check logs → verify`
