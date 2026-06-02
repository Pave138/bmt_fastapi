def get_product_key(product_id: int) -> str:
    return f'product:{product_id}'


def get_products_key(limit: int, offset: int) -> str:
    return f'products:{limit}:{offset}'


def get_category_products_key(
        category_id: int,
        limit: int,
        offset: int
) -> str:
    return (f'products:category:{category_id}:'
            f'limit:{limit}:offset:{offset}')


def get_categories_key() -> str:
    return'categories_tree'


def get_review_key(review_id) -> str:
    return f'review:{review_id}'


def get_product_reviews_key(product_id) -> str:
    return f'reviews:product:{product_id}'
