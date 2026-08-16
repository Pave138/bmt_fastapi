export interface Category {
    id: number;
    slug: string;
    name: string;
    parent_id: number | null;
    children: Category[];
}