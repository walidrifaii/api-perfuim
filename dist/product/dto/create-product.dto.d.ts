import { SizePriceDto } from './size-price.dto';
export declare enum ProductSex {
    MEN = "men",
    WOMEN = "women",
    UNISEX = "unisex"
}
export declare class CreateProductDto {
    name: string;
    brand: string;
    sizePrices: SizePriceDto[];
    description?: string;
    sex: ProductSex;
    isActive?: boolean;
    image?: string;
    quantity: number;
}
