from advanced_alchemy.repository import SQLAlchemySyncRepository
from sqlalchemy.orm import Session

from app.models.inventory import Role


class RoleRepository(SQLAlchemySyncRepository[Role]):
    model_type = Role

def provide_role_repository(db_session: Session) -> RoleRepository:
    """
    Provide a SQLAlchemySyncRepository for Role.
    """
    return RoleRepository(session=db_session)

