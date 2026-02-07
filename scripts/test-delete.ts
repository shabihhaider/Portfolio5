
import dotenv from 'dotenv';
import path from 'path';
import { PostsDB } from '../src/lib/db/posts';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    const slug = 'final-production-test';
    console.log(`Attempting to delete post: ${slug}`);

    const post = await PostsDB.getBySlug(slug);
    if (!post) {
        console.log('Post not found (maybe already deleted?)');
        return;
    }
    console.log('Post found:', post.title);

    const success = await PostsDB.delete(slug);
    if (success) {
        console.log('✅ Delete successful via PostsDB');
    } else {
        console.error('❌ Delete failed via PostsDB');
    }
}

main().catch(console.error);
