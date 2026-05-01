import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { Product } from './product/schemas/product.schema';
import { Admin } from './admin/schemas/admin.schema';
import { Order } from './order/schemas/order.schema';
import { Book } from './book/schemas/book.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const postgresUrl =
          configService.get<string>('DATABASE_URL') ||
          configService.get<string>('DB_URI');
        if (!postgresUrl) {
          throw new Error(
            'Missing DATABASE_URL (or DB_URI) environment variable. Add it to your .env file.',
          );
        }

        return {
          type: 'postgres' as const,
          url: postgresUrl,
          entities: [Product, Admin, Order, Book],
          synchronize: true,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AdminsModule,
    AuthModule,
    ProductModule,
    OrderModule,
  ],
})
export class AppModule {}
