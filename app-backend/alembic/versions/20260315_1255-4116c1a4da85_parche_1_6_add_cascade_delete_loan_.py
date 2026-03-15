"""Parche 1.6 add_cascade_delete_loan_request_items_device

Revision ID: 4116c1a4da85
Revises: 070dac9706ea
Create Date: 2026-03-15 12:55:44.895554

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4116c1a4da85'
down_revision: Union[str, Sequence[str], None] = '070dac9706ea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('loan_request_items_device_id_fkey', 'loan_request_items', type_='foreignkey')
    op.create_foreign_key(
        'loan_request_items_device_id_fkey',
        'loan_request_items', 'devices',
        ['device_id'], ['id'],
        ondelete='CASCADE'
    )

def downgrade() -> None:
    op.drop_constraint('loan_request_items_device_id_fkey', 'loan_request_items', type_='foreignkey')
    op.create_foreign_key(
        'loan_request_items_device_id_fkey',
        'loan_request_items', 'devices',
        ['device_id'], ['id']
    )
