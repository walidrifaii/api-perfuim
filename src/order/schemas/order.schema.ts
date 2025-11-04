import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

/** Subdocument for items */
@Schema({ _id: false }) // no separate _id for each item
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, min: 0 })
  lineTotal: number;

  // snapshots (optional but useful)
  @Prop({ default: '' })
  name?: string;

  @Prop({ default: '' })
  brand?: string;

  @Prop({ type: [String], default: [] })
  size: string[];
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  _id!: Types.ObjectId;

  // customer
  @Prop({ required: true }) customerName: string;
  @Prop({ required: true }) customerPhone: string;
  @Prop({ required: true }) customerEmail: string;

  // address
  @Prop({ required: true }) addressLine1: string;
  @Prop({ default: '' }) addressLine2: string;
  @Prop({ required: true }) city: string;

  @Prop({ default: '' }) notes: string;

  // payment: Cash on Delivery only
  @Prop({ required: true, enum: ['COD'], default: 'COD' })
  paymentMethod: 'COD';

  // items (array of subdocuments)
  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  // totals
  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({
    default: 'placed',
    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
