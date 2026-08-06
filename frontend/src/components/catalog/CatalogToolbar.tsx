interface Props {
    total: number;
}

function CatalogToolbar({ total }: Props) {
    return (
        <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div>
                <h1 className="text-3xl font-bold">
                    Каталог
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Найдено товаров: {total}
                </p>
            </div>

            <select
                className="
                    rounded-lg
                    border
                    px-3
                    py-2
                    outline-none
                    focus:border-orange-500
                "
            >
                <option>По популярности</option>
                <option>Сначала дешевле</option>
                <option>Сначала дороже</option>
                <option>По рейтингу</option>
                <option>Новинки</option>
            </select>
        </div>
    );
}

export default CatalogToolbar;