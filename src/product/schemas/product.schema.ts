import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  // free text like "100 ml", "1L", "500g", "Pair", etc.
  @Prop({ default: '', trim: true })
  size: string;

  @Prop({ default: true })
  isActive: boolean;

  // will store the uploaded file path or URL
  @Prop({ default: '' })
  image: string;

  @Prop({ required: true, min: 0, default: 0 })
  quantity: number;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
