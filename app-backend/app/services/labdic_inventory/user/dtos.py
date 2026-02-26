
from advanced_alchemy.extensions.litestar import SQLAlchemyDTOConfig
from litestar.plugins.sqlalchemy import SQLAlchemyDTO

from app.models.inventory import User


class UserReadDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(exclude={"dispositivos"}, partial=True)

class UserCreateDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(
        exclude={"id", "created_at", "loan_requests", "status_logs"},
        partial=False
    )

class UserUpdateDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(
        exclude={"id", "created_at", "loan_requests", "status_logs","password"},
        partial=True
    )

class UserLoginDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(include={"username", "password"})
