# Undo

Undo last action (with safety).

Options:
1. Unstage files: `git reset HEAD`
2. Undo last commit (keep changes): `git reset --soft HEAD~1`
3. Discard all changes: `git checkout .` (asks for confirmation)

Show options and ask which to do.
