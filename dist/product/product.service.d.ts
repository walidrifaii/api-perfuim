import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
interface ProductFilters {
    sex?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
}
export declare class ProductService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    findAll(): Promise<Product[]>;
    findWithFilters(filters: ProductFilters): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    updateById(id: string, dto: UpdateProductDto): Promise<Product>;
    findBySex(sex: string): Promise<Product[]>;
}
export {};
