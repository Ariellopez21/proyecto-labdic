
from advanced_alchemy.extensions.litestar import SQLAlchemyDTOConfig
from litestar.plugins.sqlalchemy import SQLAlchemyDTO

from app.models.inventory import Product


class ProductReadDTO(SQLAlchemyDTO[Product]):
    config = SQLAlchemyDTOConfig(exclude={"dispositivos"}, partial=True)
class ProductCreateDTO(SQLAlchemyDTO[Product]):
    config = SQLAlchemyDTOConfig(exclude={"id"}, partial=True)

