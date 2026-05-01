import { DataSource, Repository } from 'typeorm';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../product/schemas/product.schema';
import { MailerService } from './mailer.service';
export declare class OrderService {
    private readonly orderRepository;
    private readonly productRepository;
    private readonly dataSource;
    private readonly mailer;
    constructor(orderRepository: Repository<Order>, productRepository: Repository<Product>, dataSource: DataSource, mailer: MailerService);
    checkout(dto: CreateOrderDto): Promise<Order>;
    private renderEmail;
}
