// components/blog/PostDetail.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchPostById } from '../../store/features/posts/postsSlice';
import { fetchCommentsByPostId } from '../../store/features/comments/commentsSlice';
import { Button } from '../ui/Button';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PostDetailProps {
  postId: string;
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPost, loading: postLoading, error: postError } = useSelector((state: RootState) => state.posts);
  const { comments, loading: commentsLoading } = useSelector((state: RootState) => state.comments);

  useEffect(() => {
    dispatch(fetchPostById(postId));
    dispatch(fetchCommentsByPostId(postId));
  }, [dispatch, postId]);

  if (postLoading && !selectedPost) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (postError) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Ошибка загрузки поста</h3>
        <p>{postError}</p>
        <Link href="/posts">
          <Button variant="primary" className="mt-4">
            Вернуться к списку постов
          </Button>
        </Link>
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Пост не найден</h3>
        <Link href="/posts">
          <Button variant="primary" className="mt-4">
            Вернуться к списку постов
          </Button>
        </Link>
      </div>
    );
  }

  // Конвертируем Timestamp в Date если необходимо
  const createdAt = selectedPost.createdAt instanceof Date 
    ? selectedPost.createdAt 
    : new Date(selectedPost.createdAt as any);

  // Форматируем дату
  const formattedDate = formatDistanceToNow(createdAt, { 
    addSuffix: true,
    locale: ru 
  });

  return (
    <article className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <Link href="/posts" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку постов
        </Link>
      </div>
      
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPost.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span className="mr-4">Автор: {selectedPost.author}</span>
          <span>{formattedDate}</span>
        </div>
        
        {selectedPost.tags && selectedPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedPost.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <Link href={`/posts/${postId}/edit`} className="inline-block">
          <Button variant="secondary" size="sm">
            Редактировать
          </Button>
        </Link>
      </header>
      
      {selectedPost.imageUrl && (
        <div className="mb-6">
          <img 
            src={selectedPost.imageUrl} 
            alt={selectedPost.title} 
            className="w-full h-auto rounded-lg shadow-sm"
          />
        </div>
      )}
      
      <div className="prose prose-lg max-w-none mb-8 whitespace-pre-line">
        {selectedPost.content}
      </div>
      
      <section className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Комментарии</h2>
        <CommentForm postId={postId} />
        
        <div className="mt-8">
          {commentsLoading && comments.length === 0 ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <CommentList comments={comments} />
          )}
        </div>
      </section>
    </article>
  );
};