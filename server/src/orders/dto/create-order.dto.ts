import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class OrderProductDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @Min(1, { message: 'Jars must be at least 1' })
  jars: number;
}

export class CreateOrderDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  @IsNotEmpty({ message: 'Products cannot be empty' })
  products: OrderProductDto[];
}
