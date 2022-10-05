import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

// const gfcBucket = new mongo.GridFSBucket();

@Schema({ collection: 'users' })
export class Users {
  @Prop()
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  gender: string;
}

export type UsersDocument = Users & Document;

export const UsersSchema = SchemaFactory.createForClass(Users);
