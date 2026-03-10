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
        product, _ = products_repo.get_and_update(
            id=product_id,
            **data.as_builtins(),
            match_fields=["id"],
            auto_commit=True,
        )
        return product

    @delete(path="/{product_id:int}", summary="DeleteProduct")
    async def delete(self, product_id: int, products_repo: ProductRepository) -> None:
        """Delete a product by ID."""
        products_repo.delete(product_id, auto_commit=True)