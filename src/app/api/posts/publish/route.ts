
import { NextRequest, NextResponse } from 'next/server';
import { PostsDB } from '@/lib/db/posts';
import { isAuthenticated } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { slug } = body;

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const success = await PostsDB.update(slug, {
            status: 'published',
            publishedAt: new Date(),
        });

        if (!success) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
    }
}
