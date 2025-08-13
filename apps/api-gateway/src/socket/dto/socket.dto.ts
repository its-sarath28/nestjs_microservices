export class NewCommentDto {
  authorId: string;
  comment: string;
  user: {
    fullName: string;
    imageUrl?: string;
  };
}

export class NewLikeDto {
  authorId: string;
  user: {
    fullName: string;
    imageUrl?: string;
  };
}

export class NewFollowerDto {
  followingId: string;
  fullName: string;
  imageUrl?: string;
}
