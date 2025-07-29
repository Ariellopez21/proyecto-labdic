from litestar import Router

from .auth.controllers import AuthController
from .product.controllers import ProductController
from .role.controllers import RoleController
from .user.controllers import UserController

labdic_inventory_router = Router(
    path="/labdic_inventory",
    route_handlers=[
        UserController,
        RoleController,
        AuthController,
        #ProductController,
    ],
)
