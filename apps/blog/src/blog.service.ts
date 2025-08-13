import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schema/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { USER_CLIENT } from '@app/common/constant/token';
import { ClientProxy } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @Inject(USER_CLIENT) private readonly userClient: ClientProxy,
  ) {}

  async createBlog(blogData: CreateBlogDto, userId: number): Promise<Blog> {
    const data = Object.assign(blogData, { authorId: userId });

    const res = await this.blogModel.create(data);

    this.userClient.emit(PATTERN.USER.UPDATE_BLOG_COUNT, {
      type: 'inc',
      userId,
    });

    return res;
  }

  async findAll(
    category?: string,
    search?: string,
    sort?: 'asc' | 'des',
  ): Promise<Blog[]> {
    const matchCriteria: Record<string, any> = {};

    if (category?.trim()) {
      matchCriteria.category = category.trim();
    }

    if (search?.trim()) {
      matchCriteria.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          body: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort?.trim()) {
      sortOption = { createdAt: sort === 'asc' ? 1 : -1 };
    }

    const blogs = await this.blogModel.find(matchCriteria).sort(sortOption);

    return blogs;
  }

  async findById(blogId: string): Promise<Blog | null> {
    const blog = await this.blogModel.findById(blogId);

    return blog;
  }

  async updateBlog(
    blogId: string,
    blogData: UpdateBlogDto,
    userId: number,
  ): Promise<Blog | null> {
    let blog = await this.blogModel.findById(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (userId !== blog.authorId) {
      throw new ForbiddenException('Action not allowed');
    }

    blog = await this.blogModel.findByIdAndUpdate(blogId, blogData, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return blog;
  }

  async removeBlog(blogId: string, userId: number) {
    let blog = await this.blogModel.findById(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (userId !== blog.authorId) {
      throw new ForbiddenException('Action not allowed');
    }

    await this.blogModel.findByIdAndDelete(blogId);

    this.userClient.emit(PATTERN.USER.UPDATE_BLOG_COUNT, {
      type: 'dec',
      userId,
    });

    return { success: true };
  }

  async updateLikeCount(type: 'inc' | 'dec', blogId: string) {
    const blog = await this.blogModel.findById(blogId);

    if (blog) {
      const totalLike = blog.totalLike ?? 0;
      const likeCount =
        type === 'inc' ? totalLike + 1 : Math.max(totalLike - 1, 0);

      await this.blogModel.findByIdAndUpdate(
        blog._id,
        { $set: { totalLike: likeCount } },
        { new: true, upsert: true, runValidators: true },
      );
    }
  }

  async updateCommentCount(type: 'inc' | 'dec', blogId: string) {
    const blog = await this.blogModel.findById(blogId);

    if (blog) {
      const totalComment = blog.totalComment ?? 0;
      const commentCount =
        type === 'inc' ? totalComment + 1 : Math.max(totalComment - 1, 0);

      await this.blogModel.findByIdAndUpdate(
        blog._id,
        { $set: { totalComment: commentCount } },
        { new: true, upsert: true, runValidators: true },
      );
    }
  }
}
