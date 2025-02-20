import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true, unique: true })
  titleEn: string;

  @Prop({ required: true })
  titleRu: string;

  @Prop({ required: true })
  miniCaption: string;

  @Prop({ required: true })
  microCaption: string;

  @Prop({ required: true, type: [String] })
  photos: string[];

  @Prop({ required: true })
  price: number;

  @Prop({
    required: true,
    type: [{ feature: String, value: String }],
    _id: false,
  })
  caption: { feature: string; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
