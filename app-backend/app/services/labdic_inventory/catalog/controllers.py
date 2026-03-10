# app/services/labdic_inventory/catalog/controllers.py

from typing import Any, Sequence

from advanced_alchemy.exceptions import NotFoundError
from litestar import Controller, Request, Response, delete, get, patch, post
from litestar.di import Provide
from litestar.dto import DTOData

from app.models.inventory import Brand, Category, Model, Status, Ubication

from .dtos import (
    BrandCreateDTO,
    BrandReadDTO,
    BrandUpdateDTO,
    CategoryCreateDTO,
    CategoryReadDTO,
    CategoryUpdateDTO,
    ModelCreateDTO,
    ModelReadDTO,
    ModelUpdateDTO,
    StatusCreateDTO,
    StatusReadDTO,
    StatusUpdateDTO,
    UbicationCreateDTO,
    UbicationReadDTO,
    UbicationUpdateDTO,
)
from .repositories import (
    BrandRepository,
    CategoryRepository,
    ModelRepository,
    StatusRepository,
    UbicationRepository,
    provide_brand_repository,
    provide_category_repository,
    provide_model_repository,
    provide_status_repository,
    provide_ubication_repository,
)


def not_found_error_handler(_: Request[Any, Any, Any], __: NotFoundError) -> Response[Any]:
    return Response(status_code=404, content={"status_code": 404, "detail": "Resource not found"})


