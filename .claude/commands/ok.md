# All Checks

Run all checks: lint, type-check, test, build.

```bash
npm run lint 2>/dev/null || echo "No lint script"
npm run typecheck 2>/dev/null || npm run type-check 2>/dev/null || echo "No typecheck"
npm test
npm run build
```

Show summary:
```
✅ Lint passed
✅ Types passed
✅ Tests passed (42/42)
✅ Build passed

All checks passed! Ready to commit/deploy.
```

If any fail, show which and offer to fix.
