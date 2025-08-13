import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqUserDto } from '../auth/dto/auth.dto';

@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post('create-comment')
  @UseGuards(AuthGuard())
  createComment(
    @Body() commentDto: { blogId: string; comment: string },
    @Req() req: ReqUserDto,
  ) {
    return this.interactionService.createComment(commentDto, req.user.id);
  }

  @Get('comment')
  getCommentsByBlog(@Query('blogId') blogId: string) {
    return this.interactionService.getCommentsByBlog(blogId);
  }

  @Patch('follow')
  @UseGuards(AuthGuard())
  toggleFollow(@Body() data: { followingId: number }, @Req() req: ReqUserDto) {
    return this.interactionService.toggleFollow(req.user.id, data.followingId);
  }

  @Patch('update-comment/:commentId')
  @UseGuards(AuthGuard())
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateComment: { comment: string },
    @Req() req: ReqUserDto,
  ) {
    return this.interactionService.updateComment(
      commentId,
      updateComment.comment,
      req.user.id,
    );
  }

  @Patch('update-like/:blogId')
  @UseGuards(AuthGuard())
  updateLike(@Param('blogId') blogId: string, @Req() req: ReqUserDto) {
    return this.interactionService.updateLike(blogId, req.user.id);
  }

  @Delete('remove-comment/:commentId')
  @UseGuards(AuthGuard())
  removeComment(@Param('commentId') commentId: string, @Req() req: ReqUserDto) {
    return this.interactionService.removeComment(commentId, req.user.id);
  }
}
