import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { CheckoutUserQueryDto } from './dto/checkout-user-query.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(dto: CreateOrderDto): Promise<Order>;
    getUserCheckouts(query: CheckoutUserQueryDto): Promise<Order[]>;
    getCheckoutDetails(id: string, query: CheckoutUserQueryDto): Promise<Order>;
}
