import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { CheckoutUserQueryDto } from './dto/checkout-user-query.dto';

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

  @ApiOperation({ summary: 'Get all checkouts for a user' })
  @ApiOkResponse({ description: 'List of user checkouts', type: [Order] })
  @ApiQuery({ name: 'customerEmail', required: false, type: String })
  @ApiQuery({ name: 'customerPhone', required: false, type: String })
  @Get()
  async getUserCheckouts(@Query() query: CheckoutUserQueryDto): Promise<Order[]> {
    return this.orderService.getUserCheckouts(
      query.customerEmail,
      query.customerPhone,
    );
  }

  @ApiOperation({ summary: 'Get checkout details for a user' })
  @ApiOkResponse({ description: 'Checkout details', type: Order })
  @ApiParam({ name: 'id', description: 'Checkout ID (UUID)' })
  @ApiQuery({ name: 'customerEmail', required: false, type: String })
  @ApiQuery({ name: 'customerPhone', required: false, type: String })
  @Get(':id')
  async getCheckoutDetails(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: CheckoutUserQueryDto,
  ): Promise<Order> {
    return this.orderService.getCheckoutDetails(
      id,
      query.customerEmail,
      query.customerPhone,
    );
  }
}
