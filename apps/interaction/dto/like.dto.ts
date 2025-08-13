import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  @IsNotEmpty()
  blogId: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
