import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

import { PATTERN } from '@app/common/constant/pattern';
import { NewCommentDto } from './dto/socket.dto';
import { AuthenticatedSocket } from './type';
import { GATEWAY_CLIENT } from '@app/common/constant/token';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(GATEWAY_CLIENT) private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid token');
      }

      const token = authHeader.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      if (!payload?.userId) {
        throw new UnauthorizedException('Invalid payload');
      }

      client.user = {
        id: payload.userId.toString(),
        email: payload.email,
      };

      console.log(`✅ ${client.user.email} connected - ${client.id}`);
    } catch (err) {
      console.error(`❌ Socket connection refused: ${err.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    client.disconnect(true);
    console.log(`Client disconnected: ${client.id}`);
  }

  handleNotifyNewComment(data: NewCommentDto) {
    const { authorId, comment, user } = data;

    this.server.sockets.sockets.forEach((sock) => {
      const socket = sock as AuthenticatedSocket;
      if (socket.user?.id.toString() === authorId.toString()) {
        socket.emit('newComment', { comment, user });
      }
    });
  }
}
