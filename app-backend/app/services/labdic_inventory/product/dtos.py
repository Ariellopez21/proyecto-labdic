# app/services/labdic_inventory/product/dtos.py

from advanced_alchemy.extensions.litestar import SQLAlchemyDTOConfig
from litestar.plugins.sqlalchemy import SQLAlchemyDTO

from app.models.inventory import Product


class ProductReadDTO(SQLAlchemyDTO[Product]):
    config = SQLAlchemyDTOConfig(
        exclude={"devices"},
        partial=True,
    )

class ProductCreateDTO(SQLAlchemyDTO[Product]):
    config = SQLAlchemyDTOConfig(
        exclude={"id", "created_at", "devices", "brand", "model", "category"},
        partial=False,
    )

class ProductUpdateDTO(SQLAlchemyDTO[Product]):
    config = SQLAlchemyDTOConfig(
        exclude={"id", "created_at", "devices", "brand", "model", "category"},
        partial=True,
    )
