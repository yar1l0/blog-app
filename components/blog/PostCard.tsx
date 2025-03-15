// components/blog/PostCard.tsx (продолжение)
'use client';

import React from 'react';
import { Post } from '../../models/Post';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  // Конвертируем Timestamp в Date если необходимо
  const createdAt = post.createdAt instanceof Date 
    ? post.createdAt 
    : new Date(post.createdAt as any);

  // Форматируем дату
  const formattedDate = formatDistance(createdAt, new Date(), { 
    addSuffix: true,
    locale: ru 
  });

  // Ограничение длины контента для предпросмотра
  const previewContent = post.content.length > 150 
    ? `${post.content.substring(0, 150)}...` 
    : post.content;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            <Link href={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </h2>
          
          {onDelete && (
            <button 
              onClick={() => onDelete(post.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Удалить пост"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{previewContent}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Автор: {post.author}</span>
          <span>{formattedDate}</span>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-4">
          <Link 
            href={`/posts/${post.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Читать далее →
          </Link>
        </div>
      </div>
    </div>
  );
};