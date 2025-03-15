// lib/firebase/firestore.ts
import { db } from './config';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { Post, PostInput } from '../../models/Post';
import { Comment, CommentInput } from '../../models/Comment';

// Посты
export const getPosts = async (): Promise<Post[]> => {
  const postsCol = collection(db, 'posts');
  const postsQuery = query(postsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(postsQuery);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Post, 'id'>
  }));
};

export const getPostById = async (id: string): Promise<Post | null> => {
  const docRef = doc(db, 'posts', id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data() as Omit<Post, 'id'>
  };
};

export const createPost = async (post: PostInput): Promise<Post> => {
  const postsCol = collection(db, 'posts');
  const newPost = {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(postsCol, newPost);
  const snapshot = await getDoc(docRef);
  
  return {
    id: docRef.id,
    ...snapshot.data() as Omit<Post, 'id'>
  };
};

export const updatePost = async (id: string, post: Partial<PostInput>): Promise<Post> => {
  const docRef = doc(db, 'posts', id);
  const updatedData = {
    ...post,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(docRef, updatedData);
  const snapshot = await getDoc(docRef);
  
  return {
    id: snapshot.id,
    ...snapshot.data() as Omit<Post, 'id'>
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const docRef = doc(db, 'posts', id);
  await deleteDoc(docRef);
};

// Комментарии
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const commentsCol = collection(db, 'comments');
  const commentsQuery = query(
    commentsCol, 
    where('postId', '==', postId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(commentsQuery);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Comment, 'id'>
  }));
};

export const addComment = async (comment: CommentInput): Promise<Comment> => {
  const commentsCol = collection(db, 'comments');
  const newComment = {
    ...comment,
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(commentsCol, newComment);
  const snapshot = await getDoc(docRef);
  
  return {
    id: docRef.id,
    ...snapshot.data() as Omit<Comment, 'id'>
  };
};

export const deleteComment = async (id: string): Promise<void> => {
  const docRef = doc(db, 'comments', id);
  await deleteDoc(docRef);
};

// Конвертер Firestore Timestamp в дату для клиентской стороны
export const convertTimestampToDate = (data: DocumentData): any => {
  const result: any = { ...data };
  
  // Рекурсивное преобразование Timestamp в Date
  Object.keys(result).forEach(key => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = convertTimestampToDate(result[key]);
    }
  });
  
  return result;
};