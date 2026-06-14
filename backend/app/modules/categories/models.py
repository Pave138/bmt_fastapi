from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import CATEGORY_NAME_MAX_LENGTH
from app.db.base import Base
from app.db.mixins import CommonMixin

if TYPE_CHECKING:
    from app.db.models import Category, Product


## Slug field in future.
class Category(CommonMixin, Base):
    name: Mapped[str] = mapped_column(
        String(length=CATEGORY_NAME_MAX_LENGTH),
        nullable=False,
        index=True,
        unique=True
    )
    parent_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey('category.id', ondelete='SET NULL'),
        nullable=True,
        index=True
    )
    parent: Mapped[Category | None] = relationship(
        'Category',
        remote_side='Category.id',
        back_populates='children',
        lazy='selectin'
    )
    children: Mapped[list[Category]] = relationship(
        'Category',
        back_populates='parent',
        cascade='all, delete-orphan',
        lazy='selectin'
    )
    products: Mapped[list[Product]] = relationship(
        'Product',
        back_populates='category',
        lazy='selectin'
    )
