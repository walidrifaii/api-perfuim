export declare enum ProductSex {
    MEN = "men",
    WOMEN = "women",
    UNISEX = "unisex"
}
export declare class CreateProductDto {
    name: string;
    brand: string;
    price: number;
    description?: string;
    size?: string[];
    sex: ProductSex;
    isActive?: boolean;
    image?: string;
    quantity: number;
}
