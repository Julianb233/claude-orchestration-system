# Push

Push current branch to remote.

```bash
git push
```

If branch has no upstream, use:
```bash
git push -u origin $(git rev-parse --abbrev-ref HEAD)
```

After push, suggest creating PR if on feature branch.
