import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: false })
  isActive: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  surname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  phoneNumber: string;

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

export const OrderSchema = SchemaFactory.createForClass(Order);
