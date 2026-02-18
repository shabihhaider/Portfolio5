import prisma from './prisma';
import { Post, Prisma } from '@prisma/client';

export type PostCreateInput = Prisma.PostCreateInput;
export type PostUpdateInput = Prisma.PostUpdateInput;

export class PostsDB {
    static async getAll(status?: string): Promise<Post[]> {
        const where = status ? { status } : {};
        return prisma.post.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
        });
    }

    static async getBySlug(slug: string): Promise<Post | null> {
        return prisma.post.findUnique({
            where: { slug },
        });
    }

    static async create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'ctaClicks'>): Promise<string> {
        // Use raw SQL to avoid Prisma binary protocol issues with Neon pooler (22P03 error)
        const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
        const now = new Date();
        
        await prisma.$executeRaw`
            INSERT INTO posts (
                "id", "slug", "title", "content", "excerpt", "coverImage", "author",
                "status", "publishedAt", "scheduledFor", "metaDescription", "metaKeywords",
                "ogImage", "tags", "category", "views", "likes", "readingTime", "ctaClicks",
                "generatedBy", "humanEdited", "qualityScore", "createdAt", "updatedAt"
            ) VALUES (
                ${id},
                ${post.slug},
                ${post.title},
                ${post.content},
                ${post.excerpt || null},
                ${post.coverImage || null},
                ${post.author},
                ${post.status || 'draft'},
                ${post.publishedAt || null}::timestamptz,
                ${post.scheduledFor || null}::timestamptz,
                ${post.metaDescription || null},
                ${post.metaKeywords || []}::text[],
                ${post.ogImage || null},
                ${post.tags || []}::text[],
                ${post.category || 'Tech'},
                ${0},
                ${0},
                ${post.readingTime || null},
                ${0},
                ${post.generatedBy || null},
                ${post.humanEdited ?? false},
                ${post.qualityScore || 0}::double precision,
                ${now}::timestamptz,
                ${now}::timestamptz
            )
        `;
        return id;
    }

    static async update(slug: string, updates: PostUpdateInput): Promise<boolean> {
        try {
            await prisma.post.update({
                where: { slug },
                data: updates,
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    static async incrementViews(slug: string): Promise<void> {
        try {
            await prisma.post.update({
                where: { slug },
                data: { views: { increment: 1 } },
            });
        } catch (error) {
            console.error('Failed to increment views:', error);
        }
    }

    static async delete(slug: string): Promise<boolean> {
        try {
            await prisma.post.delete({
                where: { slug },
            });
            return true;
        } catch (error) {
            console.error('PostsDB.delete error:', error);
            return false;
        }
    }

    static async getPublishedPosts(): Promise<Post[]> {
        return this.getAll('published');
    }

    static async getDrafts(): Promise<Post[]> {
        return this.getAll('draft');
    }

    static async getScheduledPosts(): Promise<Post[]> {
        return this.getAll('scheduled');
    }

    static async getApprovedPosts(): Promise<Post[]> {
        return this.getAll('approved');
    }

    static async getRejectedPosts(): Promise<Post[]> {
        return this.getAll('rejected');
    }

    static async approve(slug: string, scheduledFor?: Date): Promise<boolean> {
        try {
            await prisma.post.update({
                where: { slug },
                data: {
                    status: 'approved',
                    scheduledFor: scheduledFor || new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });
            return true;
        } catch (error) {
            console.error('PostsDB.approve error:', error);
            return false;
        }
    }

    static async reject(slug: string): Promise<boolean> {
        try {
            await prisma.post.update({
                where: { slug },
                data: { status: 'rejected' },
            });
            return true;
        } catch (error) {
            console.error('PostsDB.reject error:', error);
            return false;
        }
    }

    static async publishScheduledPosts(): Promise<number> {
        const now = new Date();
        const result = await prisma.post.updateMany({
            where: {
                status: { in: ['approved', 'scheduled'] },
                scheduledFor: { lte: now },
            },
            data: {
                status: 'published',
                publishedAt: now,
                updatedAt: now,
            },
        });
        return result.count;
    }
}
