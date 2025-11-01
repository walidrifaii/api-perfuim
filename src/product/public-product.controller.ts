import { Controller, Get, Query, Param, ParseFloatPipe } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';

@ApiTags('user products')
@Controller('user/products') // Public routes
export class PublicProductController {
  constructor(private readonly productService: ProductService) {}

  // 🟢 Get all products
  @ApiOperation({ summary: 'Get all products (public)' })
  @ApiOkResponse({ description: 'List of products returned' })
  @Get()
  @ApiOperation({ summary: 'Get all products with optional filters' })
  @ApiQuery({ name: 'sex', required: false, enum: ['men', 'women', 'unisex'] })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false })
  async getAllWithQuery(
    @Query('sex') sex?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('size') size?: string,
  ): Promise<Product[]> {
    const filters = {
      sex,
      brand,
      minPrice: minPrice !== undefined ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
      size,
    };
    return this.productService.findWithFilters(filters);
  }

  @ApiOperation({ summary: 'Get all men products (public)' })
  @ApiOkResponse({ description: 'List of men products returned' })
  @Get('/men')
  async getMenProducts(): Promise<Product[]> {
    return this.productService.findBySex('men');
  }

  // 🟢 Get all products for women
  @ApiOperation({ summary: 'Get all women products (public)' })
  @ApiOkResponse({ description: 'List of women products returned' })
  @Get('/women')
  async getWomenProducts(): Promise<Product[]> {
    return this.productService.findBySex('women');
  }

  // 🟢 Get a single product by ID
  @ApiOperation({ summary: 'Get a product by id (public)' })
  @ApiOkResponse({ description: 'Product returned' })
  @ApiParam({ name: 'id', description: 'Product Mongo ObjectId' })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }
}
