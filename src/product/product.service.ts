import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { assertDistinctSizes } from './size-prices.util';

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

    const products = await this.productRepository.find({ where });
    return products.filter((p) => {
      const variants = p.sizePrices ?? [];
      if (filters.size) {
        const want = String(filters.size).trim();
        if (!variants.some((v) => v.size.trim() === want)) return false;
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        if (variants.length === 0) return false;
        const minF = filters.minPrice;
        const maxF = filters.maxPrice;
        return variants.some((v) => {
          if (minF !== undefined && v.price < minF) return false;
          if (maxF !== undefined && v.price > maxF) return false;
          return true;
        });
      }
      return true;
    });
  }

  // ✅ Public single product
  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  // ✅ Create product
  async create(dto: CreateProductDto): Promise<Product> {
    assertDistinctSizes(dto.sizePrices);
    const created = this.productRepository.create(dto);
    return this.productRepository.save(created);
  }

  // ✅ Update product
  async updateById(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    if (dto.sizePrices !== undefined) {
      if (!dto.sizePrices.length) {
        throw new BadRequestException('sizePrices cannot be empty');
      }
      assertDistinctSizes(dto.sizePrices);
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
