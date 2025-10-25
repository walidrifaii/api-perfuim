import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';

@ApiTags('user  products')
@Controller('user/products') // <- public route prefix
export class PublicProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get all products (public)' })
  @ApiOkResponse({ description: 'List of products returned' })
  @Get()
  async getAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get a product by id (public)' })
  @ApiOkResponse({ description: 'Product returned' })
  @ApiParam({ name: 'id', description: 'Product Mongo ObjectId' })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }
}
