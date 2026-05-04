import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class SizePriceDto {
  @ApiProperty({ example: '100 ml' })
  @IsString()
  size: string;

  @ApiProperty({ example: 29.99, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
