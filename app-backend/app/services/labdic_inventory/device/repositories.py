# app/services/labdic_inventory/device/repositories.py

from datetime import datetime, timezone
from typing import Sequence

from advanced_alchemy.repository import SQLAlchemySyncRepository
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.inventory import Device, DeviceStatusLog, Status


class DeviceRepository(SQLAlchemySyncRepository[Device]):
    model_type = Device

    def get_with_relations(self, device_id: int) -> Device:
        """Obtiene un dispositivo con sus relaciones cargadas (product, status, ubication)."""
        stmt = (
            select(Device)
            .options(
                selectinload(Device.product),
                selectinload(Device.status),
                selectinload(Device.ubication),
            )
            .where(Device.id == device_id)
        )
        return self.session.execute(stmt).scalar_one()

    def change_status(self, device_id: int, status_id: int, user_id: int) -> Device:
        """Cambia el estado de un dispositivo y registra el cambio en el historial.

        Operación atómica: actualiza Device.status_id y crea DeviceStatusLog
        en la misma sesión antes del commit.
        """
        # 1. Obtener y actualizar el dispositivo
        device, _ = self.get_and_update(
            id=device_id,
            status_id=status_id,
            match_fields=["id"],
        )

        # 2. Crear el log automáticamente
        log = DeviceStatusLog(
            device_id=device_id,
            status_id=status_id,
            user_id=user_id,
            timestamp=datetime.now(timezone.utc),
        )
        self.session.add(log)

        # 3. Commit único para ambas operaciones
        self.session.commit()

        return device

    def list_available(self) -> Sequence[Device]:
        """Retorna todos los dispositivos con estado 'disponible'."""
        stmt = (
            select(Device)
            .options(
                selectinload(Device.product),
                selectinload(Device.status),
                selectinload(Device.ubication),
            )
            .join(Device.status)
            .where(Status.name == "disponible")
        )
        return list(self.session.execute(stmt).scalars().all())


class DeviceStatusLogRepository(SQLAlchemySyncRepository[DeviceStatusLog]):
    model_type = DeviceStatusLog

    def get_history_by_device(self, device_id: int) -> Sequence[DeviceStatusLog]:
        """Retorna el historial de estados de un dispositivo, ordenado por timestamp desc."""
        stmt = (
            select(DeviceStatusLog)
            .options(
                selectinload(DeviceStatusLog.status),
                selectinload(DeviceStatusLog.user),
            )
            .where(DeviceStatusLog.device_id == device_id)
            .order_by(DeviceStatusLog.timestamp.desc())
        )
        return list(self.session.execute(stmt).scalars().all())


def provide_device_repository(db_session: Session) -> DeviceRepository:
    return DeviceRepository(session=db_session)

def provide_device_status_log_repository(db_session: Session) -> DeviceStatusLogRepository:
    return DeviceStatusLogRepository(session=db_session)
