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

Tienes acceso a la carpeta section/hito_3/ y dentro de ella se encuentra el desarrollo casi en su completitud (como el 90%) de lo que antiguamente era el hito 3.

Los hitos anteriormente los queria dividir en:

modulo de usuarios (hito 3), modulo de productos (hito 4), modulo de préstamos (hito 5), y luego iba a tener otro hito para implementar lo que haga falta para poner en marcha el proyecto y dejarlo alojado, pero ahora he finalizado y quiero cambiar la estructura completa porque será más ordenado y porque así abordaré los problemas de otra manera.


Entonces:

- La carpeta section/hito_3/ tiene una introduccion en "010intro" que contemplaba la implementación completa del modulo de usuarios utilizando las tablas users, roles, y mencionando todo el tiempo el modulo de autenticación como algo externo (esto tambien se enfatiza mucho en los demás archivos, cosa que ya sabemos que no es así, pues, con el nuevo modelo que creamos sabemos que nos basaremos en 6 módulos y no 3).

- El archivo "section/hito_3/010intro" y "section/hito_3/020objetivo" los desarrollaremos luego de finalizar el archivo "section/hito_3/030desarrollo" porque es donde estará todo lo importante.

Ahora:

- Dentro de "section/hito_3/030desarrollo" vamos a implementar todos los módulos (los 6) desde el backend y nuestra primera sección clave (\subsection{}) será dedicada a Alembic y su uso práctico en el desarrollo, hablaremos de que tuvimos que hacer varias migraciones a lo largo del desarrollo del proyecto, pues, se fueron modificando campos a algunas tablas, o bien se hicieron cambios de relaciones o cambios en los atributos (como cuando tuvimos que agregar los ON_CASCADE para borrar contenidos a partir de una relación foranea).

- Luego, tendremos otra sección clave (\subsection{}) por cada módulo implementado, es decir, tendremos una subsección para módulo de usuarios, autenticación, catálogo, productos, dispositivos, préstamos, y en cada uno de ellos tendrás acceso completo a la ruta app-backend/app/services/labdic_inventory/ de su respectivo servicio para implementar en el módulo correspondiente.

Nota importante sobre cada sección clave (\subsection{}):

- Te daré un ejemplo con el módulo de usuario, el cual contempla el servicio completo de "user", intercambio de información entre tablas con "roles" y "auth", dos servicios provenientes de módulos diferentes.

- En este caso, deberías hablar primero de las implementaciones CRUD, si se implementaron métodos triviales como get_all, get_one, user_delete, que son métodos genéricos que ya vienen desde el repositorio solo mencionalos y de paso dices de dónde provienen y por qué no es necesario describirlos.

- Mientras que, todos los métodos personalizados que hayamos implementado como el caso de update_with_existing_roles o add_with_existing_roles los mencionas y destacas qué tiene de diferente para hacerlo un método personalizado, en este caso es simplemente el hecho de que cada vez que se crea un usuario se está linkeando con la tabla de roles a través de user_role para asignarle roles al crear usuario o actualizarlo.

- Por otro lado, los DTO solo son necesario que los menciones, digamos en este caso, existen 4 DTO y sus finalidades pueden ser explicadas en 1 línea facilmente, por ejemplo UserLoginDTO es utilizado para la pantalla de login y su linkeo con el servicio de "auth".