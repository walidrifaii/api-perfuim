import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './schemas/order.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Product } from '../product/schemas/product.schema';
import { MailerService } from './mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product])],
  controllers: [OrderController],
  providers: [OrderService, MailerService],
})
export class OrderModule {}
