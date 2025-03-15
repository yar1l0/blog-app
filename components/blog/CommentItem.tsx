// components/blog/CommentItem.tsx
'use client';

import React from 'react';
import { Comment } from '../../models/Comment';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  // Конвертируем Timestamp в Date если необходимо
  const createdAt = comment.createdAt instanceof Date 
    ? comment.createdAt 
    : new Date(comment.createdAt as any);

  // Форматируем дату
  const formattedDate = formatDistanceToNow(createdAt, { 
    addSuffix: true,
    locale: ru 
  });

  return (
    <li className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{comment.author}</h4>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        
        <button
          onClick={() => onDelete(comment.id)}
          className="text-red-500 hover:text-red-700"
          aria-label="Удалить комментарий"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1