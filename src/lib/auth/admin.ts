import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db/prisma';

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envHash = process.env.ADMIN_PASSWORD_HASH;

    if (username !== envUsername) {
        return false;
    }

    if (!envHash) {
        console.error('[Auth Debug] CRITICAL: ADMIN_PASSWORD_HASH is missing in process.env');
        return false;
    }

    const isValid = await bcrypt.compare(password, envHash);
    return isValid;
}

export async function createAdminToken(): Promise<string> {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    return jwt.sign(
        { admin: true, timestamp: Date.now() },
        secret,
        { expiresIn: '7d' }
    );
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error('JWT_SECRET is not configured');
        return false;
    }

    if (!token) return false;

    try {
        jwt.verify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export async function loginAdmin() {
    const token = await createAdminToken();
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
    });
}

export async function getAdminStats() {
    // 1. Total Posts
    const totalPosts = await prisma.post.count();

    // 2. Published Posts
    const publishedPosts = await prisma.post.count({
        where: { status: 'published' },
    });

    // 3. Total Views & Likes (Aggregate)
    const aggregate = await prisma.post.aggregate({
        _sum: {
            views: true,
            likes: true,
            ctaClicks: true,
        },
    });

    const totalViews = aggregate._sum.views || 0;
    const totalLikes = aggregate._sum.likes || 0;
    const totalCtaClicks = aggregate._sum.ctaClicks || 0;

    // 4. Subscribers (Placeholder for now)
    const subscribers = await prisma.subscriber.count();

    return {
        totalPosts,
        publishedPosts,
        totalViews,
        totalLikes,
        subscribers,
        totalCtaClicks,
    };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
}
