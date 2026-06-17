from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Index,
    Integer,
    String,
    false,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    PRODUCT_IMAGE_CONTENT_TYPE_MAX_LENGTH,
    PRODUCT_IMAGE_FILE_KEY_MAX_LENGTH,
    PRODUCT_IMAGE_ORIGINAL_FILENAME_MAX_LENGTH,
)
from app.db.base import Base
from app.db.mixins import CommonMixin

if TYPE_CHECKING:
    from app.db.models import Product


class ProductImage(CommonMixin, Base):
    product_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('product.id', ondelete='CASCADE')
    )
    file_key: Mapped[str] = mapped_column(
        String(PRODUCT_IMAGE_FILE_KEY_MAX_LENGTH),
        nullable=False,
        unique=True
    )
    original_filename: Mapped[str] = mapped_column(
        String(PRODUCT_IMAGE_ORIGINAL_FILENAME_MAX_LENGTH),
        nullable=False
    )
    content_type: Mapped[str] = mapped_column(
        String(PRODUCT_IMAGE_CONTENT_TYPE_MAX_LENGTH),
        nullable=False
    )
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    width: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )
    height: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )
    is_main: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default=false(),
        nullable=False
    )
    product: Mapped[Product] = relationship(
        'Product',
        back_populates='images'
    )

    __table_args__ = (
        Index(
            'ix_product_one_main_image',
            'product_id',
            unique=True,
            postgresql_where=text('is_main = true')
        ),
    )
