/// <reference types="multer" />
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductController {
    private readonly productService;
    private readonly cloudinary;
    constructor(productService: ProductService, cloudinary: CloudinaryService);
    create(body: CreateProductDto, file?: Express.Multer.File): Promise<Product>;
    update(id: string, body: UpdateProductDto, file?: Express.Multer.File): Promise<Product>;
}
