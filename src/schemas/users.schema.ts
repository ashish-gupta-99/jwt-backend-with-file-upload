import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class Users {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: number;
}

export type CatDocument = Users & Document;

export const CatSchema = SchemaFactory.createForClass(Users);
