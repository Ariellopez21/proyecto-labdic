from litestar import Litestar
from litestar.config.cors import CORSConfig
from litestar.logging import StructLoggingConfig
from litestar.middleware.logging import LoggingMiddlewareConfig
from litestar.openapi import OpenAPIConfig
from litestar.openapi.plugins import ScalarRenderPlugin
from litestar.openapi.spec import Server
from litestar.plugins.structlog import StructlogConfig, StructlogPlugin

from .config import settings
from .database import sqlalchemy_plugin
from .security import oauth2_auth
from .services.labdic_inventory.router import labdic_inventory_router

openapi_config = OpenAPIConfig(
    title="Labdic Inventory API",
    version="1.0.0",
    render_plugins=[ScalarRenderPlugin()],
    path="/schema",
    servers=[Server(url="")],
)
structlog_plugin = StructlogPlugin(
    config=StructlogConfig(
        structlog_logging_config=StructLoggingConfig(
            log_exceptions="always",
            disable_stack_trace={404},
        ),
        enable_middleware_logging=settings.debug,
        middleware_logging_config=LoggingMiddlewareConfig(
            response_log_fields=["status_code", "cookies", "headers"],
        ),
    )
)
cors_config = CORSConfig(
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
)

app = Litestar(
    route_handlers=[labdic_inventory_router],           # Listo.
    openapi_config=openapi_config,          # Listo.
    cors_config=cors_config,        # Listo.
    on_app_init=[oauth2_auth.on_app_init],      # oauth2_auth o sqlalchemy_plugin
    plugins=[
        sqlalchemy_plugin,      # Listo.
        structlog_plugin,       # Listo.
    ],
    debug=settings.debug,       # Listo.
)
