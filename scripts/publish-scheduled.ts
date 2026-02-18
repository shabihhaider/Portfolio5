
import dotenv from 'dotenv';
import path from 'path';
import { PostsDB } from '../src/lib/db/posts';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function publishScheduledPosts() {
    console.log('📅 Checking for scheduled posts to publish...');

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found');
        process.exit(1);
    }

    try {
        const count = await PostsDB.publishScheduledPosts();
        console.log(`✅ Published ${count} post(s).`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error publishing posts:', error);
        process.exit(1);
    }
}

publishScheduledPosts();
