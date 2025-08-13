import { Controller } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';
import { NewCommentDto, NewLikeDto } from './dto/socket.dto';

@Controller()
export class SocketController {
  constructor(private readonly socketGateway: SocketGateway) {}

  @MessagePattern(PATTERN.SOCKET.NOTIFY_NEW_COMMENT)
  handleNotifyNewComment(@Payload() data: NewCommentDto) {
    this.socketGateway.handleNotifyNewComment(data);
  }

  @MessagePattern(PATTERN.SOCKET.NOTIFY_NEW_LIKE)
  handleNotifyNewLike(@Payload() data: NewLikeDto) {
    this.socketGateway.handleNotifyNewLike(data);
  }
}
