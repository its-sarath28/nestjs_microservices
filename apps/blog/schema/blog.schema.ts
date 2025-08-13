import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BLOG_CATEGORY } from '../enum/blog-category.enum';

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop({ default: [] })
  imageUrl?: string[];

  @Prop({ default: [] })
  tags?: string[];

  @Prop({ type: String, enum: BLOG_CATEGORY })
  category: BLOG_CATEGORY;

  @Prop()
  authorId: number;

  @Prop({ default: 0 })
  totalLike: number;

  @Prop({ default: 0 })
  totalComment: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
