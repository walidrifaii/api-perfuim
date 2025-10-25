import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
export declare class PublicProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getAll(): Promise<Product[]>;
    getOne(id: string): Promise<Product>;
}
