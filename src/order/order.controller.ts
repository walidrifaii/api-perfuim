import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@ApiTags('checkout')
@Controller('user/checkout') // public route
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Place order (Cash on Delivery)' })
  @ApiCreatedResponse({ description: 'Order placed successfully' })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.checkout(dto);
  }
}
