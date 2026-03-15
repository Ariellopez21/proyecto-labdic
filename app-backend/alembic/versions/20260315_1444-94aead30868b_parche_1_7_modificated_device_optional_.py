"""Parche 1.7 modificated_device_optional_rows

Revision ID: 94aead30868b
Revises: 4116c1a4da85
Create Date: 2026-03-15 14:44:32.611903

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94aead30868b'
down_revision: Union[str, Sequence[str], None] = '4116c1a4da85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Restaura el CASCADE que se perdió — no hace nada nuevo
    op.drop_constraint('loan_request_items_device_id_fkey', 'loan_request_items', type_='foreignkey')
    op.create_foreign_key(
        'loan_request_items_device_id_fkey',
        'loan_request_items', 'devices',
        ['device_id'], ['id'],
        ondelete='CASCADE'   # ← agregar esto
    )

def downgrade() -> None:
    op.drop_constraint('loan_request_items_device_id_fkey', 'loan_request_items', type_='foreignkey')
    op.create_foreign_key(
        'loan_request_items_device_id_fkey',
        'loan_request_items', 'devices',
        ['device_id'], ['id']
    )