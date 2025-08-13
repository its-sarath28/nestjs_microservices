import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BLOG_CLIENT, BLOG_PORT } from '@app/common/constant/token';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BLOG_CLIENT,
        transport: Transport.TCP,
        options: { port: BLOG_PORT },
      },
    ]),
    AuthModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
