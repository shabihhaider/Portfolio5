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

// Test Configurations
const configs = [
    { name: 'Default (No Options)', options: {} },
    { name: 'IPv4 Only', options: { family: 4 } },
    { name: 'TLS Allow Invalid', options: { tlsAllowInvalidCertificates: true } },
    { name: 'IPv4 + TLS Allow Invalid', options: { family: 4, tlsAllowInvalidCertificates: true } },
    {
        name: 'Aggressive Bypass', options: {
            tls: true,
            tlsAllowInvalidCertificates: true,
            tlsInsecure: true
        }
    },
    { name: 'No IPv6', options: { family: 4 } }
];

async function testConnection(config: { name: string, options: any }) {
    console.log(`\n🧪 Testing: ${config.name}`);
    console.log(`   Options: ${JSON.stringify(config.options)}`);

    const client = new MongoClient(uri!, config.options);

    try {
        await client.connect();
        await client.db('portfolio_blog').command({ ping: 1 });
        console.log(`✅ SUCCESS: Connected to MongoDB!`);
        await client.close();
        return true;
    } catch (error: any) {
        console.log(`❌ FAILED: ${error.message}`);
        if (error.cause) console.log(`   Cause: ${error.cause.message}`);
        return false;
    }
}

async function run() {
    console.log('🔍 Starting MongoDB Connection Diagnostics...');
    console.log(`Target URI: ${uri!.replace(/:([^:@]+)@/, ':****@')}`); // Mask password

    for (const config of configs) {
        await testConnection(config);
    }
}

run().catch(console.error);
