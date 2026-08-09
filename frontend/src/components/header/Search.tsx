import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();

    const value = searchParams.get("search") ?? "";

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const params = new URLSearchParams(searchParams);

        const search = event.target.value;

        if (!search.trim()) {
            params.delete("search");
        } else {
            params.set("search", search);
        }

        setSearchParams(params);
    }

    return (
        <div className="relative w-full max-w-2xl">
            <SearchIcon
                size={20}
                className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                "
            />

            <input
                type="search"
                value={value}
                onChange={handleChange}
                placeholder="Поиск товаров..."
                className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    pl-11
                    pr-4
                    text-sm
                    text-gray-900
                    outline-none
                    transition

                    placeholder:text-gray-400

                    hover:border-gray-300
                    hover:bg-white

                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-orange-100
                "
            />
        </div>
    );
}

export default Search;