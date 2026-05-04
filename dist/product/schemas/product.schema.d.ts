import { ProductSex } from '../dto/create-product.dto';
export interface ProductSizePrice {
    size: string;
    price: number;
}
export declare class Product {
    id: string;
    name: string;
    brand: string;
    sizePrices: ProductSizePrice[];
    description: string;
    sex: ProductSex;
    isActive: boolean;
    image: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}
