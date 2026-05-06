"""Модель пользователя."""
from datetime import datetime as dt

from sqlalchemy import Integer, String, Boolean, DateTime, func, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.models.common import Base, CommonMixin


class User(CommonMixin, Base):

    email: Mapped[String] = mapped_column(
        String(length=320),
        unique=True,
        index=True,
        nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(length=1024),
        nullable=False
    )
    role: Mapped[str] = mapped_column(String, default='user', index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[dt] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        Index('ix_users_email_active', 'email', 'is_active'),
    )
