import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class RemoveFromBasketDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  productId: mongoose.Schema.Types.ObjectId;
}
