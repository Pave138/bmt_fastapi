from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.models.common import Base, CommonMixin


class Category(CommonMixin, Base):
    name: Mapped[str] = mapped_column(
        String(length=255),
        nullable=False,
        index=True
    )
    parent_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('category.id'),
        nullable=True
    )
    parent = relationship(
        'Category',
        remote_side='Category.id',
        back_populates='children')
