import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_CLIENT,
  AUTH_PORT,
  BLOG_CLIENT,
  BLOG_PORT,
  GATEWAY_CLIENT,
  INTERACTION_CLIENT,
  INTERACTION_PORT,
  SOCKET_PORT,
  USER_CLIENT,
  USER_PORT,
} from '@app/common/constant/token';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { InteractionModule } from './interaction/interaction.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_CLIENT,
        transport: Transport.TCP,
        options: { port: AUTH_PORT },
      },
      {
        name: USER_CLIENT,
        transport: Transport.TCP,
        options: { port: USER_PORT },
      },
      {
        name: BLOG_CLIENT,
        transport: Transport.TCP,
        options: { port: BLOG_PORT },
      },
      {
        name: INTERACTION_CLIENT,
        transport: Transport.TCP,
        options: { port: INTERACTION_PORT },
      },
      {
        name: GATEWAY_CLIENT,
        transport: Transport.TCP,
        options: { port: SOCKET_PORT },
      },
    ]),
    AuthModule,
    BlogModule,
    InteractionModule,
    SocketModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
