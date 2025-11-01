import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
export declare class PublicProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getAllWithQuery(sex?: string, brand?: string, minPrice?: string, maxPrice?: string, size?: string): Promise<Product[]>;
    getMenProducts(): Promise<Product[]>;
    getWomenProducts(): Promise<Product[]>;
    getOne(id: string): Promise<Product>;
}
