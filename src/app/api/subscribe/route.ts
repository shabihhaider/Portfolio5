import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, source } = body;

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        const db = await getDb();

        // Upsert subscriber
        await db.collection('subscribers').updateOne(
            { email },
            {
                $set: {
                    email,
                    source: source || 'unknown',
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    subscribedAt: new Date(),
                    status: 'active'
                }
            },
            { upsert: true }
        );

        // Ideally send welcome email here using Resend (optional as per guide phase 6 didn't explicitly demand it but "Integration with Resend" is mentioned in Dependencies)
        // I will skip actual email sending code to keep it simple unless requested, sticking to DB.

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }
}
