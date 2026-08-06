import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import {
    useState,
} from "react";

import type { Category } from "../../types/Category";


interface Props {
    category: Category;
    selectedCategory: number | null;
    onSelect: (id: number | null) => void;
}


function CategoryNode({
    category,
    selectedCategory,
    onSelect,
}: Props) {


    const [open, setOpen] = useState(false);


    const hasChildren =
        category.children?.length > 0;


    const active =
        selectedCategory === category.id;



    return (
        <div>


            <div
                className={`
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2
                    cursor-pointer
                    transition

                    ${
                        active
                            ? "bg-orange-50 text-orange-600"
                            : "hover:bg-gray-100"
                    }
                `}
                onClick={() => {
                    onSelect(category.id);

                    if (hasChildren) {
                        setOpen(!open);
                    }
                }}
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



                {
                    hasChildren && (

                        open
                            ?
                            <ChevronDown size={16}/>
                            :
                            <ChevronRight size={16}/>

                    )
                }


            </div>



            {
                hasChildren && open && (

                    <div
                        className="
                            ml-4
                            mt-1
                            space-y-1
                        "
                    >

                        {
                            category.children.map(child => (

                                <CategoryNode
                                    key={child.id}
                                    category={child}
                                    selectedCategory={selectedCategory}
                                    onSelect={onSelect}
                                />

                            ))
                        }

                    </div>

                )
            }


        </div>
    );
}


export default CategoryNode;