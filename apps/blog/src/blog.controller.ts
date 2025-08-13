import { Controller } from '@nestjs/common';
import { BlogService } from './blog.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { Blog } from '../schema/blog.schema';

@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @MessagePattern(PATTERN.BLOG.CREATE_BLOG)
  async createBlog(
    @Payload() data: { createBlogDto: CreateBlogDto; userId: number },
  ): Promise<Blog> {
    return this.blogService.createBlog(data.createBlogDto, data.userId);
  }

  @MessagePattern(PATTERN.BLOG.FIND_ALL)
  async findAll(
    @Payload()
    data: {
      search?: string;
      category?: string;
      sort?: 'asc' | 'des';
    },
  ) {
    return this.blogService.findAll(data?.category, data.search, data.sort);
  }

  @MessagePattern(PATTERN.BLOG.FIND_BY_ID)
  async findById(@Payload() blogId: string) {
    return this.blogService.findById(blogId);
  }

  @MessagePattern(PATTERN.BLOG.UPDATE_BLOG)
  async updateBlog(
    @Payload()
    data: {
      updateBlogDto: UpdateBlogDto;
      blogId: string;
      userId: number;
    },
  ): Promise<Blog | null> {
    return this.blogService.updateBlog(
      data.blogId,
      data.updateBlogDto,
      data.userId,
    );
  }

  @MessagePattern(PATTERN.BLOG.REMOVE_BLOG)
  async removeBlog(@Payload() data: { blogId: string; userId: number }) {
    return this.blogService.removeBlog(data.blogId, data.userId);
  }

  @EventPattern(PATTERN.BLOG.UPDATE_LIKE_COUNT)
  async updateLikeCount(
    @Payload() data: { type: 'inc' | 'dec'; blogId: string },
  ) {
    return this.blogService.updateLikeCount(data.type, data.blogId);
  }

  @EventPattern(PATTERN.BLOG.UPDATE_COMMENT_COUNT)
  async updateCommentCount(
    @Payload() data: { type: 'inc' | 'dec'; blogId: string },
  ) {
    return this.blogService.updateCommentCount(data.type, data.blogId);
  }
}
