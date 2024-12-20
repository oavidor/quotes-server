import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quote extends Document {
  @Prop({ required: true, unique: true, index: 1 }) id: number;
  @Prop({ required: true }) body: string;
  @Prop({ required: true }) author: string;
  @Prop([String]) tags: string[];
  @Prop({ default: Date.now }) createdAt: Date;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
