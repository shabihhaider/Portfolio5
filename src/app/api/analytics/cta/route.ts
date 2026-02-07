import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { postSlug, ctaType } = body;

        if (!postSlug || !ctaType) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Track the click event
        await prisma.analytics.create({
            data: {
                type: 'cta_click',
                postId: postSlug, // Storing slug as ID reference for now
                path: ctaType,
                userAgent: request.headers.get('user-agent') || 'unknown',
            },
        });

        // Increment post CTA clicks
        await prisma.post.update({
            where: { slug: postSlug },
            data: { ctaClicks: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
    }
}
