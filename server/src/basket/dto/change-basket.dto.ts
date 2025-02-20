import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';
import mongoose from 'mongoose';

export class ChangeBasketJarsDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  productId: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @Min(1)
  jars: number;
}
