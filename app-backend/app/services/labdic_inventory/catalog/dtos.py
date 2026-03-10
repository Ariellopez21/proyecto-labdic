# app/services/labdic_inventory/catalog/dtos.py

from advanced_alchemy.extensions.litestar import SQLAlchemyDTOConfig
from litestar.plugins.sqlalchemy import SQLAlchemyDTO

from app.models.inventory import Brand, Category, Model, Status, Ubication


# --- Brand ---
class BrandReadDTO(SQLAlchemyDTO[Brand]):
    config = SQLAlchemyDTOConfig(exclude={"products"}, partial=True)

class BrandCreateDTO(SQLAlchemyDTO[Brand]):
    config = SQLAlchemyDTOConfig(exclude={"id", "products"}, partial=False)

class BrandUpdateDTO(SQLAlchemyDTO[Brand]):
    config = SQLAlchemyDTOConfig(exclude={"id", "products"}, partial=True)


# --- Model ---
class ModelReadDTO(SQLAlchemyDTO[Model]):
    config = SQLAlchemyDTOConfig(exclude={"products"}, partial=True)

class ModelCreateDTO(SQLAlchemyDTO[Model]):
    config = SQLAlchemyDTOConfig(exclude={"id", "products"}, partial=False)

class ModelUpdateDTO(SQLAlchemyDTO[Model]):
    config = SQLAlchemyDTOConfig(exclude={"id", "products"}, partial=True)


# --- Category ---
class CategoryReadDTO(SQLAlchemyDTO[Category]):
    config = SQLAlchemyDTOConfig(exclude={"products"}, partial=True)

class CategoryCreateDTO(SQLAlchemyDTO[Category]):
    config = SQLAlchemyDTOConfig(exclude={"id", "products"}, partial=False)

class CategoryUpdateDTO(SQLAlchemyDTO[Category]):
    config = SQLAlchemyDTOConfig(exclude={"id", "products"}, partial=True)


# --- Status ---
class StatusReadDTO(SQLAlchemyDTO[Status]):
    config = SQLAlchemyDTOConfig(exclude={"devices", "loan_requests", "status_logs"}, partial=True)

class StatusCreateDTO(SQLAlchemyDTO[Status]):
    config = SQLAlchemyDTOConfig(exclude={"id", "devices", "loan_requests", "status_logs"}, partial=False)

class StatusUpdateDTO(SQLAlchemyDTO[Status]):
    config = SQLAlchemyDTOConfig(exclude={"id", "devices", "loan_requests", "status_logs"}, partial=True)


# --- Ubication ---
class UbicationReadDTO(SQLAlchemyDTO[Ubication]):
    config = SQLAlchemyDTOConfig(exclude={"devices"}, partial=True)

class UbicationCreateDTO(SQLAlchemyDTO[Ubication]):
    config = SQLAlchemyDTOConfig(exclude={"id", "devices"}, partial=False)

class UbicationUpdateDTO(SQLAlchemyDTO[Ubication]):
    config = SQLAlchemyDTOConfig(exclude={"id", "devices"}, partial=True)
