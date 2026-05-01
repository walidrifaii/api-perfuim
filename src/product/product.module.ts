import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProductController } from './product.controller';
import { PublicProductController } from './public-product.controller'; // <- add
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    MulterModule.register(),
    CloudinaryModule,
  ],
  controllers: [ProductController, PublicProductController], // <- add here
  providers: [ProductService],
})
export class ProductModule {}
