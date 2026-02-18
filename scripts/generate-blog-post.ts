import dotenv from 'dotenv';
import path from 'path';
import readingTime from 'reading-time';

// Load env vars BEFORE importing modules that use them
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Dynamic imports to ensure env vars are loaded
const importLib = async () => {
    const { generateBlogPost, generatePostMetadata, generateSlug } = await import('../src/lib/ai/gemini');
    const { discoverAndResearch } = await import('../src/lib/ai/topic-discovery');
    const { checkContentQuality } = await import('../src/lib/ai/quality-check');
    const { PostsDB } = await import('../src/lib/db/posts');
    const config = await import('../src/lib/config/site');
    return { generateBlogPost, generatePostMetadata, generateSlug, discoverAndResearch, checkContentQuality, PostsDB, config };
};

async function main() {
    const { generateBlogPost, generatePostMetadata, generateSlug, discoverAndResearch, checkContentQuality, PostsDB, config } = await importLib();
    const { default: prisma } = await import('../src/lib/db/prisma');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found');
        process.exit(1);
    }

    // ── Load Settings from Admin DB ───────────────────────
    let settings: {
        contentTopics?: string[];
        aiTone?: string;
        minWordCount?: number;
        maxWordCount?: number;
        includeCodeExamples?: boolean;
        autoPublish?: boolean;
    } = {};
    try {
        const s = await prisma.siteSettings.findFirst();
        if (s) settings = s;
    } catch (e) {
        console.warn('⚠️ Could not load site settings, using defaults.');
    }

    const focusAreas = settings.contentTopics?.length
        ? settings.contentTopics
        : config.defaultFocusAreas;
    const minWords = settings.minWordCount || config.ai.defaults.minWords;
    const maxWords = settings.maxWordCount || config.ai.defaults.maxWords;
    const includeCode = settings.includeCodeExamples ?? true;
    const tone = settings.aiTone || undefined;

    // ── Determine Topic ──────────────────────────────────
    const manualTopic = process.argv[2];
    let topic: string;
    let researchContext = '';

    if (manualTopic) {
        // Manual override — user passed a specific topic
        topic = manualTopic;
        console.log(`📌 Manual topic: "${topic}"`);
    } else {
        // ✨ AUTONOMOUS MODE — AI discovers trending topics & researches them
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('  🔍 AUTONOMOUS TOPIC DISCOVERY');
        console.log('═══════════════════════════════════════════');
        console.log(`  Focus areas: ${focusAreas.join(', ')}`);
        console.log('');

        try {
            // Get existing post slugs to avoid duplicates
            const existingPosts = await PostsDB.getPublishedPosts();
            const draftPosts = await prisma.post.findMany({
                select: { slug: true, title: true },
                where: { status: { in: ['draft', 'approved', 'scheduled'] } }
            });
            const existingSlugs = [
                ...existingPosts.map(p => p.slug),
                ...draftPosts.map(p => p.title.toLowerCase()),
            ];

            const research = await discoverAndResearch([...focusAreas], existingSlugs);
            topic = research.topic.title;
            researchContext = buildResearchPrompt(research);

            console.log('');
            console.log('📊 Research Summary:');
            console.log(`   Key points: ${research.keyPoints.length}`);
            console.log(`   Recent developments: ${research.recentDevelopments.length}`);
            console.log(`   Unique angles: ${research.uniqueAngles.length}`);
            console.log(`   Sources found: ${research.sources.length}`);
            console.log('');
        } catch (error) {
            console.warn('⚠️ Autonomous discovery failed, falling back to focus areas:', error);
            topic = `Latest trends in ${focusAreas[Math.floor(Math.random() * focusAreas.length)]}`;
        }
    }

    console.log(`🤖 Generating blog post about: "${topic}"`);

    try {
        // ── Generate Content ─────────────────────────────
        let qualityCheck;
        let content = '';
        let model = '';
        let attempts = 0;
        const MAX_ATTEMPTS = config.ai.maxQualityAttempts;

        while (attempts < MAX_ATTEMPTS) {
            attempts++;
            console.log(`📝 Generating content (Attempt ${attempts}/${MAX_ATTEMPTS})...`);

            const result = await generateBlogPost({
                topic,
                tone,
                includeCode,
                minWords,
                maxWords,
                tags: extractTags(topic),
                context: [
                    researchContext,
                    attempts > 1 ? 'Previous attempt failed quality checks. Ensure sufficient length, headers, and code examples.' : '',
                ].filter(Boolean).join('\n\n'),
            });

            content = result.content;
            model = result.model;

            console.log('✅ Checking content quality...');
            qualityCheck = checkContentQuality(content, 600);

            if (qualityCheck.passed) break;

            console.log('❌ Quality check failed:', qualityCheck.issues);
            if (attempts < MAX_ATTEMPTS) console.log('🔄 Retrying...');
        }

        if (!qualityCheck?.passed) {
            console.error('❌ Failed to generate quality content after multiple attempts.');
            process.exit(1);
        }

        console.log(`✅ Quality score: ${qualityCheck.score}/10`);

        // ── Generate Metadata ────────────────────────────
        console.log('📊 Generating metadata...');
        const metadata = await generatePostMetadata(content, topic);
        if (!metadata) throw new Error('Failed to generate metadata');

        const slug = await generateSlug(metadata.title);
        const stats = readingTime(content);

        const siteUrl = config.site.url;
        const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(metadata.title)}&tags=${encodeURIComponent((metadata.keywords || []).slice(0, 3).join(','))}`;

        // ── Save to Database ─────────────────────────────
        let finalSlug = slug;
        const existing = await PostsDB.getBySlug(slug);
        if (existing) {
            console.log('⚠️ Slug exists, adding timestamp');
            finalSlug = `${slug}-${Date.now()}`;
        }

        const postData = {
            slug: finalSlug,
            title: String(metadata.title),
            content: String(content),
            excerpt: String(metadata.excerpt || ''),
            coverImage: ogImageUrl,
            author: process.env.NEXT_PUBLIC_AUTHOR_NAME || config.author.name,
            status: 'draft' as const,
            metaDescription: String(metadata.metaDescription || ''),
            metaKeywords: (metadata.keywords || []).map(String),
            ogImage: ogImageUrl,
            tags: (metadata.keywords || []).map(String).slice(0, 5),
            category: categorize((metadata.keywords || []).map(String)),
            readingTime: stats.text,
            generatedBy: String(model),
            humanEdited: false,
            qualityScore: Number(qualityCheck.score) || 0,
            publishedAt: null,
            scheduledFor: new Date(Date.now() + config.ai.schedulingDelayMs),
        };

        console.log('💾 Saving to database...');
        await PostsDB.create(postData);

        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('  ✅ BLOG POST CREATED SUCCESSFULLY');
        console.log('═══════════════════════════════════════════');
        console.log(`  📝 Title: ${metadata.title}`);
        console.log(`  🔗 Slug: ${finalSlug}`);
        console.log(`  📅 Scheduled: ${postData.scheduledFor.toISOString()}`);
        console.log(`  📊 Quality: ${qualityCheck.score}/10`);
        console.log(`  🤖 Model: ${model}`);
        console.log('═══════════════════════════════════════════');

        console.log(JSON.stringify({
            success: true,
            slug: finalSlug,
            title: metadata.title,
            scheduledFor: postData.scheduledFor,
        }));
        process.exit(0);

    } catch (error) {
        console.error('❌ Error generating blog post:', error);
        process.exit(1);
    }
}

/**
 * Build a rich research context string for the content generator.
 */
function buildResearchPrompt(research: {
    topic: { title: string; angle: string; whyTrending: string };
    keyPoints: string[];
    recentDevelopments: string[];
    uniqueAngles: string[];
    sources: string[];
    researchContext: string;
}): string {
    const sections = [
        `RESEARCH CONTEXT (from real web sources):`,
        `Topic: ${research.topic.title}`,
        `Why it's trending: ${research.topic.whyTrending}`,
        `Unique angle to take: ${research.topic.angle}`,
        '',
        research.researchContext,
        '',
    ];

    if (research.keyPoints.length > 0) {
        sections.push('Key technical points discovered:');
        research.keyPoints.forEach(p => sections.push(`- ${p}`));
        sections.push('');
    }

    if (research.recentDevelopments.length > 0) {
        sections.push('Recent developments:');
        research.recentDevelopments.forEach(d => sections.push(`- ${d}`));
        sections.push('');
    }

    if (research.uniqueAngles.length > 0) {
        sections.push('Unique angles most articles miss:');
        research.uniqueAngles.forEach(a => sections.push(`- ${a}`));
        sections.push('');
    }

    sections.push('IMPORTANT: Write an ORIGINAL post informed by this research. Do NOT copy or paraphrase any source directly. Use the facts and insights to write from YOUR authentic developer perspective.');

    return sections.join('\n');
}

function extractTags(topic: string): string[] {
    const { tagMap } = require('../src/lib/config/site');

    const tags: string[] = [];
    for (const [key, values] of Object.entries(tagMap)) {
        if (topic.toLowerCase().includes(key.toLowerCase())) {
            tags.push(...(values as string[]));
        }
    }

    return tags.length > 0 ? tags : ['Web Development'];
}

function categorize(keywords: string[]): string {
    const { categoryRules, defaultCategory } = require('../src/lib/config/site');

    for (const rule of categoryRules) {
        if (keywords.some((k: string) => rule.keywords.includes(k))) {
            return rule.category;
        }
    }
    return defaultCategory;
}

main();
