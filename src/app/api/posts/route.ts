import { NextRequest, NextResponse } from 'next/server';
import { PostsDB } from '@/lib/db/posts';
// import { BlogPost } from '@/lib/db/schema'; // Deprecated
import { Post } from '@prisma/client';

// GET all posts
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as string | null;

    // ✅ FIXED: Security - Only authenticated admins can fetch drafts/scheduled posts
    if (status && status !== 'published') {
        const { isAuthenticated } = await import('@/lib/auth/admin');
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const posts = status
            ? await PostsDB.getAll(status)
            : await PostsDB.getPublishedPosts();

        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST new post
export async function POST(request: NextRequest) {
    // ✅ FIXED: Security - Protect POST endpoint
    const { isAuthenticated } = await import('@/lib/auth/admin');
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // ✅ ADDED: Input validation with Zod
        const { createPostSchema } = await import('@/lib/validation/schemas');
        const validationResult = createPostSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationResult.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const validatedData = validationResult.data;
        const postId = await PostsDB.create(validatedData as any);

        return NextResponse.json(
            { success: true, postId },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/posts error:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
