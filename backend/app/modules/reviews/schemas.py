from pydantic import BaseModel, ConfigDict, Field, TypeAdapter

from app.core.constants import (
    REVIEW_COMMENT_MAX_LENGTH,
    REVIEW_EXAMPLE_COMMENT,
    REVIEW_RATING_GE,
    REVIEW_RATING_LE,
)


class ReviewFields(BaseModel):
    rating: int = Field(ge=REVIEW_RATING_GE, le=REVIEW_RATING_LE)
    comment: str | None = Field(
        None,
        max_length=REVIEW_COMMENT_MAX_LENGTH
    )


class ReviewCreate(ReviewFields):
    product_id: int

    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'product_id': 1,
                'rating': REVIEW_RATING_LE,
                'comment': REVIEW_EXAMPLE_COMMENT
            }
        }
    )


class ReviewUpdate(BaseModel):
    rating: int | None = Field(
        None,
        ge=REVIEW_RATING_GE,
        le=REVIEW_RATING_LE
    )
    comment: str | None = Field(
        None,
        max_length=REVIEW_COMMENT_MAX_LENGTH
    )

    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'rating': REVIEW_RATING_LE,
                'comment': REVIEW_EXAMPLE_COMMENT
            }
        }
    )


class ReviewResponse(ReviewFields):
    user_username: str

    model_config = ConfigDict(from_attributes=True)


class ReviewDB(ReviewResponse):
    product_id: int
    id: int


reviews_list_adapter_db = TypeAdapter(
    list[ReviewDB]
)

reviews_list_adapter_response = TypeAdapter(
    list[ReviewResponse]
)
