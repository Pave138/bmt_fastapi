export function formatPrice(price: string | number) {
    return new Intl.NumberFormat("ru-RU", {
        maximumFractionDigits: 0,
    }).format(Number(price));
}