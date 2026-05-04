import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { SizePriceDto } from './size-price.dto';

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

  @ApiProperty({
    description: 'Each variant: size label and its price (JSON array or multipart string)',
    type: [SizePriceDto],
    example: [
      { size: '100 ml', price: 19.99 },
      { size: '200 ml', price: 34.99 },
    ],
  })
  @Transform(({ value }) => {
    if (value == null || value === '') return undefined;
    let raw: unknown = value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        raw = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return value;
      }
    }
    if (!Array.isArray(raw)) return raw;
    // Instances required so @ValidateNested({ each: true }) runs per-item validators
    return raw.map((item) =>
      plainToInstance(SizePriceDto, item, { enableImplicitConversion: true }),
    );
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SizePriceDto)
  sizePrices: SizePriceDto[];

  @ApiPropertyOptional({ example: 'Rich moisturizing lotion' })
  @IsOptional()
  @IsString()
  description?: string;

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
