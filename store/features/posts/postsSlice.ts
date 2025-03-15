// store/features/posts/postsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostInput } from '../../../models/Post';
import { getPosts, getPostById, createPost, updatePost, deletePost } from '../../../lib/firebase/firestore';

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      return await getPosts();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      const post = await getPostById(id);
      if (!post) {
        throw new Error('Пост не найден');
      }
      return post;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (post: PostInput, { rejectWithValue }) => {
    try {
      return await createPost(post);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const editPost = createAsyncThunk(
  'posts/editPost',
  async ({ id, post }: { id: string; post: Partial<PostInput> }, { rejectWithValue }) => {
    try {
      return await updatePost(id, post);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removePost = createAsyncThunk(
  'posts/removePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    setPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPostSuccess: (state, action: PayloadAction<Post>) => {
      state.selectedPost = action.payload;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка fetchPostById
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.selectedPost = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка addPost
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
        state.loading = false;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка editPost
      .addCase(editPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
        state.selectedPost = action.payload;
        state.loading = false;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка removePost
      .addCase(removePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        if (state.selectedPost && state.selectedPost.id === action.payload) {
          state.selectedPost = null;
        }
        state.loading = false;
      })
      .addCase(removePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedPost, setPostsSuccess, setPostSuccess } = postsSlice.actions;
export default postsSlice.reducer;