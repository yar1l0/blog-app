// models/Comment.ts
import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: Date | Timestamp;
}

export type CommentInput = Omit<Comment, 'id' | 'createdAt'>;