import { NestFactory } from '@nestjs/core';
import { InteractionModule } from './interaction.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { INTERACTION_PORT } from '@app/common/constant/token';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InteractionModule,
    {
      transport: Transport.TCP,
      options: { port: INTERACTION_PORT },
    },
  );
  await app.listen();
}
bootstrap();
