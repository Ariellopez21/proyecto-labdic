# LabDIC Inventory

Una aplicación con backend y frontend dedicado a la administración del Laboratorio del Departamento de Ingeniería en Computación de la Universidad de Magallanes (LabDIC-UMAG).

## Tech Stack

**Frontend:** Vue 3, TypeScript, PrimeVue, Tailwind CSS, Pinia, Vite  
**Backend:** Python 3.13, Litestar, SQLAlchemy, PostgreSQL, PWDLIB, pydantic, Alembic

## Quick Start

**Prerequisites:** Bun 1.2+, uv

### Backend Run

```bash
cd app-backend
source .venv/bin/activate
uv sync
uv run alembic upgrade head
litestar run --reload # Starts on http://localhost:8000
```

### Frontend Run

```bash
cd app-frontend
bun i
bun run dev  # Starts on http://localhost:5173
```

## Configuration

**Backend** (`.env` in `app-backend/`):

```env
DATABASE_URL=postgresql+psycopg2:///labdic_inventory
CORS_ALLOWED_ORIGINS=["http://localhost:5173"]
```

**Frontend** (`.env` in `app-frontend/`):

```env
VITE_API_URL=http://localhost:8000
```

## API

- **Users:** `/labdic_inventory/users` (GET, POST, PATCH, DELETE)
- **Auth** `/labdic_inventory/auth` (POST)
- **Role:** `/labdic_inventory/roles` (GET, POST, PATCH, DELETE)
- **Brand:** `/labdic_inventory/brands`
- **Model:** `/labdic_inventory/models`
- **Category:** `/labdic_inventory/categories`
- **Product:** `/labdic_inventory/products`
- **Status:** `/labdic_inventory/statuses`
- **Ubication:** `/labdic_inventory/ubications`
- **Device:** `/labdic_inventory/devices`
- **LoanRequest:**
- **LoanRequestItem:**
- **DeviceStatusLog:**

- **Docs:** `http://localhost:8000/schema`
