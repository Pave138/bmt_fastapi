import re

from sqlalchemy import Integer
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
