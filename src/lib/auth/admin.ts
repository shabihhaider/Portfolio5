import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-me';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Helper to hash password if you want to generate one for .env
// console.log(bcrypt.hashSync('yourpassword', 10));

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
    if (username !== ADMIN_USERNAME) return false;
    if (!ADMIN_PASSWORD_HASH) {
        console.warn('ADMIN_PASSWORD_HASH not set');
        return false;
    }
    return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function createAdminToken(): Promise<string> {
    return jwt.sign(
        { admin: true, timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return false;

    try {
        jwt.verify(token, JWT_SECRET);
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

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
}
