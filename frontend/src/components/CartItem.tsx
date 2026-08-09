import type { CartItem as CartItemType } from "../api/cart";

interface CartItemProps {
    item: CartItemType;

    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;

    disabled?: boolean;
}

export default function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
    disabled = false,
}: CartItemProps) {
    return (
        <div
            className="
                rounded-xl
                border
                bg-white
                p-5
            "
        >
            <div className="flex gap-5">
                <div className="min-w-0 flex-1">
                    <h2
                        className="
                            truncate
                            text-lg
                            font-semibold
                        "
                    >
                        {item.product.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {item.product.price} ₽ / шт.
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-lg font-semibold">
                        {item.subtotal} ₽
                    </div>
                </div>
            </div>

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    pt-4
                "
            >
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onDecrease}
                        disabled={
                            disabled ||
                            item.quantity <= 1
                        }
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            text-lg
                            transition
                            hover:bg-gray-50
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        −
                    </button>

                    <span
                        className="
                            w-8
                            text-center
                            font-medium
                        "
                    >
                        {item.quantity}
                    </span>

                    <button
                        type="button"
                        onClick={onIncrease}
                        disabled={disabled}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            text-lg
                            transition
                            hover:bg-gray-50
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onRemove}
                    disabled={disabled}
                    className="
                        text-sm
                        text-red-600
                        transition
                        hover:text-red-700
                        hover:underline
                        disabled:opacity-40
                    "
                >
                    Удалить
                </button>
            </div>
        </div>
    );
}