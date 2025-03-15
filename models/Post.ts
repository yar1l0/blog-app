// models/Post.ts
import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  imageUrl?: string;
  tags?: string[];
}

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;