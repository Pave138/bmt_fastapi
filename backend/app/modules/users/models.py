from typing import Optional

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "user"

    username: Mapped[Optional[str]] = mapped_column(
        String,
        unique=True,
        nullable=True
    )
    role: Mapped[str] = mapped_column(
        String,
        default='user',
        index=True
    )
    cart: Mapped[Optional['Cart']] = relationship(
        'Cart',
        back_populates='user',
        uselist=False,
        cascade='all, delete-orphan'
    )
