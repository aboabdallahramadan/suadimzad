import { SubCategory } from "./subcategory";
export type Category = {
    id: string;
    title: string;
    adsCount: number;
    subcategories: SubCategory[];
}