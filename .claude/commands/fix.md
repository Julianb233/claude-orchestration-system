# Auto-Fix

Run auto-fix for lint and formatting issues.

```bash
npm run lint:fix 2>/dev/null || npx eslint --fix . 2>/dev/null
npm run format 2>/dev/null || npx prettier --write . 2>/dev/null
```

Show what was fixed and suggest committing the fixes.
