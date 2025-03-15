// components/blog/CommentForm.tsx
'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppDispatch } from '../../store/store';
import { createComment } from '../../store/features/comments/commentsSlice';
import { commentSchema } from '../../lib/validation/schemas';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { CommentInput } from '../../models/Comment';

interface CommentFormProps {
  postId: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      author: '',
      content: '',
      postId: postId
    }
  });

  const onSubmit = async (data: CommentInput) => {
    try {
      setIsSubmitting(true);
      await dispatch(createComment({ ...data, postId })).unwrap();
      reset({ author: '', content: '', postId });
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Добавить комментарий</h3>
      
      <Controller
        name="author"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Имя"
            placeholder="Введите ваше имя"
            error={errors.author?.message}
            fullWidth
          />
        )}
      />
      
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Комментарий"
            placeholder="Введите ваш комментарий"
            rows={4}
            error={errors.content?.message}
            fullWidth
          />
        )}
      />
      
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Отправка...
            </span>
          ) : 'Отправить комментарий'}
        </Button>
      </div>
    </form>
  );
};