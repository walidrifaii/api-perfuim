import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductSex } from '../dto/create-product.dto'; // ✅ reuse the same enum

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  brand: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  size: string[];

  // ✅ Updated enum values here too
  @Prop({
    required: true,
    enum: Object.values(ProductSex),
    default: ProductSex.UNISEX,
  })
  sex: ProductSex;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: '' })
  image: string;

  @Prop({ required: true, min: 0, default: 0 })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
