# TodoApp

A full-stack example todo application with Vue 3 + Litestar.

## Tech Stack

**Frontend:** Vue 3, TypeScript, PrimeVue, Tailwind CSS, Pinia, Vite  
**Backend:** Python 3.13, Litestar, SQLAlchemy, PostgreSQL/SQLite

## Quick Start

**Prerequisites:** Bun 1.2+, uv

### Backend
```bash
cd app-backend
uv sync
uv run alembic upgrade head
uv run just api  # Starts on http://localhost:8000
```

### Frontend
```bash
cd app-frontend
bun install
bun dev  # Starts on http://localhost:5173
```

## Commands

**Backend:**
- `uv run just api` - Dev server
- `uv run just format` - Format code
- `uv run alembic upgrade head` - Run migrations

**Frontend:**
- `bun dev` - Dev server
- `bun run build` - Production build
- `bun run lint:fix` - Lint & fix / format code

## Configuration

**Backend** (`.env` in `app-backend/`):
```env
DATABASE_URL=sqlite:///todolist.sqlite3
CORS_ALLOWED_ORIGINS=["http://localhost:5173"]
```

**Frontend** (`.env` in `app-frontend/`):
```env
VITE_API_URL=http://localhost:8000
```

## API

- **Todos:** `/todolist/todos` (GET, POST, PATCH, DELETE)
- **Categories:** `/todolist/categories` (GET, POST, PATCH, DELETE)
- **Docs:** `http://localhost:8000/schema`