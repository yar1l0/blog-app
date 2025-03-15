// components/blog/PostList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchPosts, removePost } from '../../store/features/posts/postsSlice';
import { PostCard } from './PostCard';
import { Button } from '../ui/Button';
import Link from 'next/link';

export const PostList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      dispatch(removePost(id));
    }
  };

  // Получаем все уникальные теги из постов
  const allTags = React.useMemo(() => {
    const tags = posts.flatMap(post => post.tags || []);
    return Array.from(new Set(tags));
  }, [posts]);

  // Фильтрация постов по поиску и тегам
  const filteredPosts = React.useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === null || 
        (post.tags && post.tags.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Ошибка загрузки постов</h3>
        <p>{error}</p>
        <Button 
          variant="primary" 
          className="mt-4" 
          onClick={() => dispatch(fetchPosts())}
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Поиск постов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Link href="/posts/create">
          <Button variant="primary">Создать новый пост</Button>
        </Link>
      </div>
      
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Фильтр по тегам:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                selectedTag === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedTag(null)}
            >
              Все
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {filteredPosts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Посты не найдены</h3>
          <p className="text-gray-600">
            {searchTerm || selectedTag 
              ? 'Попробуйте изменить параметры поиска или фильтры'
              : 'Создайте свой первый пост!'}
          </p>
          
          <Link href="/posts/create">
            <Button variant="primary" className="mt-4">
              Создать новый пост
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};