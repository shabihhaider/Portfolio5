import { getDb } from './mongodb';
import { BlogPost } from './schema';
import { ObjectId } from 'mongodb';

export class PostsDB {
    static async getAll(status?: BlogPost['status']): Promise<BlogPost[]> {
        const db = await getDb();
        const query = status ? { status } : {};

        return db
            .collection<BlogPost>('posts')
            .find(query)
            .sort({ publishedAt: -1 })
            .toArray();
    }

    static async getBySlug(slug: string): Promise<BlogPost | null> {
        const db = await getDb();
        return db.collection<BlogPost>('posts').findOne({ slug });
    }

    static async create(post: Omit<BlogPost, '_id'>): Promise<ObjectId> {
        const db = await getDb();
        const result = await db.collection<BlogPost>('posts').insertOne({
            ...post,
            createdAt: new Date(),
            updatedAt: new Date(),
            views: 0,
            likes: 0,
            ctaClicks: 0,
        } as BlogPost);

        return result.insertedId;
    }

    static async update(slug: string, updates: Partial<BlogPost>): Promise<boolean> {
        const db = await getDb();
        const result = await db.collection<BlogPost>('posts').updateOne(
            { slug },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date(),
                }
            }
        );

        return result.modifiedCount > 0;
    }

    static async incrementViews(slug: string): Promise<void> {
        const db = await getDb();
        await db.collection<BlogPost>('posts').updateOne(
            { slug },
            { $inc: { views: 1 } }
        );
    }

    static async delete(slug: string): Promise<boolean> {
        const db = await getDb();
        const result = await db.collection<BlogPost>('posts').deleteOne({ slug });
        return result.deletedCount > 0;
    }

    static async getPublishedPosts(): Promise<BlogPost[]> {
        return this.getAll('published');
    }

    static async getDrafts(): Promise<BlogPost[]> {
        return this.getAll('draft');
    }

    static async getScheduledPosts(): Promise<BlogPost[]> {
        return this.getAll('scheduled');
    }

    static async publishScheduledPosts(): Promise<void> {
        const db = await getDb();
        const now = new Date();

        await db.collection<BlogPost>('posts').updateMany(
            {
                status: 'scheduled',
                scheduledFor: { $lte: now }
            },
            {
                $set: {
                    status: 'published',
                    publishedAt: now,
                    updatedAt: now,
                }
            }
        );
    }
}
