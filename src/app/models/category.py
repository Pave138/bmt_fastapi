from typing import Optional

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.models.common import Base, CommonMixin

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
        back_populates='children'
    )
    children: Mapped[list['Category']] = relationship(
        'Category',
        back_populates='parent',
        cascade='all, delete-orphan'
    )