# --- BrandController ---
class BrandController(Controller):
    path = "/brands"
    tags = ["catalog"]
    return_dto = BrandReadDTO
    dependencies = {"brands_repo": Provide(provide_brand_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListBrands")
    async def list(self, brands_repo: BrandRepository) -> Sequence[Brand]:
        return brands_repo.list()

    @get(path="/{brand_id:int}", summary="GetBrand")
    async def fetch(self, brand_id: int, brands_repo: BrandRepository) -> Brand:
        return brands_repo.get_one(id=brand_id)

    @post(path="/", summary="CreateBrand", dto=BrandCreateDTO)
    async def create(self, data: Brand, brands_repo: BrandRepository) -> Brand:
        return brands_repo.add(data, auto_commit=True)

    @patch(path="/{brand_id:int}", summary="UpdateBrand", dto=BrandUpdateDTO)
    async def update(self, brand_id: int, data: DTOData[Brand], brands_repo: BrandRepository) -> Brand:
        brand, _ = brands_repo.get_and_update(
            id=brand_id, **data.as_builtins(), match_fields=["id"], auto_commit=True
        )
        return brand

    @delete(path="/{brand_id:int}", summary="DeleteBrand")
    async def delete(self, brand_id: int, brands_repo: BrandRepository) -> None:
        brands_repo.delete(brand_id, auto_commit=True)


# --- ModelController ---
class ModelController(Controller):
    path = "/models"
    tags = ["catalog"]
    return_dto = ModelReadDTO
    dependencies = {"models_repo": Provide(provide_model_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListModels")
    async def list(self, models_repo: ModelRepository) -> Sequence[Model]:
        return models_repo.list()

    @get(path="/{model_id:int}", summary="GetModel")
    async def fetch(self, model_id: int, models_repo: ModelRepository) -> Model:
        return models_repo.get_one(id=model_id)

    @post(path="/", summary="CreateModel", dto=ModelCreateDTO)
    async def create(self, data: Model, models_repo: ModelRepository) -> Model:
        return models_repo.add(data, auto_commit=True)

    @patch(path="/{model_id:int}", summary="UpdateModel", dto=ModelUpdateDTO)
    async def update(self, model_id: int, data: DTOData[Model], models_repo: ModelRepository) -> Model:
        model, _ = models_repo.get_and_update(
            id=model_id, **data.as_builtins(), match_fields=["id"], auto_commit=True
        )
        return model

    @delete(path="/{model_id:int}", summary="DeleteModel")
    async def delete(self, model_id: int, models_repo: ModelRepository) -> None:
        models_repo.delete(model_id, auto_commit=True)


# --- CategoryController ---
class CategoryController(Controller):
    path = "/categories"
    tags = ["catalog"]
    return_dto = CategoryReadDTO
    dependencies = {"categories_repo": Provide(provide_category_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListCategories")
    async def list(self, categories_repo: CategoryRepository) -> Sequence[Category]:
        return categories_repo.list()

    @get(path="/{category_id:int}", summary="GetCategory")
    async def fetch(self, category_id: int, categories_repo: CategoryRepository) -> Category:
        return categories_repo.get_one(id=category_id)

    @post(path="/", summary="CreateCategory", dto=CategoryCreateDTO)
    async def create(self, data: Category, categories_repo: CategoryRepository) -> Category:
        return categories_repo.add(data, auto_commit=True)

    @patch(path="/{category_id:int}", summary="UpdateCategory", dto=CategoryUpdateDTO)
    async def update(self, category_id: int, data: DTOData[Category], categories_repo: CategoryRepository) -> Category:
        category, _ = categories_repo.get_and_update(
            id=category_id, **data.as_builtins(), match_fields=["id"], auto_commit=True
        )
        return category

    @delete(path="/{category_id:int}", summary="DeleteCategory")
    async def delete(self, category_id: int, categories_repo: CategoryRepository) -> None:
        categories_repo.delete(category_id, auto_commit=True)


# --- StatusController ---
class StatusController(Controller):
    path = "/statuses"
    tags = ["catalog"]
    return_dto = StatusReadDTO
    dependencies = {"statuses_repo": Provide(provide_status_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListStatuses")
    async def list(self, statuses_repo: StatusRepository) -> Sequence[Status]:
        return statuses_repo.list()

    @get(path="/{status_id:int}", summary="GetStatus")
    async def fetch(self, status_id: int, statuses_repo: StatusRepository) -> Status:
        return statuses_repo.get_one(id=status_id)

    @post(path="/", summary="CreateStatus", dto=StatusCreateDTO)
    async def create(self, data: Status, statuses_repo: StatusRepository) -> Status:
        return statuses_repo.add(data, auto_commit=True)

    @patch(path="/{status_id:int}", summary="UpdateStatus", dto=StatusUpdateDTO)
    async def update(self, status_id: int, data: DTOData[Status], statuses_repo: StatusRepository) -> Status:
        status, _ = statuses_repo.get_and_update(
            id=status_id, **data.as_builtins(), match_fields=["id"], auto_commit=True
        )
        return status

    @delete(path="/{status_id:int}", summary="DeleteStatus")
    async def delete(self, status_id: int, statuses_repo: StatusRepository) -> None:
        statuses_repo.delete(status_id, auto_commit=True)


# --- UbicationController ---
class UbicationController(Controller):
    path = "/ubications"
    tags = ["catalog"]
    return_dto = UbicationReadDTO
    dependencies = {"ubications_repo": Provide(provide_ubication_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListUbications")
    async def list(self, ubications_repo: UbicationRepository) -> Sequence[Ubication]:
        return ubications_repo.list()

    @get(path="/{ubication_id:int}", summary="GetUbication")
    async def fetch(self, ubication_id: int, ubications_repo: UbicationRepository) -> Ubication:
        return ubications_repo.get_one(id=ubication_id)

    @post(path="/", summary="CreateUbication", dto=UbicationCreateDTO)
    async def create(self, data: Ubication, ubications_repo: UbicationRepository) -> Ubication:
        return ubications_repo.add(data, auto_commit=True)

    @patch(path="/{ubication_id:int}", summary="UpdateUbication", dto=UbicationUpdateDTO)
    async def update(self, ubication_id: int, data: DTOData[Ubication], ubications_repo: UbicationRepository) -> Ubication:
        ubication, _ = ubications_repo.get_and_update(
            id=ubication_id, **data.as_builtins(), match_fields=["id"], auto_commit=True
        )
        return ubication

    @delete(path="/{ubication_id:int}", summary="DeleteUbication")
    async def delete(self, ubication_id: int, ubications_repo: UbicationRepository) -> None:
        ubications_repo.delete(ubication_id, auto_commit=True)