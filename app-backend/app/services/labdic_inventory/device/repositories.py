# app/services/labdic_inventory/device/repositories.py

from datetime import datetime, timezone
from typing import Sequence

from advanced_alchemy.repository import SQLAlchemySyncRepository
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.inventory import Device, DeviceStatusLog, Status


class DeviceRepository(SQLAlchemySyncRepository[Device]):
    model_type = Device

    def _base_stmt(self):
        """Statement base con todas las relaciones cargadas."""
        return (
            select(Device)
            .options(
                selectinload(Device.product),
                selectinload(Device.status),
                selectinload(Device.ubication),
            )
        )

    def get_with_relations(self, device_id: int) -> Device:
        """Obtiene un dispositivo con sus relaciones cargadas."""
        stmt = self._base_stmt().where(Device.id == device_id)
        return self.session.execute(stmt).scalar_one()

    def list_all_with_relations(self) -> Sequence[Device]:
        """Lista todos los dispositivos con relaciones cargadas."""
        stmt = self._base_stmt()
        return list(self.session.execute(stmt).scalars().all())

    def list_by_product(self, product_id: int) -> Sequence[Device]:
        """Lista dispositivos de un producto específico."""
        stmt = self._base_stmt().where(Device.product_id == product_id)
        return list(self.session.execute(stmt).scalars().all())

    def list_available(self) -> Sequence[Device]:
        """Lista todos los dispositivos con estado 'available'."""
        stmt = (
            self._base_stmt()
            .join(Device.status)
            .where(Status.name == "disponible")
        )
        return list(self.session.execute(stmt).scalars().all())

    def change_status(self, device_id: int, status_id: int, user_id: int) -> Device:
        """Cambia el estado de un dispositivo y registra el cambio en el historial."""
        device, _ = self.get_and_update(
            id=device_id,
            status_id=status_id,
            match_fields=["id"],
        )
        log = DeviceStatusLog(
            device_id=device_id,
            status_id=status_id,
            user_id=user_id,
            timestamp=datetime.now(timezone.utc),
        )
        self.session.add(log)
        self.session.commit()
        return device


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