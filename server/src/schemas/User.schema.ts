import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  surname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true })
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
