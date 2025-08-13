import { Inject, Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';
import { BLOG_CLIENT } from '@app/common/constant/token';
import { ClientProxy } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';
import { CreateBlogDto, UpdateBlogDto } from 'apps/blog/dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(@Inject(BLOG_CLIENT) private readonly blogClient: ClientProxy) {}

  create(createBlogDto: CreateBlogDto, userId: number) {
    return firstValueFrom(
      this.blogClient.send(PATTERN.BLOG.CREATE_BLOG, {
        createBlogDto,
        userId,
      }),
    );
  }

  findAll(category?: string, search?: string, sort?: 'asc' | 'des') {
    return firstValueFrom(
      this.blogClient.send(PATTERN.BLOG.FIND_ALL, { category, search, sort }),
    );
  }

  findById(blogId: string) {
    return firstValueFrom(
      this.blogClient.send(PATTERN.BLOG.FIND_BY_ID, blogId),
    );
  }

  update(blogId: string, updateBlogDto: UpdateBlogDto, userId: number) {
    return firstValueFrom(
      this.blogClient.send(PATTERN.BLOG.UPDATE_BLOG, {
        blogId,
        updateBlogDto,
        userId,
      }),
    );
  }

  remove(blogId: string, userId: number) {
    return firstValueFrom(
      this.blogClient.send(PATTERN.BLOG.REMOVE_BLOG, { blogId, userId }),
    );
  }
}
