import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { postSlug, ctaType } = body;

        if (!postSlug || !ctaType) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        const db = await getDb();

        // Track the click event
        await db.collection('analytics').insertOne({
            type: 'cta_click',
            postSlug,
            ctaType,
            timestamp: new Date(),
            userAgent: request.headers.get('user-agent') || 'unknown'
        });

        // Increment post CTA clicks
        await db.collection('posts').updateOne(
            { slug: postSlug },
            { $inc: { ctaClicks: 1 } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
    }
}
