# LabDIC — Plataforma de Gestión de Inventario

Plataforma web para la gestión de inventario y préstamos del Laboratorio de Computación (LabDIC). Desarrollada como proyecto de titulación de Ingeniería en Computación e informática.

---

## Tecnologías

| Componente      | Tecnología                | Versión |
|-----------------|---------------------------|---------|
| Base de datos   | PostgreSQL                | 16      |
| ORM / Migraciones | SQLAlchemy + Alembic    | —       |
| Backend         | Python + Litestar         | 3.13    |
| Gestor backend  | uv                        | 0.6     |
| Frontend        | Vue 3 + TypeScript + Vite | —       |
| UI              | PrimeVue + TailwindCSS    | —       |
| Gestor frontend | Bun                       | 1.2     |

---

## Estructura del proyecto

```
proyecto-labdic/
├── app-backend/
│   ├── app/
│   ├── alembic/
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── seed.py
│   └── .env
└── app-frontend/
    ├── src/
    └── .env
```

---

## Requisitos previos

- **PostgreSQL 16** instalado y corriendo localmente.
- **Python 3.13** instalado.
- **uv 0.6** instalado ([instrucciones](https://docs.astral.sh/uv/getting-started/installation/)).
- **Bun 1.2** instalado ([instrucciones](https://bun.sh/docs/installation)).

---

## Variables de entorno

Antes de levantar los servicios, revisar y ajustar los archivos `.env` de cada servicio.

**`app-backend/.env`**
```env
DATABASE_URL=postgresql+psycopg2:///labdic_inventory
CORS_ALLOWED_ORIGINS=["http://localhost:5173"]
```

**`app-frontend/.env`**
```env
VITE_API_URL=http://localhost:8000
```

---

## Base de datos

Crear la base de datos en PostgreSQL antes de levantar el backend:

```bash
createdb labdic_inventory
```

> Si usas un usuario o contraseña específicos, ajusta `DATABASE_URL` en `app-backend/.env` con el formato:
> `postgresql+psycopg2://usuario:contraseña@localhost:5432/labdic_inventory`

---

## Levantar los servicios

### Backend

```bash
cd app-backend
uv sync
uv run alembic upgrade head
uv run python seed.py
uv run litestar run --reload
```

### Frontend

En otra terminal:

```bash
cd app-frontend
bun install
bun run dev
```

---

## URLs de acceso

| Servicio  | URL                                      |
|-----------|------------------------------------------|
| Frontend  | http://localhost:5173                    |
| Backend   | http://localhost:8000                    |
| API Docs  | http://localhost:8000/schema/scalar     |

---

## Acceso a la base de datos

Con `pgcli` (o cualquier cliente PostgreSQL):

```bash
pgcli postgresql://localhost/labdic_inventory
```