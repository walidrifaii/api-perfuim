import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(dto: CreateOrderDto): Promise<Order>;
}
