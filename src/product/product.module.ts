import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ProductController } from './product.controller';
import { PublicProductController } from './public-product.controller'; // <- add
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MulterModule.register(),
    CloudinaryModule,
  ],
  controllers: [ProductController, PublicProductController], // <- add here
  providers: [ProductService],
})
export class ProductModule {}
