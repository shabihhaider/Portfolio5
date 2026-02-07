
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { isAuthenticated } from '@/lib/auth/admin';

export async function GET() {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const totalViews = await prisma.post.aggregate({
            _sum: {
                views: true,
            },
        });

        const totalLikes = await prisma.post.aggregate({
            _sum: {
                likes: true,
            },
        });

        // Get top posts
        const topPosts = await prisma.post.findMany({
            orderBy: {
                views: 'desc',
            },
            take: 5,
            select: {
                title: true,
                slug: true,
                views: true,
                likes: true,
                ctaClicks: true,
            },
        });

        // Get CTA clicks
        const ctaClicks = await prisma.analytics.count({
            where: {
                type: 'cta_click',
            },
        });

        return NextResponse.json({
            totalViews: totalViews._sum.views || 0,
            totalLikes: totalLikes._sum.likes || 0,
            ctaClicks,
            topPosts,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
