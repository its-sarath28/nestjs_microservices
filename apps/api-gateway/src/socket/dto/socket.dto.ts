export class NewCommentDto {
  authorId: string;
  comment: string;
  user: {
    fullName: string;
    imageUrl?: string;
  };
}
