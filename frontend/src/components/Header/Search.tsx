import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();

    const value = searchParams.get("search") ?? "";

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const params = new URLSearchParams(searchParams);

        const search = event.target.value.trim();

        if (search === "") {
            params.delete("search");
        } else {
            params.set("search", search);
        }

        setSearchParams(params);
    }

    return (
        <div className="relative flex-1 max-w-2xl">
            <SearchIcon
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Поиск товаров..."
                className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    py-2.5
                    pl-11
                    pr-4
                    outline-none
                    transition

                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-200
                "
            />
        </div>
    );
}

export default Search;