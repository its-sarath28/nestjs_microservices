import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';
import { RegisterDto } from 'apps/api-gateway/src/auth/dto/auth.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(PATTERN.USER.FIND_BY_EMAIL)
  async findByEmail(@Payload() email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern(PATTERN.USER.FIND_BY_ID)
  async findById(@Payload() userId: number) {
    return this.userService.findById(userId);
  }

  @MessagePattern(PATTERN.USER.CREATE_USER)
  async createUser(@Payload() dto: RegisterDto) {
    return this.userService.createUser(dto);
  }

  @EventPattern(PATTERN.USER.UPDATE_REFRESH_TOKEN)
  async updateRefreshToken(@Payload() data: { token: string; userId: string }) {
    return this.userService.updateRefreshToken(+data.userId, data.token);
  }

  @EventPattern(PATTERN.USER.UPDATE_BLOG_COUNT)
  async updateBlogCount(
    @Payload() data: { type: 'inc' | 'dec'; userId: number },
  ) {
    return this.userService.updateBlogCount(data.userId, data.type);
  }
}
