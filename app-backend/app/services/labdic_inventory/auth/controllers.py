from typing import Annotated

from litestar import Controller, Response, post
from litestar.contrib.jwt import OAuth2Login
from litestar.di import Provide
from litestar.enums import RequestEncodingType
from litestar.exceptions import HTTPException
from litestar.params import Body

from app.models.inventory import User
from app.security import oauth2_auth

from ..user.dtos import UserLoginDTO
from ..user.repositories import UserRepository, provide_user_repository


class AuthController(Controller):
    path = "/auth"
    tags = ["auth"]

    @post(
        "/login",
        dto=UserLoginDTO,
        dependencies={"users_repo": Provide(provide_user_repository)},
    )
    async def login(
        self,
        data: Annotated[User, Body(media_type=RequestEncodingType.URL_ENCODED)],
        users_repo: UserRepository,
    ) -> Response[OAuth2Login]:
        user = users_repo.get_one_or_none(username=data.username)

        if user is None or not users_repo.check_password(data.username, data.password):
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrecta")

        return oauth2_auth.login(identifier=user.username)
