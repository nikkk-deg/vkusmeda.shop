import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Basket extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        jars: Number,
      },
    ],
  })
  products: { productId: mongoose.Schema.Types.ObjectId; jars: number }[];
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
