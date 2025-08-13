import {
  BLOG_CLIENT,
  GATEWAY_CLIENT,
  USER_CLIENT,
} from '@app/common/constant/token';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../schema/like.schema';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { PATTERN } from '@app/common/constant/pattern';
import { Comment } from '../schema/comment.schema';
import { Follow } from '../schema/follow.schema';
import { User } from 'apps/user/src/entity/user.entity';
import { CommentWithId } from '../types/types';
import { Blog } from 'apps/blog/schema/blog.schema';

@Injectable()
export class InteractionService {
  constructor(
    @Inject(USER_CLIENT) private readonly userClient: ClientProxy,
    @Inject(BLOG_CLIENT) private readonly blogClient: ClientProxy,
    @Inject(GATEWAY_CLIENT)
    private readonly gatewayClient: ClientProxy,

    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
  ) {}

  async updateLike(blogId: string, userId: number) {
    const [blog, existingLike, user]: [Blog | null, Like | null, User | null] =
      await Promise.all([
        firstValueFrom(this.blogClient.send(PATTERN.BLOG.FIND_BY_ID, blogId)),
        this.likeModel.findOne({ blogId, userId }),
        firstValueFrom(this.blogClient.send(PATTERN.USER.FIND_BY_ID, userId)),
      ]);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (existingLike) {
      await this.likeModel.findByIdAndDelete(existingLike._id);

      this.blogClient.emit(PATTERN.BLOG.UPDATE_LIKE_COUNT, {
        type: 'dec',
        blogId,
      });

      return {
        liked: false,
        message: 'Unliked successfully',
      };
    }

    await this.likeModel.create({ blogId, userId });

    this.blogClient.emit(PATTERN.BLOG.UPDATE_LIKE_COUNT, {
      type: 'inc',
      blogId,
    });

    this.gatewayClient.emit(PATTERN.SOCKET.NOTIFY_NEW_LIKE, {
      authorId: blog.authorId.toString(),
      user: {
        fullName: user?.fullName,
        imageUrl: user?.imageUrl,
      },
    });

    return {
      liked: true,
      message: 'Liked successfully',
    };
  }

  async createComment(blogId: string, comment: string, userId: number) {
    const [blog, user]: [Blog | null, User | null] = await Promise.all([
      firstValueFrom(this.blogClient.send(PATTERN.BLOG.FIND_BY_ID, blogId)),
      firstValueFrom(this.userClient.send(PATTERN.USER.FIND_BY_ID, userId)),
    ]);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const newComment = await this.commentModel.create({
      blogId,
      comment,
      userId,
    });

    this.blogClient.emit(PATTERN.BLOG.UPDATE_COMMENT_COUNT, {
      type: 'inc',
      blogId,
    });

    this.gatewayClient.emit(PATTERN.SOCKET.NOTIFY_NEW_COMMENT, {
      authorId: blog.authorId.toString(),
      comment,
      user: {
        fullName: user?.fullName,
        imageUrl: user?.imageUrl,
      },
    });

    return newComment;
  }

  async updateComment(commentId: string, comment: string, userId: number) {
    const commentFound: Comment | null =
      await this.commentModel.findById(commentId);

    if (!commentFound) {
      throw new NotFoundException('Comment not found');
    }

    if (commentFound.userId !== userId) {
      throw new ForbiddenException('Action not allowed');
    }

    const updatedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      {
        $set: {
          comment,
        },
      },
      { new: true },
    );

    return updatedComment;
  }

  async removeComment(commentId: string, userId: number) {
    const commentFound: Comment | null =
      await this.commentModel.findById(commentId);

    if (!commentFound) {
      throw new NotFoundException('Comment not found');
    }

    if (commentFound.userId !== userId) {
      throw new ForbiddenException('Action not allowed');
    }

    await this.commentModel.findByIdAndDelete(commentId);

    this.blogClient.emit(PATTERN.BLOG.UPDATE_COMMENT_COUNT, {
      type: 'dec',
      blogId: commentFound.blogId,
    });

    return { success: true, message: 'Comment removed' };
  }

  async getCommentsByBlog(blogId: string) {
    const comments = await this.commentModel
      .find({ blogId })
      .sort({ createdAt: -1 })
      .lean<CommentWithId[]>();

    return await Promise.all(
      comments.map(async (comment) => {
        const user: User = await firstValueFrom(
          this.userClient.send(PATTERN.USER.FIND_BY_ID, comment.userId),
        );

        return {
          commentId: comment._id.toString(),
          comment: comment.comment,
          isEdited: comment.isEdited,
          createdAt: comment.createdAt,
          user: {
            id: user.id,
            name: user.fullName ?? null,
            imageUrl: user.imageUrl ?? null,
          },
        };
      }),
    );
  }

  async toggleFollow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existing = await this.followModel.findOne({
      followerId,
      followingId,
    });

    if (existing) {
      await this.followModel.deleteOne({ _id: existing._id });
      return { message: 'Unfollowed successfully', following: false };
    }

    const user: User | null = await firstValueFrom(
      this.userClient.send(PATTERN.USER.FIND_BY_ID, followerId),
    );

    await this.followModel.create({ followerId, followingId });

    this.gatewayClient.emit(PATTERN.SOCKET.NOTIFY_NEW_FOLLOWER, {
      followingId: followingId.toString(),
      fullName: user?.fullName,
      imageUrl: user?.imageUrl,
    });

    return { message: 'Followed successfully', following: true };
  }
}
