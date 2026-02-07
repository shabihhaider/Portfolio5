
import dotenv from 'dotenv';
import path from 'path';

// Load env vars before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyConnection() {
    console.log('Testing MongoDB connection...');
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment');
        }
        console.log('URI found, attempting connection...');

        // Dynamic import to ensure env vars are loaded first
        const { getDb } = await import('../src/lib/db/mongodb');

        const db = await getDb();
        console.log('✅ Successfully connected to database:', db.databaseName);

        // Create collections if they don't exist
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        console.log('Existing collections:', collectionNames);

        const requiredCollections = ['posts', 'analytics', 'emails', 'settings'];
        for (const col of requiredCollections) {
            if (!collectionNames.includes(col)) {
                await db.createCollection(col);
                console.log(`Created collection: ${col}`);
            }
        }

        console.log('✅ verification complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

verifyConnection();
