import dotenv from 'dotenv';
import path from 'path';
import readingTime from 'reading-time';

// Load env vars BEFORE importing modules that use them
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Dynamic imports to ensure env vars are loaded
const importLib = async () => {
    const { generateBlogPost, generatePostMetadata, generateSlug } = await import('../src/lib/ai/groq');
    const { checkContentQuality } = await import('../src/lib/ai/quality-check');
    const { PostsDB } = await import('../src/lib/db/posts');
    return { generateBlogPost, generatePostMetadata, generateSlug, checkContentQuality, PostsDB };
};

const TOPICS = [
    'Building AI applications with TensorFlow and Next.js',
    'Full-stack development best practices in 2026',
    'Computer vision for beginners: practical guide',
    'Next.js performance optimization techniques',
    'MongoDB database design patterns',
    'Real-world AI/ML project case studies',
    'TypeScript tips for better code quality',
    'Deploying ML models in production',
    'React hooks and advanced patterns',
    'Building SaaS applications from scratch',
];

async function main() {
    // Load modules
    const { generateBlogPost, generatePostMetadata, generateSlug, checkContentQuality, PostsDB } = await importLib();
    // Dynamic import for prisma to avoid top-level issues
    const { default: prisma } = await import('../src/lib/db/prisma');

    let topic = process.argv[2];

    // If no topic provided, try to fetch from Settings
    if (!topic) {
        try {
            const settings = await prisma.siteSettings.findFirst();
            if (settings && settings.contentTopics.length > 0) {
                topic = settings.contentTopics[Math.floor(Math.random() * settings.contentTopics.length)];
                console.log('🤖 Selected topic from Site Settings:', topic);
            }
        } catch (e) {
            console.warn('⚠️ Could not fetch settings, using default topics.');
        }
    }

    if (!topic) {
        topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    }

    console.log(`🤖 Generating blog post about: ${topic}`);

    if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY not found');
        process.exit(1);
    }

    try {
        // 1. Generate content with retry logic
        let qualityCheck;
        let content = '';
        let model = '';
        let attempts = 0;
        const MAX_ATTEMPTS = 3;

        while (attempts < MAX_ATTEMPTS) {
            attempts++;
            console.log(`📝 Generating content with AI (Attempt ${attempts}/${MAX_ATTEMPTS})...`);

            const result = await generateBlogPost({
                topic,
                includeCode: true,
                minWords: 600,
                maxWords: 1500,
                tags: extractTags(topic),
                // Add context about previous failure if this is a retry
                context: attempts > 1 ? 'Previous attempt failed quality checks. Ensure sufficient length, headers, and code examples.' : undefined
            });

            content = result.content;
            model = result.model;

            console.log('✅ Checking content quality...');
            qualityCheck = checkContentQuality(content, 600);

            if (qualityCheck.passed) {
                break;
            }

            console.log('❌ Quality check failed:', qualityCheck.issues);
            if (attempts < MAX_ATTEMPTS) {
                console.log('🔄 Retrying...');
            }
        }

        if (!qualityCheck?.passed) {
            console.error('❌ Failed to generate quality content after multiple attempts.');
            process.exit(1);
        }

        console.log(`✅ Quality score: ${qualityCheck.score}/10`);

        // 3. Generate metadata
        console.log('📊 Generating metadata...');
        const metadata = await generatePostMetadata(content, topic);
        if (!metadata) {
            throw new Error('Failed to generate metadata');
        }

        const slug = await generateSlug(metadata.title);
        const stats = readingTime(content);

        // 4. Generate OG image URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio5-olive.vercel.app';
        const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(metadata.title)}&tags=${encodeURIComponent((metadata.keywords || []).slice(0, 3).join(','))}`;

        // 5. Save to Database
        console.log('💾 Saving to database...');

        let finalSlug = slug;
        const existing = await PostsDB.getBySlug(slug);
        if (existing) {
            console.log('⚠️ Post with this slug already exists, adding timestamp');
            finalSlug = `${slug}-${Date.now()}`;
        }

        // ✅ FIXED: Type Safety - No 'as any' cast
        // We construct the object to match what PostsDB.create expects (Omit<Post, 'id' | ...>)
        // We need to import Post type or just rely on structural typing if valid.
        // The issue was 'as any'. Let's shape it correctly.

        const postData = {
            slug: finalSlug,
            title: metadata.title,
            content,
            excerpt: metadata.excerpt || '', // Ensure string
            coverImage: ogImageUrl,

            author: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Shabih Haider',
            status: 'draft',

            metaDescription: metadata.metaDescription,
            metaKeywords: metadata.keywords || [],
            ogImage: ogImageUrl,

            tags: (metadata.keywords || []).slice(0, 5),
            category: categorize(metadata.keywords || []),

            readingTime: stats.text,

            generatedBy: model,
            humanEdited: false,
            qualityScore: qualityCheck.score,

            publishedAt: null,
            scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000),
        };

        await PostsDB.create(postData);

        console.log('✅ Blog post created successfully!');
        console.log(`📝 Title: ${metadata.title}`);
        console.log(`🔗 Slug: ${finalSlug}`);
        console.log(`📅 Scheduled for: ${postData.scheduledFor.toISOString()}`);
        console.log(`📊 Quality: ${qualityCheck.score}/10`);

        const output = {
            success: true,
            slug: finalSlug,
            title: metadata.title,
            scheduledFor: postData.scheduledFor,
        };

        console.log(JSON.stringify(output));
        process.exit(0);

    } catch (error) {
        console.error('❌ Error generating blog post:', error);
        process.exit(1);
    }
}

function extractTags(topic: string): string[] {
    const tagMap: Record<string, string[]> = {
        'AI': ['AI/ML', 'Artificial Intelligence'],
        'TensorFlow': ['TensorFlow', 'Machine Learning'],
        'Next.js': ['Next.js', 'React', 'Web Development'],
        'TypeScript': ['TypeScript', 'JavaScript'],
        'MongoDB': ['MongoDB', 'Database'],
        'performance': ['Performance', 'Optimization'],
        'SaaS': ['SaaS', 'Full-Stack'],
    };

    const tags: string[] = [];
    for (const [key, values] of Object.entries(tagMap)) {
        if (topic.toLowerCase().includes(key.toLowerCase())) {
            tags.push(...values);
        }
    }

    return tags.length > 0 ? tags : ['Web Development'];
}

function categorize(keywords: string[]): string {
    if (keywords.some(k => ['AI', 'ML', 'TensorFlow', 'PyTorch'].includes(k))) {
        return 'AI/Machine Learning';
    }
    if (keywords.some(k => ['Next.js', 'React', 'TypeScript'].includes(k))) {
        return 'Web Development';
    }
    if (keywords.some(k => ['MongoDB', 'PostgreSQL', 'Database'].includes(k))) {
        return 'Backend';
    }
    return 'General';
}

main();
