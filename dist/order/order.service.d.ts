import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductDocument } from '../product/schemas/product.schema';
import { MailerService } from './mailer.service';
export declare class OrderService {
    private readonly orderModel;
    private readonly productModel;
    private readonly mailer;
    constructor(orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>, mailer: MailerService);
    checkout(dto: CreateOrderDto): Promise<Order>;
    private renderEmail;
}
