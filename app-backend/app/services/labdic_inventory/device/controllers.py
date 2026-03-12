# app/services/labdic_inventory/device/controllers.py

from typing import Any, Sequence

from advanced_alchemy.exceptions import NotFoundError
from litestar import Controller, Request, Response, delete, get, patch, post
from litestar.contrib.jwt import Token
from litestar.di import Provide
from litestar.dto import DTOData

from app.models.inventory import Device, DeviceStatusLog, User

from .dtos import (
    DeviceCreateDTO,
    DeviceReadDTO,
    DeviceStatusChangeDTO,
    DeviceStatusLogReadDTO,
    DeviceUpdateDTO,
)
from .repositories import (
    DeviceRepository,
    DeviceStatusLogRepository,
    provide_device_repository,
    provide_device_status_log_repository,
)


def not_found_error_handler(_: Request[Any, Any, Any], __: NotFoundError) -> Response[Any]:
    return Response(status_code=404, content={"status_code": 404, "detail": "Device not found"})


class DeviceController(Controller):
    path = "/devices"
    tags = ["devices"]
    return_dto = DeviceReadDTO
    dependencies = {"devices_repo": Provide(provide_device_repository, sync_to_thread=False)}
    exception_handlers = {NotFoundError: not_found_error_handler}

    @get(path="/", summary="ListDevices")
    async def list(self, devices_repo: DeviceRepository) -> Sequence[Device]:
        """Lista todos los dispositivos."""
        return devices_repo.list()

    @get(path="/available", summary="ListAvailableDevices")
    async def list_available(self, devices_repo: DeviceRepository) -> Sequence[Device]:
        """Lista todos los dispositivos disponibles para préstamo."""
        return devices_repo.list_available()

    @get(path="/{device_id:int}", summary="GetDevice")
    async def fetch(self, device_id: int, devices_repo: DeviceRepository) -> Device:
        """Obtiene un dispositivo por ID con sus relaciones."""
        return devices_repo.get_with_relations(device_id)

    @post(path="/", summary="CreateDevice", dto=DeviceCreateDTO)
    async def create(self, data: Device, devices_repo: DeviceRepository) -> Device:
        """Registra un nuevo dispositivo en el inventario."""
        return devices_repo.add(data, auto_commit=True)

    @patch(path="/{device_id:int}", summary="UpdateDevice", dto=DeviceUpdateDTO)
    async def update(
        self, device_id: int, data: DTOData[Device], devices_repo: DeviceRepository
    ) -> Device:
        """Edita los campos generales de un dispositivo (sin cambio de estado)."""
        device, _ = devices_repo.get_and_update(
            id=device_id,
            **data.as_builtins(),
            match_fields=["id"],
            auto_commit=True,
        )
        return device

    @patch(
        path="/{device_id:int}/status",
        summary="ChangeDeviceStatus",
        tags=["devices"],
    )
    async def change_status(
        self,
        device_id: int,
        data: DeviceStatusChangeDTO,
        request: Request[User, Token, Any],
        devices_repo: DeviceRepository,
    ) -> Device:
        """Cambia el estado de un dispositivo y registra el cambio en el historial."""
        return devices_repo.change_status(
            device_id=device_id,
            status_id=data.status_id,
            user_id=request.user.id,
        )

    @get(
        path="/{device_id:int}/history",
        summary="GetDeviceHistory",
        return_dto=DeviceStatusLogReadDTO,
        dependencies={"logs_repo": Provide(provide_device_status_log_repository, sync_to_thread=False)},
    )
    async def get_history(
        self,
        device_id: int,
        logs_repo: DeviceStatusLogRepository,
    ) -> Sequence[DeviceStatusLog]:
        """Retorna el historial de cambios de estado de un dispositivo."""
        return logs_repo.get_history_by_device(device_id)

    @delete(path="/{device_id:int}", summary="DeleteDevice")
    async def delete(self, device_id: int, devices_repo: DeviceRepository) -> None:
        """Elimina un dispositivo del inventario."""
        devices_repo.delete(device_id, auto_commit=True)