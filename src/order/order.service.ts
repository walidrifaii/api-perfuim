// src/order/order.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../product/schemas/product.schema';
import { resolveVariantForOrder } from '../product/size-prices.util';
import { MailerService } from './mailer.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly mailer: MailerService,
  ) {}

  /**
   * Checkout (Cash on Delivery only)
   * - Validates items and stock
   * - Decrements stock in a single SQL transaction
   * - Creates order
   * - Sends email (fire-and-forget)
   */
  async checkout(dto: CreateOrderDto): Promise<Order> {
    if (dto.paymentMethod !== 'COD') {
      throw new BadRequestException('Only Cash on Delivery is supported');
    }

    const ids = dto.items.map((i) => i.productId);
    const products = await this.productRepository.find({
      where: { id: In(ids), isActive: true },
    });
    const byId = new Map<string, Product>(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const items = dto.items.map((it) => {
      const p = byId.get(it.productId);

      if (!p) {
        throw new BadRequestException('Product not available');
      }

      if ((p.quantity ?? 0) < it.quantity) {
        throw new BadRequestException(`Insufficient stock for ${p.name}`);
      }

      const { unitPrice, sizeLabel } = resolveVariantForOrder(p, it.size);

      const lineTotal = unitPrice * it.quantity;
      subtotal += lineTotal;

      return {
        productId: p.id,
        quantity: it.quantity,
        unitPrice,
        lineTotal,
        name: p.name,
        brand: p.brand,
        size: sizeLabel,
      };
    });

    const total = subtotal;
    const order = await this.dataSource.transaction(async (manager) => {
      for (const it of dto.items) {
        const update = await manager
          .createQueryBuilder()
          .update(Product)
          .set({
            quantity: () => `quantity - ${Number(it.quantity)}`,
          })
          .where('id = :id', { id: it.productId })
          .andWhere('isActive = :active', { active: true })
          .andWhere('quantity >= :qty', { qty: it.quantity })
          .execute();

        if (!update.affected) {
          throw new BadRequestException(
            'Stock changed while ordering. Please try again.',
          );
        }
      }

      return manager.getRepository(Order).save(
        manager.getRepository(Order).create({
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
        }),
      );
    });

    const html = this.renderEmail(order);
    this.mailer
      .sendOrderEmail(`New COD Order #${order.id}`, html)
      .catch((error) => console.error('Failed to send order email:', error));

    return order;
  }

  async getUserCheckouts(customerEmail?: string, customerPhone?: string) {
    const where = this.buildUserWhere(customerEmail, customerPhone);
    return this.orderRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getCheckoutDetails(
    id: string,
    customerEmail?: string,
    customerPhone?: string,
  ): Promise<Order> {
    const where = this.buildUserWhere(customerEmail, customerPhone);
    const order = await this.orderRepository.findOne({
      where: { id, ...where },
    });

    if (!order) {
      throw new NotFoundException('Checkout not found for this user');
    }

    return order;
  }

  async getAllCheckoutsForAdmin(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getCheckoutDetailsForAdmin(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Checkout not found');
    }
    return order;
  }

  private buildUserWhere(customerEmail?: string, customerPhone?: string) {
    if (!customerEmail && !customerPhone) {
      throw new BadRequestException(
        'Provide customerEmail or customerPhone to fetch user checkouts',
      );
    }

    if (customerEmail && customerPhone) {
      return { customerEmail, customerPhone };
    }

    if (customerEmail) {
      return { customerEmail };
    }

    return { customerPhone: customerPhone as string };
  }

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
      <h2>New COD Order #${order.id}</h2>
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
