import { z } from 'zod';

// Post creation validation
export const createPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(100, 'Content must be at least 100 characters'),
    slug: z.string()
        .min(1, 'Slug is required')
        .max(100, 'Slug too long')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
    excerpt: z.string().max(500, 'Excerpt too long').optional().nullable(),
    coverImage: z.string().url('Invalid cover image URL').optional().nullable(),
    author: z.string().optional(),
    status: z.enum(['draft', 'published', 'scheduled', 'archived']).optional(),
    metaDescription: z.string().max(160, 'Meta description too long').optional().nullable(),
    metaKeywords: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    scheduledFor: z.string().datetime().optional().nullable(),
});

// Post update validation
export const updatePostSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(100).optional(),
    excerpt: z.string().max(500).optional().nullable(),
    coverImage: z.string().url().optional().nullable(),
    status: z.enum(['draft', 'published', 'scheduled', 'archived']).optional(),
    metaDescription: z.string().max(160).optional().nullable(),
    metaKeywords: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    scheduledFor: z.string().datetime().optional().nullable(),
    publishedAt: z.string().datetime().optional().nullable(),
});

// Publish post validation
export const publishPostSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
});

// Subscribe validation
export const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
    source: z.string().optional(),
});

// Contact form validation
export const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
});

// Generate post validation
export const generatePostSchema = z.object({
    topic: z.string().min(1, 'Topic is required').max(200, 'Topic too long').optional(),
    context: z.string().max(500, 'Context too long').optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PublishPostInput = z.infer<typeof publishPostSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type GeneratePostInput = z.infer<typeof generatePostSchema>;
