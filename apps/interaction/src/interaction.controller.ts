import { Controller, Logger } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';
import { CreateLikeDto } from '../dto/like.dto';
import {
  CreateCommentDto,
  RemoveCommentDto,
  UpdateCommentDto,
} from '../dto/comment.dto';
import { FollowDto } from '../dto/follow.dto';

@Controller()
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @MessagePattern(PATTERN.INTERACTION.UPDATE_LIKE)
  async updateLike(@Payload() data: CreateLikeDto) {
    Logger.log('Payload data', data);
    return this.interactionService.updateLike(data.blogId, data.userId);
  }

  @MessagePattern(PATTERN.INTERACTION.CREATE_COMMENT)
  async createComment(@Payload() data: CreateCommentDto) {
    return this.interactionService.createComment(
      data.blogId,
      data.comment,
      data.userId,
    );
  }

  @MessagePattern(PATTERN.INTERACTION.COMMENTS_OF_BLOG)
  async getCommentsByBlog(@Payload() blogId: string) {
    return this.interactionService.getCommentsByBlog(blogId);
  }

  @MessagePattern(PATTERN.INTERACTION.UPDATE_COMMENT)
  async updateComment(@Payload() data: UpdateCommentDto) {
    return this.interactionService.updateComment(
      data.commentId,
      data.comment,
      data.userId,
    );
  }

  @MessagePattern(PATTERN.INTERACTION.REMOVE_COMMENT)
  async removeComment(@Payload() data: RemoveCommentDto) {
    return this.interactionService.removeComment(data.commentId, data.userId);
  }

  @MessagePattern(PATTERN.INTERACTION.TOGGLE_FOLLOW)
  async toggleFollow(@Payload() data: FollowDto) {
    return this.interactionService.toggleFollow(
      data.followerId,
      data.followingId,
    );
  }
}
