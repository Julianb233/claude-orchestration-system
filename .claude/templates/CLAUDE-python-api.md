# Project: [PROJECT_NAME]

## Tech Stack
- **Framework**: FastAPI
- **Language**: Python 3.12
- **Database**: PostgreSQL + SQLAlchemy
- **Cache**: Redis
- **Task Queue**: Celery (if applicable)
- **Deployment**: Docker / Railway / etc

## Key Directories
```
src/
├── api/           # API routes
├── core/          # Core configuration
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic schemas
├── services/      # Business logic
└── utils/         # Utility functions
```

## Commands
```bash
# Development
uvicorn main:app --reload

# Testing
pytest

# Linting
ruff check .
ruff format .

# Database migrations
alembic upgrade head
alembic revision --autogenerate -m "message"
```

## Environment Variables
- Copy `.env.example` to `.env`
- Fetch API keys from Notion using `/fetch-credentials`

## API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Important Files
- `main.py` - Application entrypoint
- `core/config.py` - Settings and configuration
- `core/database.py` - Database connection
- `requirements.txt` - Dependencies

## Notes
[Add project-specific notes here]
