/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/auth/admin', () => ({
    isAuthenticated: jest.fn(),
}));

jest.mock('@/lib/db/posts', () => ({
    PostsDB: {
        create: jest.fn(),
    },
}));

jest.mock('@/lib/validation/schemas', () => ({
    createPostSchema: {
        safeParse: jest.fn(),
    },
}));

describe('POST /api/posts Security', () => {
    const { isAuthenticated } = require('@/lib/auth/admin');
    const { createPostSchema } = require('@/lib/validation/schemas');
    const { PostsDB } = require('@/lib/db/posts');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 401 if not authenticated', async () => {
        isAuthenticated.mockResolvedValue(false);

        const request = new NextRequest('http://localhost/api/posts', {
            method: 'POST',
            body: JSON.stringify({ title: 'Test' }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
        expect(createPostSchema.safeParse).not.toHaveBeenCalled();
    });

    test('should return 400 if validation fails', async () => {
        isAuthenticated.mockResolvedValue(true);
        createPostSchema.safeParse.mockReturnValue({
            success: false,
            error: { flatten: () => ({ fieldErrors: { title: ['Required'] } }) },
        });

        const request = new NextRequest('http://localhost/api/posts', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const response = await POST(request);

        expect(response.status).toBe(400);
        expect(createPostSchema.safeParse).toHaveBeenCalled();
    });

    test('should create post if authenticated and valid', async () => {
        isAuthenticated.mockResolvedValue(true);
        createPostSchema.safeParse.mockReturnValue({
            success: true,
            data: { title: 'Valid Post', slug: 'valid-post' },
        });
        PostsDB.create.mockResolvedValue('new-id');

        const request = new NextRequest('http://localhost/api/posts', {
            method: 'POST',
            body: JSON.stringify({ title: 'Valid Post' }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.postId).toBe('new-id');
    });
});
