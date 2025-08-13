import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CLIENT } from '@app/common/constant/token';
import { ClientProxy } from '@nestjs/microservices';
import { PATTERN } from '@app/common/constant/pattern';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy) {}

  register(registerDto: RegisterDto) {
    return this.authClient.send(PATTERN.AUTH.REGISTER, registerDto);
  }

  login(loginDto: LoginDto) {
    return this.authClient.send(PATTERN.AUTH.LOGIN, loginDto);
  }
}
