// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './features/posts/postsSlice';
import commentsReducer from './features/comments/commentsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем проверку сериализуемости для Date объектов в Redux
        ignoredActions: ['posts/setPostsSuccess', 'posts/setPostSuccess', 'comments/setCommentsSuccess'],
        ignoredPaths: ['posts.posts', 'posts.selectedPost', 'comments.comments'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;