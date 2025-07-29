from advanced_alchemy.filters import CollectionFilter
from advanced_alchemy.repository import SQLAlchemySyncRepository
from litestar.dto import DTOData
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.inventory import User
from app.services.labdic_inventory.role.repositories import RoleRepository

password_hasher = PasswordHash.recommended()


class UserRepository(SQLAlchemySyncRepository[User]):
    model_type = User

    '''Get my User'''
    def get_my_user(self, username: str) -> User:
        """Get the current user."""
        stmt = (
            select(User)
            .options(selectinload(User.roles))
            .options(selectinload(User.loan_requests))
            .options(selectinload(User.status_logs))
            .where(User.username == username)
        )
        return self.session.execute(stmt).scalar_one()

    '''Models Users & Roles + Auth Controllers'''
    def add_with_existing_roles(
        self, roles_repo: RoleRepository,
        user: User,
        **kwargs
    ) -> User:
        '''Hashing the password before saving the user.'''
        user.password = password_hasher.hash(user.password)

        """Add a user with existing roles, matching by id."""
        user.roles = roles_repo.list(
            CollectionFilter(
                field_name="id",
                values=[role.id for role in user.roles]
            )
        )

        self.add(user, **kwargs)

        return user

    def update_with_existing_roles(
        self, roles_repo: RoleRepository, user_id: int, user_data: DTOData[User], **kwargs
    ) -> User:
        """Update a user using existing roles, matching by id."""
        user_data_dict = user_data.as_builtins()

        if "roles" in user_data_dict:
            user_data_dict["roles"] = roles_repo.list(
                CollectionFilter(
                    field_name="id",
                    values=[role.id for role in user_data_dict["roles"]]
                )
            )

        user, _ = self.get_and_update(
            id=user_id,
            **user_data_dict,
            match_fields=["id"],
            **kwargs
        )

        return user

    def check_password(self, username: str, password: str) -> bool:
        user = self.get(username, id_attribute="username")

        return password_hasher.verify(password, user.password)

async def provide_user_repository(db_session: Session) -> UserRepository:
    """
    Provide a SQLAlchemySyncRepository for User.
    """
    return UserRepository(session=db_session)
