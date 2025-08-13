import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
  blogId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: false })
  isEdited: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
