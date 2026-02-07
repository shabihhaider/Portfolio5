
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testAI() {
    console.log('🤖 Testing Groq AI Generation...');

    if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY not found');
        process.exit(1);
    }

    try {
        // Dynamic import to handle TS/Env execution order if needed, or just standard import since we use tsx
        const { generateBlogPost, generatePostMetadata } = await import('../src/lib/ai/groq');

        console.log('📝 Generating short test post...');
        const result = await generateBlogPost({
            topic: 'The benefits of static typing in JavaScript',
            minWords: 200, // Short for test
            maxWords: 400,
            includeCode: true
        });

        console.log('✅ Generation successful!');
        console.log(`--- Preview (First 100 chars) ---\n${result.content.slice(0, 100)}...\n-------------------`);
        console.log(`Model used: ${result.model}`);
        console.log(`Tokens used: ${result.tokensUsed}`);

        console.log('\n📊 Generating metadata...');
        const metadata = await generatePostMetadata(result.content, 'The benefits of static typing in JavaScript');

        if (metadata) {
            console.log('✅ Metadata generated:');
            console.log(JSON.stringify(metadata, null, 2));
        } else {
            console.error('❌ Metadata generation failed');
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testAI();
