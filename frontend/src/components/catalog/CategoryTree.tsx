import type { Category } from "../../types/Category";
import CategoryNode from "./CategoryNode";


interface CategoryTreeProps {
    categories: Category[];
    selectedCategory: number | null;
    onSelect: (id: number | null) => void;
}


function CategoryTree({
    categories,
    selectedCategory,
    onSelect,
}: CategoryTreeProps) {

    return (
        <div
            className="
                rounded-xl
                bg-white
                p-4
            "
        >

            <h2
                className="
                    mb-4
                    text-lg
                    font-semibold
                "
            >
                Категории
            </h2>


            <div
                className="
                    space-y-1
                "
            >

                {
                    categories.map(category => (
                        <CategoryNode
                            key={category.id}
                            category={category}
                            selectedCategory={selectedCategory}
                            onSelect={onSelect}
                        />
                    ))
                }

            </div>


        </div>
    );
}


export default CategoryTree;