import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Blog, BlogSchema } from '../schema/blog.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_CLIENT, USER_PORT } from '@app/common/constant/token';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: USER_CLIENT,
        transport: Transport.TCP,
        options: { port: USER_PORT },
      },
    ]),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
