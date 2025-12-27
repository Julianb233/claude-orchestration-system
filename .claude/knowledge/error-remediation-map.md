# Error Remediation Map

**Quick fixes for 35+ common error patterns. Load this when errors are detected.**

---

## TypeScript/JavaScript Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `TS\d{4}` | TypeScript compiler error | Run `tsc --noEmit` to see all errors, fix types |
| `Type '.*' is not assignable` | Type mismatch | Check expected type, add type assertion or fix data |
| `Cannot find module` | Missing import | Check path, run `npm install` |
| `Property '.*' does not exist` | Missing property | Add property to type or check spelling |
| `Object is possibly 'undefined'` | Null safety | Add optional chaining `?.` or null check |
| `Argument of type '.*' is not assignable` | Function param mismatch | Check function signature |
| `No overload matches this call` | Wrong function usage | Check function overloads and params |
| `JSX element type '.*' does not have any construct` | Invalid React component | Check component export/import |

### TypeScript Quick Commands
```bash
# Check all errors
tsc --noEmit

# Watch mode
tsc --noEmit --watch

# Generate types only
tsc --declaration --emitDeclarationOnly
```

---

## Node.js/Runtime Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `ENOENT` | File not found | Check file path, ensure file exists |
| `EACCES` | Permission denied | Check file permissions, use sudo if needed |
| `EADDRINUSE` | Port already in use | Kill process on port or use different port |
| `ECONNREFUSED` | Connection refused | Check if server is running |
| `ETIMEDOUT` | Connection timeout | Check network, increase timeout |
| `ERR_MODULE_NOT_FOUND` | ES module not found | Check import path and file extension |
| `SyntaxError: Cannot use import` | ES modules in CommonJS | Add `"type": "module"` to package.json |
| `ReferenceError: .* is not defined` | Undefined variable | Check variable scope and imports |
| `TypeError: .* is not a function` | Invalid function call | Check object type and method name |

### Node.js Quick Commands
```bash
# Find process on port
lsof -i :3000
netstat -tulpn | grep 3000

# Kill process on port
kill -9 $(lsof -t -i:3000)

# Check Node version
node --version
```

---

## Test Failures

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `FAIL.*\.test\.` | Jest test failure | Run failing test in isolation |
| `AssertionError` | Assertion failed | Check expected vs actual values |
| `Timeout - Async callback` | Test timeout | Increase timeout or fix async issue |
| `Cannot find module.*test` | Test file not found | Check test file path |
| `describe is not defined` | Jest not configured | Check jest config |
| `expect.*toBe` | Matcher failure | Compare actual output |

### Test Quick Commands
```bash
# Run single test file
npm test -- path/to/test.spec.ts

# Run tests matching pattern
npm test -- -t "pattern"

# Run with verbose output
npm test -- --verbose

# Update snapshots
npm test -- -u
```

---

## Database Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `Prisma\|Drizzle` | ORM error | Check schema, run migrations |
| `relation ".*" does not exist` | Missing table | Run migrations |
| `duplicate key value violates unique` | Unique constraint | Check for existing data |
| `invalid input syntax for type` | Type mismatch | Check column types |
| `connection refused` | DB not running | Start database server |
| `FATAL: password authentication failed` | Auth error | Check credentials |
| `SQLITE_BUSY` | Database locked | Close other connections |

### Database Quick Commands
```bash
# Prisma
npx prisma db push
npx prisma migrate dev
npx prisma generate

# Drizzle
npx drizzle-kit push:pg
npx drizzle-kit generate:pg

# Check PostgreSQL
pg_isready
psql -l
```

---

## Build/Bundler Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `Module not found` | Missing dependency | Run `npm install` |
| `Cannot resolve` | Import resolution fail | Check path aliases |
| `Unexpected token` | Syntax error | Check file syntax |
| `Maximum call stack` | Infinite loop/recursion | Check circular dependencies |
| `out of memory` | Memory limit | Increase Node memory |
| `ENOMEM` | System memory | Free up RAM |

### Build Quick Commands
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
rm -rf .next
npm run build

# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Check for circular deps
npx madge --circular src/
```

---

## Git Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `fatal: not a git repository` | Not in git repo | Run `git init` or cd to repo |
| `CONFLICT` | Merge conflict | Resolve conflicts, then `git add` |
| `Updates were rejected` | Remote has changes | Pull first: `git pull --rebase` |
| `Permission denied (publickey)` | SSH key issue | Check SSH key setup |
| `fatal: refusing to merge unrelated` | Unrelated histories | Add `--allow-unrelated-histories` |
| `fatal: pathspec '.*' did not match` | File not found | Check file path |

### Git Quick Commands
```bash
# Abort merge
git merge --abort

# Resolve conflicts
git mergetool

# Reset to remote
git fetch origin
git reset --hard origin/main

# Fix SSH
ssh-add ~/.ssh/id_rsa
```

---

## API/Network Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `429 Too Many Requests` | Rate limited | Wait and retry, implement backoff |
| `401 Unauthorized` | Auth failed | Check API key/token |
| `403 Forbidden` | Access denied | Check permissions |
| `404 Not Found` | Resource missing | Check URL/endpoint |
| `500 Internal Server Error` | Server error | Check server logs |
| `CORS` | Cross-origin blocked | Add CORS headers |
| `NetworkError` | Network issue | Check connectivity |
| `AbortError` | Request aborted | Check timeout settings |

### API Quick Commands
```bash
# Test endpoint
curl -I https://api.example.com/health

# Check with auth
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/

# Debug CORS
curl -I -X OPTIONS https://api.example.com/
```

---

## React/Frontend Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `Invalid hook call` | Hook rules violation | Check hooks are in function components |
| `Cannot update.*unmounted` | Memory leak | Cancel async in useEffect cleanup |
| `Each child.*unique "key"` | Missing key prop | Add unique key to list items |
| `Too many re-renders` | Infinite render loop | Check setState in render |
| `Hydration failed` | SSR mismatch | Check server/client render match |
| `Module parse failed` | Import error | Check file format/loader |

### React Quick Commands
```bash
# Clear Next.js cache
rm -rf .next

# Check for issues
npx eslint src/ --fix

# Update React
npm update react react-dom
```

---

## Docker/Container Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `no space left on device` | Disk full | Run `docker system prune` |
| `port is already allocated` | Port conflict | Change port or kill process |
| `cannot connect to Docker daemon` | Docker not running | Start Docker service |
| `image not found` | Missing image | Run `docker pull` |
| `permission denied` | Docker permissions | Add user to docker group |

### Docker Quick Commands
```bash
# Clean up
docker system prune -a
docker volume prune

# Check status
docker ps -a
docker images

# Restart
sudo systemctl restart docker
```

---

## Environment/Config Errors

| Pattern | Description | Quick Fix |
|---------|-------------|-----------|
| `Missing environment variable` | Env not set | Add to .env file |
| `Invalid JSON` | JSON parse error | Validate JSON syntax |
| `YAML.*error` | YAML syntax error | Check indentation |
| `Config validation failed` | Invalid config | Check config schema |

### Environment Quick Commands
```bash
# Check env
printenv | grep VAR_NAME

# Source env file
source .env

# Validate JSON
cat config.json | jq .

# Validate YAML
yamllint config.yaml
```

---

## Quick Lookup Table

| Error Contains | Likely Agent | Load Workflow |
|----------------|--------------|---------------|
| `TS\d{4}` | Tyler-TypeScript | - |
| `FAIL.*test` | Tessa-Tester | - |
| `Prisma\|Drizzle` | Dana-Database | julian-stack.md#database |
| `ENOENT\|EACCES` | Diana-Debugger | - |
| `429\|401\|403` | - | rate-limit-handler.md |
| `git.*fatal` | - | - |
| `docker` | Kirk-Kubernetes | - |
| `CORS` | Adam-API | - |

---

## Error Response Protocol

1. **Match error** against patterns above
2. **Try quick fix** first
3. **If still failing**, spawn appropriate agent:
   - TypeScript → Tyler-TypeScript
   - Tests → Tessa-Tester
   - Database → Dana-Database
   - General debug → Diana-Debugger
4. **Log error** to recovery namespace for learning
