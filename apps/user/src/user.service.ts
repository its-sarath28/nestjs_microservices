import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'apps/api-gateway/src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email: email.toLowerCase() });

    return user;
  }

  async findById(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    return user;
  }

  async createUser(dto: RegisterDto) {
    const { email, fullName, password } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await this.userRepo.save(user);

    return user;
  }

  async updateRefreshToken(userId: number, token: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (user) {
      await this.userRepo.update({ id: userId }, { refreshToken: token });
    }
  }

  async updateBlogCount(userId: number, type: 'inc' | 'dec') {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (user) {
      const blogCount = user.totalBlog;

      const updatedCount = type === 'inc' ? blogCount + 1 : blogCount - 1;

      await this.userRepo.update({ id: userId }, { totalBlog: updatedCount });
    }
  }
}
