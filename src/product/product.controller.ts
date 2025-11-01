import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Express } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

// 🔐 admin-only auth
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Products')
@ApiBearerAuth('bearer')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // --------- CREATE (admin only) ----------
  @ApiOperation({ summary: 'Create a product (image upload to Cloudinary)' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'brand', 'price', 'sex'],
      properties: {
        name: { type: 'string', example: 'Body Lotion' },
        brand: { type: 'string', example: 'Nivea' },
        price: { type: 'number', example: 29.99 },
        quantity: { type: 'number', example: 500 },
        description: { type: 'string', example: 'Rich moisturizing lotion' },
        size: {
          type: 'array',
          items: { type: 'string' },
          example: ['100 ml', '200 ml'],
        },
        sex: {
          type: 'string',
          enum: ['men', 'women', 'unisex'],
          example: 'women',
        },
        isActive: { type: 'boolean', example: true },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @Post()
  async create(
    @Body() body: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    if (file?.buffer) {
      const res = await this.cloudinary.uploadBuffer(
        file.buffer,
        file.originalname,
      );
      body.image = res.secure_url;
    }
    return this.productService.create(body);
  }

  // --------- UPDATE (admin only) ----------
  @ApiOperation({
    summary: 'Update a product by id (optional image upload to Cloudinary)',
  })
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiParam({ name: 'id', description: 'Product Mongo ObjectId' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        brand: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
        size: {
          type: 'array',
          items: { type: 'string' },
          example: ['250 ml', '500 ml'],
        },
        sex: { type: 'string', enum: ['men', 'women', 'unisex'] },
        isActive: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    if (file?.buffer) {
      const res = await this.cloudinary.uploadBuffer(
        file.buffer,
        file.originalname,
      );
      (body as any).image = res.secure_url;
    }
    return this.productService.updateById(id, body);
  }

  // --------- GET PRODUCTS BY SEX ----------
  @ApiOperation({ summary: 'Get all products for men' })
  @ApiOkResponse({ description: 'List of products for men' })
  @Get('men')
  async getMenProducts(): Promise<Product[]> {
    return this.productService.findBySex('men');
  }

  @ApiOperation({ summary: 'Get all products for women' })
  @ApiOkResponse({ description: 'List of products for women' })
  @Get('women')
  async getWomenProducts(): Promise<Product[]> {
    return this.productService.findBySex('women');
  }
}
