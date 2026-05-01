import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface ProductFilters {
  sex?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // ✅ Public list
  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findWithFilters(filters: ProductFilters): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = { isActive: true };

    if (filters.sex) where.sex = filters.sex as any;
    if (filters.brand) where.brand = filters.brand;
    if (filters.minPrice !== undefined)
      where.price = MoreThanOrEqual(filters.minPrice);
    if (filters.maxPrice !== undefined)
      where.price =
        filters.minPrice !== undefined
          ? Between(filters.minPrice, filters.maxPrice)
          : LessThanOrEqual(filters.maxPrice);

    const products = await this.productRepository.find({ where });
    if (filters.size) {
      return products.filter((p) => p.size?.includes(filters.size as string));
    }
    return products;
  }

  // ✅ Public single product
  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  // ✅ Create product
  async create(dto: CreateProductDto): Promise<Product> {
    const created = this.productRepository.create(dto);
    return this.productRepository.save(created);
  }

  // ✅ Update product
  async updateById(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    const merged = this.productRepository.merge(product, dto);
    return this.productRepository.save(merged);
  }

  async findBySex(sex: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { sex: sex as any, isActive: true },
    });
  }
}
