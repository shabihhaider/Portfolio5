
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { isAuthenticated } from '@/lib/auth/admin';

export async function GET() {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const settings = await prisma.siteSettings.findFirst() || await prisma.siteSettings.create({
            data: {
                contentTopics: ['AI', 'Web Development', 'Tech Trends'],
            }
        });
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...data } = body;

        // Ensure we update the single settings record
        const settings = await prisma.siteSettings.findFirst();

        if (settings) {
            const updated = await prisma.siteSettings.update({
                where: { id: settings.id },
                data,
            });
            return NextResponse.json(updated);
        } else {
            const created = await prisma.siteSettings.create({
                data,
            });
            return NextResponse.json(created);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
