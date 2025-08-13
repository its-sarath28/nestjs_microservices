import { Types } from 'mongoose';
import { Comment } from '../schema/comment.schema';

export type CommentWithId = Comment & { _id: Types.ObjectId; createdAt: Date };
