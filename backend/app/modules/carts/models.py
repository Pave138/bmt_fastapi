from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin

if TYPE_CHECKING:
    from app.db.models import CartItem, Coupon, User


class Cart(CommonMixin, Base):
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE'),
        unique=True,
        nullable=False
    )
    user: Mapped[User] = relationship('User', back_populates='cart')
    items: Mapped[list[CartItem]] = relationship(
        'CartItem',
        back_populates='cart',
        lazy='selectin',
        cascade='all, delete-orphan'
    )
    coupon_id: Mapped[int | None] = mapped_column(
        ForeignKey('coupon.id', ondelete='SET NULL'),
        nullable=True
    )
    coupon: Mapped[Coupon | None] = relationship('Coupon')
