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
        const body = await request.json().catch(() => ({}));
        const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : undefined;

        const post = await PostsDB.getBySlug(slug);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.status !== 'draft') {
            return NextResponse.json(
                { error: `Cannot approve a post with status '${post.status}'. Only drafts can be approved.` },
                { status: 400 }
            );
        }

        const success = await PostsDB.approve(slug, scheduledFor);
        if (!success) {
            return NextResponse.json({ error: 'Failed to approve post' }, { status: 500 });
        }

        return NextResponse.json({ success: true, status: 'approved' });
    } catch (error) {
        console.error('Approve error:', error);
        return NextResponse.json({ error: 'Failed to approve post' }, { status: 500 });
    }
}
