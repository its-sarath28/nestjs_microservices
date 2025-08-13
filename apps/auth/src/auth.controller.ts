import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';
import { LoginDto, RegisterDto } from 'apps/api-gateway/src/auth/dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(PATTERN.AUTH.REGISTER)
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern(PATTERN.AUTH.LOGIN)
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
