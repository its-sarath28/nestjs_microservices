import { IsInt, IsNotEmpty } from 'class-validator';

export class FollowDto {
  @IsInt()
  @IsNotEmpty()
  followerId: number;

  @IsInt()
  @IsNotEmpty()
  followingId: number;
}
