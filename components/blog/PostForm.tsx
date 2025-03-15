// components/blog/PostForm.tsx
'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Post, PostInput } from '../../models/Post';
import { postSchema } from '../../lib/validation/schemas';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: PostInput) => void;
  isSubmitting: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  post,
  onSubmit,
  isSubmitting
}) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: post ? {
      title: post.title,
      content: post.content,
      author: post.author,
      imageUrl: post.imageUrl || '',
      tags: post.tags || []
    } : {
      title: '',
      content: '',
      author: '',
      imageUrl: '',
      tags: []
    }
  });

  // Для работы с тегами
  const [tagInput, setTagInput] = React.useState('');
  const tagsValue = watch('tags') || [];
  
  const addTag = () => {
    if (tagInput.trim() && !tagsValue.includes(tagInput.trim())) {
      setValue('tags', [...tagsValue, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setValue('tags', tagsValue.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Заголовок"
            placeholder="Введите заголовок поста"
            error={errors.title?.message}
            fullWidth
          />
        )}
      />
      
      <Controller
        name="author"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Автор"
            placeholder="Ваше имя"
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
            label="Содержание"
            placeholder="Введите содержание поста"
            rows={8}
            error={errors.content?.message}
            fullWidth
          />
        )}
      />
      
      <Controller
        name="imageUrl"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="URL изображения (необязательно)"
            placeholder="https://example.com/image.jpg"
            error={errors.imageUrl?.message}
            fullWidth
          />
        )}
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Теги (необязательно)
        </label>
        
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Добавить тег..."
            className="px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Добавить
          </button>
        </div>
        
        {tagsValue.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tagsValue.map((tag, index) => (
              <div 
                key={index} 
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                <span className="mr-1">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-800 hover:text-blue-900 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </span>
          ) : post ? 'Обновить пост' : 'Создать пост'}
        </Button>
      </div>
    </form>
  );
};