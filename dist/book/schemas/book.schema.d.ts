export declare enum Category {
    ADVENTURE = "Adventure",
    CALSSICS = "Classics",
    CRIME = "Crime",
    FANTASY = "Fantasy"
}
export declare class Book {
    id: string;
    title: string;
    description: string;
    author: string;
    price: number;
    category: Category;
}
