// components/blog/CommentList.tsx
'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { Comment } from '../../models/Comment';
import { AppDispatch } from '../../store/store';
import { removeComment } from '../../store/features/comments/commentsSlice';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      dispatch(removeComment(id));
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Комментариев пока нет. Будьте первым!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          onDelete={handleDelete} 
        />
      ))}
    </ul>
  );
};