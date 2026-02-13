import { RateLimiter } from './rate-limit';

describe('RateLimiter', () => {
    let limiter: RateLimiter;

    beforeEach(() => {
        // 10 requests per 1 second
        limiter = new RateLimiter(1000, 10);
    });

    test('should allow requests within limit', () => {
        for (let i = 0; i < 10; i++) {
            expect(limiter.check('user1')).toBe(true);
        }
    });

    test('should block requests exceeding limit', () => {
        for (let i = 0; i < 10; i++) {
            limiter.check('user2');
        }
        expect(limiter.check('user2')).toBe(false);
    });

    test('should reset after window expires', async () => {
        const shortLimiter = new RateLimiter(100, 1);
        expect(shortLimiter.check('user3')).toBe(true);
        expect(shortLimiter.check('user3')).toBe(false);

        // Wait for window to expire
        await new Promise(resolve => setTimeout(resolve, 150));

        expect(shortLimiter.check('user3')).toBe(true);
    });

    test('should track different keys separately', () => {
        for (let i = 0; i < 10; i++) {
            limiter.check('userA');
        }
        expect(limiter.check('userA')).toBe(false);
        expect(limiter.check('userB')).toBe(true);
    });
});
