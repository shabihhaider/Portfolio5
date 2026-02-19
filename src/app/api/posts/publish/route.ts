
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PostsDB } from '@/lib/db/posts';
import { isAuthenticated } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // ✅ ADDED: Input validation with Zod
        const { publishPostSchema } = await import('@/lib/validation/schemas');
        const validationResult = publishPostSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.flatten() },
                { status: 400 }
            );
        }

        const { slug } = validationResult.data;
        const success = await PostsDB.update(slug, {
            status: 'published',
            publishedAt: new Date(),
        });

        if (!success) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Purge cached blog pages so the new post appears immediately
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Publish error:', error);
        return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
    }
}
