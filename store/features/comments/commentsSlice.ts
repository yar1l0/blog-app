// store/features/comments/commentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment, CommentInput } from '../../../models/Comment';
import { getCommentsByPostId, addComment, deleteComment } from '../../../lib/firebase/firestore';

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchCommentsByPostId',
  async (postId: string, { rejectWithValue }) => {
    try {
      return await getCommentsByPostId(postId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (comment: CommentInput, { rejectWithValue }) => {
    try {
      return await addComment(comment);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteComment(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
    setCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchCommentsByPostId
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка createComment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments = [action.payload, ...state.comments];
        state.loading = false;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка removeComment
      .addCase(removeComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((comment) => comment.id !== action.payload);
        state.loading = false;
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearComments, setCommentsSuccess } = commentsSlice.actions;
export default commentsSlice.reducer;