import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
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

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  // ✅ Public list
  async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findWithFilters(filters: ProductFilters): Promise<Product[]> {
    const query: any = { isActive: true }; // only active products

    if (filters.sex) query.sex = filters.sex;
    if (filters.brand) query.brand = filters.brand;
    if (filters.minPrice !== undefined)
      query.price = { ...query.price, $gte: filters.minPrice };
    if (filters.maxPrice !== undefined)
      query.price = { ...query.price, $lte: filters.maxPrice };
    if (filters.size) query.size = filters.size; // exact match; you can use $in if needed

    return this.productModel.find(query).exec();
  }

  // ✅ Public single product
  async findById(id: string): Promise<Product> {
    if (!isValidObjectId(id)) throw new NotFoundException('Product not found.');
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  // ✅ Create product
  async create(dto: CreateProductDto): Promise<Product> {
    const created = await this.productModel.create(dto);
    return created;
  }

  // ✅ Update product
  async updateById(id: string, dto: UpdateProductDto): Promise<Product> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Product not found.');
    }
    const updated = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundException('Product not found.');
    }
    return updated;
  }

  async findBySex(sex: string): Promise<Product[]> {
    return this.productModel.find({ sex, isActive: true }).exec();
  }
}
