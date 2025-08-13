import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GATEWAY_CLIENT, SOCKET_PORT } from '@app/common/constant/token';
import { SocketController } from './socket.controller';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: GATEWAY_CLIENT,
        transport: Transport.TCP,
        options: { port: SOCKET_PORT },
      },
    ]),
  ],
  controllers: [SocketController],
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway],
})
export class SocketModule {}
