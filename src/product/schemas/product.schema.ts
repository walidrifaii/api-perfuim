import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductSex } from '../dto/create-product.dto'; // ✅ reuse the same enum

export interface ProductSizePrice {
  size: string;
  price: number;
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  sizePrices: ProductSizePrice[];

  @Column({ default: '' })
  description: string;

  @Column({
    type: 'enum',
    enum: Object.values(ProductSex),
    default: ProductSex.UNISEX,
  })
  sex: ProductSex;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: '' })
  image: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
