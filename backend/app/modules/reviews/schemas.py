from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter

from app.core.constants import REVIEW_RATING_GE, REVIEW_RATING_LE


class ReviewBase(BaseModel):
    product_id: int
    rating: int = Field(ge=REVIEW_RATING_GE, le=REVIEW_RATING_LE)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None


class ReviewResponse(ReviewBase):
    id: int
    user_id: UUID
    rating: int
    comment: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


reviews_list_adapter = TypeAdapter(
    list[ReviewResponse]
)
