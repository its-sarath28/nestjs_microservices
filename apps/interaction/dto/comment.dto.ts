import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  blogId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class RemoveCommentDto {
  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
