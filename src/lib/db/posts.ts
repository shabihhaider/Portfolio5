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
        const result = await prisma.post.create({
            data: {
                ...post,
                status: post.status || 'draft',
                views: 0,
                likes: 0,
                ctaClicks: 0,
            },
        });
        return result.id;
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

    static async publishScheduledPosts(): Promise<void> {
        const now = new Date();
        await prisma.post.updateMany({
            where: {
                status: 'scheduled',
                scheduledFor: { lte: now }, // ✅ FIXED: Use scheduledFor instead of publishedAt
            },
            data: {
                status: 'published',
                publishedAt: now, // ✅ FIXED: Set publishedAt when publishing
                updatedAt: now,
            },
        });
    }
}
