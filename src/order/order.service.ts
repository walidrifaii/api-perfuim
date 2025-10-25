// src/order/order.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { MailerService } from './mailer.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly mailer: MailerService,
  ) {}

  /**
   * Checkout (Cash on Delivery only)
   * - Validates items and stock
   * - Decrements stock atomically (no session/transaction)
   * - Creates order
   * - Sends email (fire-and-forget)
   */
  async checkout(dto: CreateOrderDto): Promise<Order> {
    if (dto.paymentMethod !== 'COD') {
      throw new BadRequestException('Only Cash on Delivery is supported');
    }

    // ---- 1) Load products in one go
    const ids = dto.items.map((i) => new Types.ObjectId(i.productId));
    const products = await this.productModel
      .find({ _id: { $in: ids }, isActive: true })
      .lean()
      .exec();

    const byId = new Map<string, any>(
      products.map((p: any) => [String(p._id), p]),
    );

    // ---- 2) Validate and compute pricing
    let subtotal = 0;
    const items = dto.items.map((it) => {
      const pidStr = String(it.productId);
      const p = byId.get(pidStr);
      if (!p) {
        throw new BadRequestException('Product not available');
      }
      if ((p.quantity ?? 0) < it.quantity) {
        throw new BadRequestException(`Insufficient stock for ${p.name}`);
      }
      const unitPrice = p.price;
      const lineTotal = unitPrice * it.quantity;
      subtotal += lineTotal;

      return {
        productId: new Types.ObjectId(pidStr),
        quantity: it.quantity,
        unitPrice,
        lineTotal,
        name: p.name,
        brand: p.brand,
        size: p.size,
      };
    });

    // ---- 3) Atomically decrement stock for each item
    const ops = dto.items.map((it) => ({
      updateOne: {
        filter: {
          _id: it.productId,
          isActive: true,
          quantity: { $gte: it.quantity },
        },
        update: { $inc: { quantity: -it.quantity } },
      },
    }));

    const bulk = await this.productModel.bulkWrite(ops, { ordered: true });

    // In modern Mongo driver, bulk.modifiedCount exists; fallback for older shapes just in case
    const modified =
      (bulk as any).modifiedCount ??
      (typeof (bulk as any).result?.nModified === 'number'
        ? (bulk as any).result.nModified
        : Array.isArray((bulk as any).result)
        ? (bulk as any).result.reduce(
            (a: number, r: any) => a + (r?.nModified ?? 0),
            0,
          )
        : 0);

    if (modified !== dto.items.length) {
      // Best-effort rollback of any successful decrements
      const rollbackOps = dto.items.map((it) => ({
        updateOne: {
          filter: { _id: it.productId },
          update: { $inc: { quantity: it.quantity } },
        },
      }));
      try {
        await this.productModel.bulkWrite(rollbackOps, { ordered: false });
      } catch {
        // ignore rollback errors
      }
      throw new BadRequestException(
        'Stock changed while ordering. Please try again.',
      );
    }

    // ---- 4) Create order document
    const total = subtotal; // add delivery/taxes if needed later
    const [order] = await this.orderModel.create([
      {
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2 ?? '',
        city: dto.city,
        notes: dto.notes ?? '',
        paymentMethod: 'COD',
        items,
        subtotal,
        total,
        status: 'placed',
      },
    ]);

    // ---- 5) Send email (do NOT await; return immediately)
    const html = this.renderEmail(order);
    this.mailer
      .sendOrderEmail(`New COD Order #${order._id}`, html)
      .catch((error) => console.error('Failed to send order email:', error));

    return order;
  }

  // Simple HTML email renderer
  private renderEmail(order: Order): string {
    const rows = order.items
      .map(
        (i) => `
          <tr>
            <td>${i.name ?? ''}</td>
            <td>${i.brand ?? ''}</td>
            <td>${i.size ?? ''}</td>
            <td>${i.quantity}</td>
            <td>${i.unitPrice.toFixed(2)}</td>
            <td>${i.lineTotal.toFixed(2)}</td>
          </tr>`,
      )
      .join('');

    return `
      <h2>New COD Order #${order._id}</h2>
      <p><b>Name:</b> ${order.customerName}</p>
      <p><b>Phone:</b> ${order.customerPhone}</p>
      <p><b>Email:</b> ${order.customerEmail}</p>
      <p><b>Address:</b> ${order.addressLine1} ${order.addressLine2 ?? ''}, ${
      order.city
    }</p>
      <p><b>Notes:</b> ${order.notes || '-'}</p>
      <p><b>Payment:</b> Cash on Delivery</p>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr><th>Name</th><th>Brand</th><th>Size</th><th>Qty</th><th>Price</th><th>Total</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><td colspan="5" align="right"><b>Subtotal</b></td><td>${order.subtotal.toFixed(
            2,
          )}</td></tr>
          <tr><td colspan="5" align="right"><b>Total</b></td><td>${order.total.toFixed(
            2,
          )}</td></tr>
        </tfoot>
      </table>
    `;
  }
}
