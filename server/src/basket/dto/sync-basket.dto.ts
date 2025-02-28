import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import mongoose from 'mongoose';

class Product {
  @IsMongoId()
  @IsNotEmpty()
  productId: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @Min(1)
  jars: number;
}

export class SyncBasketDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: mongoose.Schema.Types.ObjectId;

  @ValidateNested({ each: true })
  @Type(() => Product)
  @ArrayNotEmpty()
  products: Product[];
}
