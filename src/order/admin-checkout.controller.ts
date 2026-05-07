import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Order } from './schemas/order.schema';
import { OrderService } from './order.service';

@ApiTags('admin-checkout')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/checkout')
export class AdminCheckoutController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all checkouts (admin)' })
  @ApiOkResponse({ description: 'All checkouts', type: [Order] })
  @Get()
  async getAllCheckouts(): Promise<Order[]> {
    return this.orderService.getAllCheckoutsForAdmin();
  }

  @ApiOperation({ summary: 'Get checkout details by ID (admin)' })
  @ApiOkResponse({ description: 'Checkout details', type: Order })
  @ApiParam({ name: 'id', description: 'Checkout ID (UUID)' })
  @Get(':id')
  async getCheckoutDetails(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderService.getCheckoutDetailsForAdmin(id);
  }
}
