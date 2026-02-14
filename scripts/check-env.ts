import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🔍 Checking Environment Variables...');

const required = [
    'JWT_SECRET',
    'ADMIN_PASSWORD_HASH',
    'DATABASE_URL',
    'GROQ_API_KEY'
];

let missing = false;

required.forEach(key => {
    if (!process.env[key]) {
        console.error(`❌ Missing: ${key}`);
        missing = true;
    } else {
        console.log(`✅ Present: ${key}`);
    }
});

if (missing) {
    console.error('\n⚠️  Critical environment variables are missing. The app will not function correctly.');
    process.exit(1);
} else {
    console.log('\n✅ All required environment variables are set.');
}
