import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import {
    useState,
} from "react";

import type {
    Category,
} from "../../types/Category";


interface Props {
    category: Category;
    selectedCategory: string | null;
    onSelect: (slug: string | null) => void;
}


function CategoryNode({
    category,
    selectedCategory,
    onSelect,
}: Props) {

    const [
        open,
        setOpen,
    ] = useState(false);


    const hasChildren =
        category.children?.length > 0;


    const active =
        selectedCategory === category.slug;


    const handleClick = () => {

        onSelect(
            active
                ? null
                : category.slug,
        );


        if (hasChildren) {
            setOpen(
                current => !current,
            );
        }
    };


    return (
        <div>

            <div
                className={`
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2
                    transition

                    ${
                        active
                            ? "bg-orange-50 text-orange-600"
                            : "hover:bg-gray-100"
                    }
                `}
                onClick={handleClick}
            >

                <span
                    className={`
                        text-sm

                        ${
                            active
                                ? "font-semibold"
                                : ""
                        }
                    `}
                >
                    {category.name}
                </span>


                {hasChildren && (

                    open ? (
                        <ChevronDown
                            size={16}
                        />
                    ) : (
                        <ChevronRight
                            size={16}
                        />
                    )

                )}

            </div>


            {hasChildren && open && (

                <div
                    className="
                        ml-4
                        mt-1
                        space-y-1
                    "
                >

                    {category.children.map(
                        child => (

                            <CategoryNode
                                key={child.slug}
                                category={child}
                                selectedCategory={
                                    selectedCategory
                                }
                                onSelect={
                                    onSelect
                                }
                            />

                        ),
                    )}

                </div>

            )}

        </div>
    );
}


export default CategoryNode;