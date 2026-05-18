from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin


class Cart(CommonMixin, Base):
    user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE'),
        unique=True,
        nullable=False
    )
    user: Mapped['User'] = relationship('User', back_populates='cart')
    items: Mapped[list['CartItem']] = relationship(
        'CartItem',
        back_populates='cart',
        lazy='selectin',
        cascade='all, delete-orphan'
    )



