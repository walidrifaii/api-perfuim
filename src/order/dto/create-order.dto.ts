import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayMinSize,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: '66f3c5b2d0e2ec3f55e7babc' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: '100ml', required: false })
  @IsString()
  size?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '+96181202935' })
  @IsPhoneNumber()
  customerPhone: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: 'Street 1, Building 2' })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({ example: 'Floor 3, Apt 12', required: false })
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'Beirut' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Please call on arrival', required: false })
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'COD' })
  @IsString()
  paymentMethod: 'COD';

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
