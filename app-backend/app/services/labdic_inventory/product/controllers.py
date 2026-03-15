# app/services/labdic_inventory/product/controllers.py

from typing import Any, Sequence

from advanced_alchemy.exceptions import NotFoundError
from litestar import Controller, Request, Response, delete, get, patch, post
from litestar.di import Provide
from litestar.dto import DTOData

from app.models.inventory import Product

from .dtos import ProductCreateDTO, ProductReadDTO, ProductUpdateDTO
from .repositories import ProductRepository, provide_product_repository


def not_found_error_handler(_: Request[Any, Any, Any], __: NotFoundError) -> Response[Any]:
    return Response(status_code=404, content={"status_code": 404, "detail": "Product not found"})


class ProductController(Controller):
    path = "/products"
    tags = ["products"]
    return_dto = ProductReadDTO
    dependencies = {"products_repo": Provide(provide_product_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListProducts")
    async def list(self, products_repo: ProductRepository) -> Sequence[Product]:
        """List all products."""
        return products_repo.list()

    @get(path="/{product_id:int}", summary="GetProduct")
    async def fetch(self, product_id: int, products_repo: ProductRepository) -> Product:
        """Get a product by ID."""
        return products_repo.get_one(id=product_id)

    @post(path="/", summary="CreateProduct", dto=ProductCreateDTO)
    async def create(self, data: Product, products_repo: ProductRepository) -> Product:
        """Create a new product."""
        return products_repo.add(data, auto_commit=True)

    @patch(path="/{product_id:int}", summary="UpdateProduct", dto=ProductUpdateDTO)
    async def update(
        self, product_id: int, data: DTOData[Product], products_repo: ProductRepository
    ) -> Product:
        """Update an existing product."""
        # as_builtins() excluye None en partial=True.
        # Usamos el modelo directamente para que los null se apliquen explícitamente.
        update_data = data.as_builtins()

        # Forzamos brand_id, model_id, category_id a None si vienen como None
        # para que SQLAlchemy los limpie en lugar de ignorarlos
        product = products_repo.get_one(id=product_id)

        for field in ["brand_id", "model_id", "category_id"]:
            if field in update_data:
                setattr(product, field, update_data[field])

        # Actualizamos el resto de campos normalmente
        for field, value in update_data.items():
            if field not in ["brand_id", "model_id", "category_id"]:
                setattr(product, field, value)

        products_repo.session.flush()
        products_repo.session.commit()
        products_repo.session.refresh(product)

        return product

    @delete(path="/{product_id:int}", summary="DeleteProduct")
    async def delete(self, product_id: int, products_repo: ProductRepository) -> None:
        """Delete a product by ID."""
        products_repo.delete(product_id, auto_commit=True)