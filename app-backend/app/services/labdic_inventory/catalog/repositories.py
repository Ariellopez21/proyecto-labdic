# app/services/labdic_inventory/catalog/repositories.py

from advanced_alchemy.repository import SQLAlchemySyncRepository
from sqlalchemy.orm import Session

from app.models.inventory import Brand, Category, Model, Status, Ubication


class BrandRepository(SQLAlchemySyncRepository[Brand]):
    model_type = Brand

class ModelRepository(SQLAlchemySyncRepository[Model]):
    model_type = Model

class CategoryRepository(SQLAlchemySyncRepository[Category]):
    model_type = Category

class StatusRepository(SQLAlchemySyncRepository[Status]):
    model_type = Status

class UbicationRepository(SQLAlchemySyncRepository[Ubication]):
    model_type = Ubication


def provide_brand_repository(db_session: Session) -> BrandRepository:
    return BrandRepository(session=db_session)

def provide_model_repository(db_session: Session) -> ModelRepository:
    return ModelRepository(session=db_session)

def provide_category_repository(db_session: Session) -> CategoryRepository:
    return CategoryRepository(session=db_session)

def provide_status_repository(db_session: Session) -> StatusRepository:
    return StatusRepository(session=db_session)

def provide_ubication_repository(db_session: Session) -> UbicationRepository:
    return UbicationRepository(session=db_session)