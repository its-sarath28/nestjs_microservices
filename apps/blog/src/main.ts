import { NestFactory } from '@nestjs/core';
import { BlogModule } from './blog.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BLOG_PORT } from '@app/common/constant/token';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlogModule,
    {
      transport: Transport.TCP,
      options: { port: BLOG_PORT },
    },
  );
  await app.listen();
}
bootstrap();
