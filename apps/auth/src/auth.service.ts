import { PATTERN } from '@app/common/constant/pattern';
import { USER_CLIENT } from '@app/common/constant/token';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from 'apps/api-gateway/src/auth/dto/auth.dto';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_CLIENT) private readonly userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email } = registerDto;

    const existingUser = await firstValueFrom(
      this.userClient.send(PATTERN.USER.FIND_BY_EMAIL, email),
    );

    if (existingUser) {
      throw new ConflictException('Email already found');
    }

    const user = await firstValueFrom(
      this.userClient.send(PATTERN.USER.CREATE_USER, registerDto),
    );

    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, user.email);

    this.userClient.emit(PATTERN.USER.UPDATE_REFRESH_TOKEN, {
      userId: user.id,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await firstValueFrom(
      this.userClient.send(PATTERN.USER.FIND_BY_EMAIL, email),
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, user.email);

    this.userClient.emit(PATTERN.USER.UPDATE_REFRESH_TOKEN, {
      userId: user.id,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async generateAccessToken(userId: number, email: string) {
    const payload = { userId, email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d',
    });

    return accessToken;
  }

  async generateRefreshToken(userId: number, email: string) {
    const payload = { userId, email };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return refreshToken;
  }
}
