import { Module } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../schema/comment.schema';
import { Like, LikeSchema } from '../schema/like.schema';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  BLOG_CLIENT,
  BLOG_PORT,
  GATEWAY_CLIENT,
  SOCKET_PORT,
  USER_CLIENT,
  USER_PORT,
} from '@app/common/constant/token';
import { Follow, FollowSchema } from '../schema/follow.schema';

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
      {
        name: BLOG_CLIENT,
        transport: Transport.TCP,
        options: { port: BLOG_PORT },
      },
      {
        name: GATEWAY_CLIENT,
        transport: Transport.TCP,
        options: { port: SOCKET_PORT },
      },
    ]),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
