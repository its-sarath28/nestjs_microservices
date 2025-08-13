import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { GATEWAY_PORT, SOCKET_PORT } from '@app/common/constant/token';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: SOCKET_PORT,
    },
  });

  await app.startAllMicroservices();
  await app.listen(GATEWAY_PORT);

  console.log(`API Gateway is running on: http://localhost:${GATEWAY_PORT}`);
  console.log(`SOCKET is running on: http://localhost:${SOCKET_PORT}`);
}
bootstrap();
