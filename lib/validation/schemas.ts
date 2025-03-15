// lib/validation/schemas.ts
import { z } from 'zod';

// Схема для валидации создания поста
export const postSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Заголовок должен содержать минимум 5 символов' })
    .max(100, { message: 'Заголовок не должен превышать 100 символов' }),
  content: z
    .string()
    .min(20, { message: 'Содержание должно содержать минимум 20 символов' }),
  author: z
    .string()
    .min(3, { message: 'Имя автора должно содержать минимум 3 символа' })
    .max(50, { message: 'Имя автора не должно превышать 50 символов' }),
  imageUrl: z
    .string()
    .url({ message: 'Пожалуйста, введите корректный URL изображения' })
    .optional(),
  tags: z
    .array(z.string())
    .optional()
});

// Схема для валидации комментария
export const commentSchema = z.object({
  author: z
    .string()
    .min(2, { message: 'Имя должно содержать минимум 2 символа' })
    .max(50, { message: 'Имя не должно превышать 50 символов' }),
  content: z
    .string()
    .min(3, { message: 'Комментарий должен содержать минимум 3 символа' })
    .max(500, { message: 'Комментарий не должен превышать 500 символов' }),
  postId: z.string()
});

export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;