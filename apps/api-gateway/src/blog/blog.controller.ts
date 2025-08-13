import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from 'apps/blog/dto/blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqUserDto } from '../auth/dto/auth.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: ReqUserDto) {
    return this.blogService.create(createBlogDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'des',
  ) {
    return this.blogService.findAll(category, search, sort);
  }

  @Get(':blogId')
  findOne(@Param('blogId') blogId: string) {
    return this.blogService.findById(blogId);
  }

  @Patch(':blogId')
  @UseGuards(AuthGuard())
  update(
    @Param('blogId') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: ReqUserDto,
  ) {
    return this.blogService.update(blogId, updateBlogDto, req.user.id);
  }

  @Delete(':blogId')
  @UseGuards(AuthGuard())
  remove(@Param('blogId') blogId: string, @Req() req: ReqUserDto) {
    return this.blogService.remove(blogId, req.user.id);
  }
}
