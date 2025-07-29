
from advanced_alchemy.extensions.litestar import SQLAlchemyDTOConfig
from litestar.plugins.sqlalchemy import SQLAlchemyDTO

from app.models.inventory import Role


class RoleReadDTO(SQLAlchemyDTO[Role]):
    config = SQLAlchemyDTOConfig(partial=True)
class RoleCreateDTO(SQLAlchemyDTO[Role]):
    config = SQLAlchemyDTOConfig(exclude={"id", "users"}, partial=True)
class RoleUpdateDTO(SQLAlchemyDTO[Role]):
    config = SQLAlchemyDTOConfig(exclude={"id", "users"}, partial=True)
