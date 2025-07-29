from advanced_alchemy.repository import SQLAlchemySyncRepository
from sqlalchemy.orm import Session

from app.models.inventory import Product


class ProductRepository(SQLAlchemySyncRepository[Product]):
    model_type = Product

async def provide_product_repository(db_session: Session) -> ProductRepository:
    """
    Provide a SQLAlchemySyncRepository for Product.
    """
    return ProductRepository(session=db_session)

