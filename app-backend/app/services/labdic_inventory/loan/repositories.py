# app/services/labdic_inventory/loan/repositories.py

from datetime import datetime, timezone
from typing import Sequence

from advanced_alchemy.repository import SQLAlchemySyncRepository
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.inventory import Device, LoanRequest, LoanRequestItem, Status


class LoanRequestRepository(SQLAlchemySyncRepository[LoanRequest]):
    model_type = LoanRequest

    def _get_status_id(self, name: str) -> int:
        """Obtiene el ID de un status por nombre."""
        stmt = select(Status).where(Status.name == name)
        status = self.session.execute(stmt).scalar_one()
        return status.id

    def get_with_relations(self, loan_id: int) -> LoanRequest:
        """Obtiene una solicitud con todas sus relaciones cargadas."""
        stmt = (
            select(LoanRequest)
            .options(
                selectinload(LoanRequest.user),
                selectinload(LoanRequest.status),
                selectinload(LoanRequest.loan_request_items).selectinload(
                    LoanRequestItem.device
                ).selectinload(Device.product),
            )
            .where(LoanRequest.id == loan_id)
        )
        return self.session.execute(stmt).scalar_one()

    def create_with_items(
        self,
        user_id: int,
        device_ids: list[int],
        reason: str | None,
        estimated_return_date: datetime | None,
    ) -> LoanRequest:
        """Crea una solicitud de préstamo con sus items en una sola transacción.

        El status inicial es 'pendiente'.
        """
        status_id = self._get_status_id("pendiente")

        loan = LoanRequest(
            user_id=user_id,
            status_id=status_id,
            reason=reason,
            estimated_return_date=estimated_return_date,
            request_date=datetime.now(timezone.utc),
        )
        self.session.add(loan)
        self.session.flush()  # para obtener loan.id antes de crear los items

        for device_id in device_ids:
            item = LoanRequestItem(
                loan_request_id=loan.id,
                device_id=device_id,
            )
            self.session.add(item)

        self.session.commit()
        return loan

    def approve(self, loan_id: int) -> LoanRequest:
        """Aprueba una solicitud de préstamo."""
        status_id = self._get_status_id("aprobado")
        loan, _ = self.get_and_update(
            id=loan_id,
            status_id=status_id,
            match_fields=["id"],
            auto_commit=True,
        )
        return loan

    def reject(self, loan_id: int) -> LoanRequest:
        """Rechaza una solicitud de préstamo."""
        status_id = self._get_status_id("rechazado")
        loan, _ = self.get_and_update(
            id=loan_id,
            status_id=status_id,
            match_fields=["id"],
            auto_commit=True,
        )
        return loan

    def deliver(self, loan_id: int) -> LoanRequest:
        """Registra la entrega de los dispositivos al usuario.

        - Llena delivery_date con la fecha actual.
        - Cambia el status de la solicitud a 'prestado'.
        - Cambia el status de cada device involucrado a 'prestado'.
        """
        prestado_id = self._get_status_id("prestado")

        # Actualizar la solicitud
        loan, _ = self.get_and_update(
            id=loan_id,
            status_id=prestado_id,
            delivery_date=datetime.now(timezone.utc),
            match_fields=["id"],
        )

        # Cambiar status de cada device a 'prestado'
        items = self.session.execute(
            select(LoanRequestItem).where(LoanRequestItem.loan_request_id == loan_id)
        ).scalars().all()

        for item in items:
            device = self.session.get(Device, item.device_id)
            if device is None:
                raise ValueError(f"Device {item.device_id} no encontrado.")
            device.status_id = prestado_id

        self.session.commit()
        return loan

    def register_return(self, loan_id: int) -> LoanRequest:
        """Registra la devolución de los dispositivos.

        - Llena actual_return_date con la fecha actual.
        - Cambia el status de cada device involucrado a 'disponible'.
        """
        disponible_id = self._get_status_id("disponible")

        # Actualizar la solicitud
        loan, _ = self.get_and_update(
            id=loan_id,
            actual_return_date=datetime.now(timezone.utc),
            match_fields=["id"],
        )

        # Cambiar status de cada device a 'disponible'
        items = self.session.execute(
            select(LoanRequestItem).where(LoanRequestItem.loan_request_id == loan_id)
        ).scalars().all()

        for item in items:
            device = self.session.get(Device, item.device_id)
            if device is None:
                raise ValueError(f"Device {item.device_id} no encontrado.")
            device.status_id = disponible_id

        self.session.commit()
        return loan


def provide_loan_repository(db_session: Session) -> LoanRequestRepository:
    return LoanRequestRepository(session=db_session)