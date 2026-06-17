from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models import Cart, Order, Review


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "user"

    username: Mapped[str] = mapped_column(
        String,
        unique=True
    )
    cart: Mapped[Cart | None] = relationship(
        'Cart',
        back_populates='user',
        uselist=False,
        cascade='all, delete-orphan'
    )
    reviews: Mapped[list[Review]] = relationship(
        'Review',
        back_populates='user',
        cascade='all, delete-orphan',
        passive_deletes=True
    )
    orders: Mapped[list[Order]] = relationship(
        'Order',
        back_populates='user',
        cascade='all, delete-orphan',
        passive_deletes=True
    )
