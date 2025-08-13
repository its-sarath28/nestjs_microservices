import { PartialType } from '@nestjs/mapped-types';
import { BLOG_CATEGORY } from '../enum/blog-category.enum';

export class CreateBlogDto {
  title: string;
  body: string;
  imageUrl?: string[];
  tags?: string[];
  category: BLOG_CATEGORY;
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
