import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

// const gfcBucket = new mongo.GridFSBucket();

@Schema({ collection: 'file-uploads' })
export class FileUploads {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  mimetype: string;
}

export type FileUploadsDocument = FileUploads & Document;

export const FileUploadsSchema = SchemaFactory.createForClass(FileUploads);
