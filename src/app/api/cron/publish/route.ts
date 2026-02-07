
import { NextResponse } from 'next/server';
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

        await PostsDB.publishScheduledPosts();

        return NextResponse.json({ success: true, message: 'Scheduled posts published' });
    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: 'Failed to publish scheduled posts' }, { status: 500 });
    }
}
