import { ProductSex } from '../dto/create-product.dto';
export declare class Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    description: string;
    size: string[];
    sex: ProductSex;
    isActive: boolean;
    image: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}
