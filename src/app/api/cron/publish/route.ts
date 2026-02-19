
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PostsDB } from '@/lib/db/posts';

export async function GET(request: Request) {
    try {
        // ✅ FIXED: Properly enforce cron job authentication
        const authHeader = request.headers.get('authorization');
        const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

        // If CRON_SECRET is set, enforce it. Otherwise, allow (for local testing)
        if (process.env.CRON_SECRET && authHeader !== expectedAuth) {
            console.error('Cron job authentication failed');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const count = await PostsDB.publishScheduledPosts();

        // Purge blog page cache if any posts were published
        if (count > 0) {
            revalidatePath('/blog');
        }

        return NextResponse.json({ success: true, published: count, message: 'Scheduled posts published' });
    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: 'Failed to publish scheduled posts' }, { status: 500 });
    }
}
