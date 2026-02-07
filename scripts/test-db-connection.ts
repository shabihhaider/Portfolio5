import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getDb } from '../src/lib/db/mongodb';
import { PostsDB } from '../src/lib/db/posts';

async function testConnection() {
    try {
        console.log('Testing MongoDB Connection...');
        const db = await getDb();
        console.log('✓ Connected to Database:', db.databaseName);

        console.log('Fetching posts...');
        const posts = await PostsDB.getPublishedPosts();
        console.log(`✓ Fetched ${posts.length} published posts.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
        process.exit(1);
    }
}

testConnection();
