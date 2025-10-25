import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

  @ApiPropertyOptional({ example: '100 ml' })
  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true') // 👈 convert string->boolean
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/..../image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  // ✅ stock / quantity
  @ApiProperty({ example: 50, minimum: 0, description: 'Units in stock' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;
}
