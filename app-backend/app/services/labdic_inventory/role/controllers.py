from typing import Any, Sequence

from advanced_alchemy.exceptions import NotFoundError
from litestar import Controller, Request, Response, delete, get, patch, post
from litestar.di import Provide
from litestar.dto import DTOData

from app.models.inventory import Role

# Esta es la forma de importar para colaborar con otro repositorio
from .dtos import RoleCreateDTO, RoleReadDTO, RoleUpdateDTO
from .repositories import RoleRepository, provide_role_repository


def not_found_error_handler(_: Request[Any, Any, Any], __: NotFoundError) -> Response[Any]:
    return Response(status_code=404, content={"status_code": 404, "detail": "User not found"})


class RoleController(Controller):
    path = "/roles"
    tags = ["roles"]
    return_dto = RoleReadDTO
    dependencies = {"roles_repo": Provide(provide_role_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListRoles")
    async def list(self, roles_repo: RoleRepository) -> Sequence[Role]:
        """List all roles."""
        return roles_repo.list()

    @get(path="/{role_id:int}", summary="GetRole")
    async def fetch(self, role_id: int, roles_repo: RoleRepository) -> Role:
        """Get a role by ID."""
        return roles_repo.get_one(id=role_id)

    @post(
        path="/",
        summary="CreateRole",
        dto=RoleCreateDTO,
    )
    async def create(
        self, data: Role, roles_repo: RoleRepository) -> Role:
        """Create a new role."""
        return roles_repo.add(data, auto_commit=True)

    @patch(path="/{role_id:int}", summary="UpdateRole", dto=RoleUpdateDTO)
    async def update(
        self, role_id: int, data: DTOData[Role], roles_repo: RoleRepository
    ) -> Role:
        """Update an existing role."""
        role, _ = roles_repo.get_and_update(
            id=role_id,
            **data.as_builtins(),
            match_fields=["id"],
            auto_commit=True,
        )
        return role

    @delete(path="/{role_id:int}", summary="DeleteRole")
    async def delete(self, role_id: int, roles_repo: RoleRepository) -> None:
        """Delete a role by ID."""
        roles_repo.delete(role_id, auto_commit=True)
