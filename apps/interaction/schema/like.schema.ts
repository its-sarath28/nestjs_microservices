import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
  blogId: mongoose.Schema.Types.ObjectId;

  @Prop()
  userId: number;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.index({ blogId: 1, userId: 1 }, { unique: true });
