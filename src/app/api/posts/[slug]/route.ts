
import { NextRequest, NextResponse } from 'next/server';
import { PostsDB } from '@/lib/db/posts';
import { isAuthenticated } from '@/lib/auth/admin';

type Props = {
    params: Promise<{ slug: string }>;
}

export async function DELETE(request: NextRequest, { params }: Props) {
    console.log('DELETE request received');
    if (!await isAuthenticated()) {
        console.log('DELETE failed: Unauthorized');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('DELETE auth passed');

    try {
        const { slug } = await params;
        const success = await PostsDB.delete(slug);

        if (!success) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE API Error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
