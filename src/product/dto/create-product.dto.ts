import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// ✅ Updated enum
export enum ProductSex {
  MEN = 'men',
  WOMEN = 'women',
  UNISEX = 'unisex',
}
export class CreateProductDto {
  @ApiProperty({ example: 'Body Lotion' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Nivea' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 29.99, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'Rich moisturizing lotion' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['100 ml', '200 ml'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map((v) => v.trim());
    return Array.isArray(value) ? value : [];
  })
  size?: string[];

  // ✅ Use the new enum
  @ApiProperty({ example: 'unisex', enum: ProductSex })
  @IsEnum(ProductSex)
  sex: ProductSex;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 50, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;
}
