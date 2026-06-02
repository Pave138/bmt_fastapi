from typing import Optional

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin


## Slug field in future.
class Category(CommonMixin, Base):
    name: Mapped[str] = mapped_column(
        String(length=255),
        nullable=False,
        index=True,
        unique=True
    )
    parent_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('category.id', ondelete='SET NULL'),
        nullable=True,
        index=True
    )
    parent: Mapped[Optional['Category']] = relationship(
        'Category',
        remote_side='Category.id',
        back_populates='children',
        lazy='selectin'
    )
    children: Mapped[list['Category']] = relationship(
        'Category',
        back_populates='parent',
        cascade='all, delete-orphan',
        lazy='selectin'
    )
    products: Mapped[list['Product']] = relationship(
        'Product',
        back_populates='category',
        lazy='selectin'
    )
