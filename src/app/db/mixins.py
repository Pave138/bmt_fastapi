from datetime import datetime as dt
import re

from sqlalchemy import DateTime, Integer, func
from sqlalchemy.orm import declared_attr, Mapped, mapped_column


def camel_to_snake(name: str) -> str:
    return re.sub(
        r'(?<!^)(?=[A-Z])',
        '_',
        name
    ).lower()


class CommonMixin:

    @declared_attr
    def __tablename__(cls):
        return camel_to_snake(cls.__name__)

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )


class TimestampMixin:
    created_at: Mapped[dt] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[dt] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
