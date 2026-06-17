from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    PRODUCT_SPECIFICATION_NAME_MAX_LENGTH,
    PRODUCT_SPECIFICATION_VALUE_MAX_LENGTH,
)
from app.db.base import Base
from app.db.mixins import CommonMixin

if TYPE_CHECKING:
    from app.db.models import Product


class ProductSpecification(CommonMixin, Base):
    product_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('product.id', ondelete='CASCADE')
    )
    name: Mapped[str] = mapped_column(
        String(PRODUCT_SPECIFICATION_NAME_MAX_LENGTH)
    )
    value: Mapped[str] = mapped_column(
        String(PRODUCT_SPECIFICATION_VALUE_MAX_LENGTH)
    )
    product: Mapped[Product] = relationship(
        'Product',
        back_populates='specification'
    )
