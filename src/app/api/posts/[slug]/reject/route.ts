import { NextRequest, NextResponse } from 'next/server';
import { PostsDB } from '@/lib/db/posts';
import { isAuthenticated } from '@/lib/auth/admin';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { slug } = await params;

        const post = await PostsDB.getBySlug(slug);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.status === 'published') {
            return NextResponse.json(
                { error: 'Cannot reject a published post.' },
                { status: 400 }
            );
        }

        const success = await PostsDB.reject(slug);
        if (!success) {
            return NextResponse.json({ error: 'Failed to reject post' }, { status: 500 });
        }

        return NextResponse.json({ success: true, status: 'rejected' });
    } catch (error) {
        console.error('Reject error:', error);
        return NextResponse.json({ error: 'Failed to reject post' }, { status: 500 });
    }
}
