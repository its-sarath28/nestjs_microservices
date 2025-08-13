import { Inject, Injectable, Logger } from '@nestjs/common';
import { INTERACTION_CLIENT } from '@app/common/constant/token';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PATTERN } from '@app/common/constant/pattern';

@Injectable()
export class InteractionService {
  constructor(
    @Inject(INTERACTION_CLIENT) private readonly interactionClient: ClientProxy,
  ) {}

  createComment(
    commentDto: { blogId: string; comment: string },
    userId: number,
  ) {
    return firstValueFrom(
      this.interactionClient.send(PATTERN.INTERACTION.CREATE_COMMENT, {
        ...commentDto,
        userId,
      }),
    );
  }

  getCommentsByBlog(blogId: string) {
    return firstValueFrom(
      this.interactionClient.send(PATTERN.INTERACTION.COMMENTS_OF_BLOG, blogId),
    );
  }

  updateComment(commentId: string, comment: string, userId: number) {
    return firstValueFrom(
      this.interactionClient.send(PATTERN.INTERACTION.UPDATE_COMMENT, {
        comment,
        commentId,
        userId,
      }),
    );
  }

  updateLike(blogId: string, userId: number) {
    return firstValueFrom(
      this.interactionClient.send(PATTERN.INTERACTION.UPDATE_LIKE, {
        blogId,
        userId,
      }),
    );
  }

  toggleFollow(followerId: number, followingId: number) {
    return firstValueFrom(
      this.interactionClient.send(PATTERN.INTERACTION.TOGGLE_FOLLOW, {
        followerId,
        followingId,
      }),
    );
  }

  removeComment(commentId: string, userId: number) {
    return firstValueFrom(
      this.interactionClient.send(PATTERN.INTERACTION.REMOVE_COMMENT, {
        commentId,
        userId,
      }),
    );
  }
}
