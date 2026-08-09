import { useCart } from "../hooks/useCart";

interface AddToCartButtonProps {
    productId: number;
    disabled?: boolean;
}

export default function AddToCartButton({
    productId,
    disabled = false,
}: AddToCartButtonProps) {
    const {
        addToCart,
        isAdding,
    } = useCart();

    const handleAddToCart = () => {
        addToCart({
            product_id: productId,
            quantity: 1,
        });
    };

    return (
        <button
            type="button"
            onClick={handleAddToCart}
            disabled={disabled || isAdding}
            className="
                w-full
                rounded-lg
                bg-black
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
        >
            {isAdding
                ? "Добавление..."
                : "Добавить в корзину"}
        </button>
    );
}