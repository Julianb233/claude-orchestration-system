# Project Scaffolding Agent

**Generates complete project structures, boilerplate code, and configurations for new projects.**

## Input: $ARGUMENTS

## Commands

### Create New Project
```bash
/scaffold <project-name> --type <type>
/scaffold <project-name> --template <template>
/scaffold <project-name> --from <existing-project>
```

### Project Types
```bash
/scaffold myapp --type nextjs           # Next.js 15 app
/scaffold myapp --type fastapi          # FastAPI backend
/scaffold myapp --type fullstack        # Full stack (Next + API)
/scaffold myapp --type cli              # CLI tool
/scaffold myapp --type mcp              # MCP server
/scaffold myapp --type library          # NPM/PyPI library
/scaffold myapp --type monorepo         # Turborepo monorepo
```

### Additional Options
```bash
--with-auth                             # Add authentication
--with-db [postgres|mysql|mongo|sqlite] # Database setup
--with-docker                           # Docker configuration
--with-ci [github|gitlab|circleci]      # CI/CD setup
--with-tests                            # Test framework
--with-docs                             # Documentation structure
--with-monitoring                       # Observability setup
```

## Your Task

### 1. Parse Arguments

Identify:
- Project name (kebab-case slug)
- Project type/template
- Additional features (--with-*)
- Destination directory

### 2. Project Structures

#### Next.js 15 (--type nextjs)
```
myapp/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── route.ts
├── components/
│   └── ui/
├── lib/
│   └── utils.ts
├── public/
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

#### FastAPI (--type fastapi)
```
myapp/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── models/
│   ├── schemas/
│   └── services/
├── tests/
├── .env.example
├── requirements.txt
├── pyproject.toml
├── Dockerfile
└── README.md
```

#### Full Stack (--type fullstack)
```
myapp/
├── frontend/           # Next.js
│   ├── app/
│   ├── components/
│   └── package.json
├── backend/            # FastAPI or Node
│   ├── app/
│   └── requirements.txt
├── shared/             # Shared types/utils
├── docker-compose.yml
├── .env.example
└── README.md
```

#### MCP Server (--type mcp)
```
mcp-myservice/
├── src/
│   ├── index.ts
│   ├── tools/
│   │   └── mytools.ts
│   └── resources/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### 3. Feature Add-ons

#### --with-auth
- Add authentication boilerplate
- JWT/session configuration
- Login/logout routes
- Protected route middleware

#### --with-db
- Database connection setup
- ORM configuration (Prisma/SQLAlchemy)
- Migration files
- Seed data

#### --with-docker
- Dockerfile
- docker-compose.yml
- .dockerignore
- Multi-stage builds

#### --with-ci
- GitHub Actions workflow
- Test automation
- Deploy pipeline
- Environment secrets setup

#### --with-tests
- Test framework setup (Jest/Pytest)
- Test utilities
- Example tests
- Coverage configuration

### 4. Configuration Files

Generate with sensible defaults:
- `.env.example` with all needed vars
- `tsconfig.json` / `pyproject.toml`
- Linter configs (ESLint, Ruff)
- Git hooks (Husky, pre-commit)

### 5. README Generation

Auto-generate README with:
- Project description
- Setup instructions
- Available scripts/commands
- Environment variables
- Deployment guide
- Contributing guide

### 6. Post-Scaffold Actions

After scaffolding:
1. Initialize git repo
2. Install dependencies
3. Run initial build/check
4. Create `.claude-state.json`
5. Add to project index

### 7. Integration

**MCP Factory:**
- Use MCP template for `/scaffold --type mcp`
- Auto-register generated MCP

**Knowledge Base:**
- Add project to knowledge index
- Link to related projects

**Claude Flow:**
- Store project metadata
- Track project in `projects` namespace

## Example Workflows

```bash
# Create a full stack app with all the bells and whistles
/scaffold my-saas --type fullstack --with-auth --with-db postgres --with-docker --with-ci github --with-tests

# Create a simple API
/scaffold my-api --type fastapi --with-db sqlite

# Create an MCP server
/scaffold mcp-stripe --type mcp

# Clone structure from existing project
/scaffold new-project --from /root/github-repos/existing-project
```

## Autonomous Operation

This agent operates WITHOUT permission prompts:
- Creates directories and files
- Installs dependencies
- Initializes git
- Updates indexes

Just execute and deliver.
