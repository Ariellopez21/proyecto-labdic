import asyncio
from datetime import datetime, timezone

from pwdlib import PasswordHash

from app.database import sqlalchemy_config
from app.models.inventory import User
from app.services.labdic_inventory.role.repositories import RoleRepository
from app.services.labdic_inventory.user.repositories import UserRepository

password_hasher = PasswordHash.recommended()

# Crea la sesión
session_maker = sqlalchemy_config.create_session_maker()
async def create_admin():
    with session_maker() as session:
        users_repo = UserRepository(session=session)
        roles_repo = RoleRepository(session=session)

        # Busca el rol admin (asegúrate de que exista)
        admin_role = roles_repo.get_one(name="admin")

        # Crea el usuario admin
        admin_user = User(
        rut="21021646-4",
        name="ariel",
        username="arilopez",
        email="arilopez@umag.cl",
        password= password_hasher.hash("210216464"),
        phone="+56941394363",
        address="psj. padre emilio pastori girone 0928",
        created_at=datetime.now(timezone.utc),
)
    users_repo.add_with_existing_roles(roles_repo, admin_user, auto_commit=True)
    print("Usuario admin creado")
    print(f"Username: {admin_user.username}, Password: {admin_user.password}")

if __name__ == "__main__":
    asyncio.run(create_admin())