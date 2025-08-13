import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  INTERACTION_CLIENT,
  INTERACTION_PORT,
} from '@app/common/constant/token';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: INTERACTION_CLIENT,
        transport: Transport.TCP,
        options: { port: INTERACTION_PORT },
      },
    ]),
    AuthModule,
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
