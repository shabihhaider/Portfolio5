
import dotenv from 'dotenv';
import path from 'path';
import { PostsDB } from '../src/lib/db/posts';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function publishScheduledPosts() {
    console.log('📅 Checking for scheduled posts to publish...');

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found');
        process.exit(1);
    }

    try {
        // We already have a method for this in PostsDB!
        await PostsDB.publishScheduledPosts();
        // But PostsDB.publishScheduledPosts returns void and doesn't return count.
        // Ideally we'd like to know how many were published.
        // The implementation in PostsDB just calls updateMany.
        // Let's trust it works or modify it if we need feedback.

        // For logging, we could query before/after, but let's just log simple success.
        console.log('✅ Scheduled posts processing complete.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error publishing posts:', error);
        process.exit(1);
    }
}

publishScheduledPosts();
