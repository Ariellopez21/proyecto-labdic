from advanced_alchemy.extensions.litestar import EngineConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemySyncConfig

from app.models import Base

from .config import settings

sqlalchemy_config = SQLAlchemySyncConfig(
    connection_string=settings.database_url.unicode_string(),
    create_all=True,
    metadata=Base.metadata,
    engine_config=EngineConfig(echo=False),
)
sqlalchemy_plugin = SQLAlchemyPlugin(config=sqlalchemy_config)
