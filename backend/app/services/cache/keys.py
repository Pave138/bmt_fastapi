def get_product_key(product_id: int) -> str:
    return f'product:{product_id}'


def get_products_key(limit: int, offset: int) -> str:
    return f'products:{limit}:{offset}'


def get_category_key(
        category_id: int,
        limit: int,
        offset: int
) -> str:
    return (f'products:category:{category_id}:'
            f'limit:{limit}:offset:{offset}')
