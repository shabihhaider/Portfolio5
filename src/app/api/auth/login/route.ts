import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, loginAdmin } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const isValid = await verifyAdmin(username, password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        await loginAdmin();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API Login] Error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
