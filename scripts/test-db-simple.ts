import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI is missing');
    process.exit(1);
}

async function run() {
    console.log('🔍 Testing Minimal Connection...');
    // Minimal options, let driver decide
    const client = new MongoClient(uri!);

    try {
        await client.connect();
        await client.db('portfolio_blog').command({ ping: 1 });
        console.log(`✅ SUCCESS: Connected with standard settings!`);
        await client.close();
    } catch (error: any) {
        console.log(`❌ FAILED: ${error.message}`);
    }
}

run().catch(console.error);
