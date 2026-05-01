import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  name?: string;
  brand?: string;
  size?: string;
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;
  @Column()
  customerPhone: string;
  @Column()
  customerEmail: string;

  @Column()
  addressLine1: string;
  @Column({ default: '' })
  addressLine2: string;
  @Column()
  city: string;

  @Column({ default: '' })
  notes: string;

  @Column({ type: 'varchar', default: 'COD' })
  paymentMethod: 'COD';

  @Column({ type: 'jsonb', default: () => "'[]'" })
  items: OrderItem[];

  @Column('float')
  subtotal: number;

  @Column('float')
  total: number;

  @Column({ default: 'placed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
