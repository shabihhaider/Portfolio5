/**
 * Simple in-memory rate limiter
 * Note: This rests when server restarts (serverless functions might lose state)
 * For distributed systems, use Redis. For this project, this is sufficient.
 */

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

export class RateLimiter {
    private store: RateLimitStore = {};
    private windowMs: number;
    private maxRequests: number;

    constructor(windowMs: number, maxRequests: number) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }

    /**
     * Check if request is allowed
     * @param key Unique identifier (IP address, user ID, etc.)
     * @returns boolean true if allowed, false if limit exceeded
     */
    check(key: string): boolean {
        const now = Date.now();
        const record = this.store[key];

        // Clean up old record if expired
        if (record && now > record.resetTime) {
            delete this.store[key];
        }

        if (!this.store[key]) {
            this.store[key] = {
                count: 1,
                resetTime: now + this.windowMs,
            };
            return true;
        }

        if (this.store[key].count >= this.maxRequests) {
            return false;
        }

        this.store[key].count++;
        return true;
    }

    /**
     * Get remaining requests for a key
     */
    remaining(key: string): number {
        const record = this.store[key];
        if (!record || Date.now() > record.resetTime) {
            return this.maxRequests;
        }
        return Math.max(0, this.maxRequests - record.count);
    }
}

// Global instances
// Analytics: 30 requests per minute per IP
export const apiLimiter = new RateLimiter(60 * 1000, 30);

// AI Generation: 5 requests per hour (prevent abuse of Groq API)
export const generateLimiter = new RateLimiter(60 * 60 * 1000, 5);
