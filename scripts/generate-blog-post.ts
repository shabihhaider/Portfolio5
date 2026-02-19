import dotenv from 'dotenv';
import path from 'path';
import readingTime from 'reading-time';

// Load env vars BEFORE importing modules that use them
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Dynamic imports to ensure env vars are loaded
const importLib = async () => {
    const { generateBlogPost, generateSlug } = await import('../src/lib/ai/gemini');
    const { discoverAndResearch } = await import('../src/lib/ai/topic-discovery');
    const { checkContentQuality } = await import('../src/lib/ai/quality-check');
    const { sanitizeContent } = await import('../src/lib/ai/sanitize');
    const { validatePost } = await import('../src/lib/ai/validate-post');
    const { PostsDB } = await import('../src/lib/db/posts');
    const config = await import('../src/lib/config/site');
    return { generateBlogPost, generateSlug, discoverAndResearch, checkContentQuality, sanitizeContent, validatePost, PostsDB, config };
};

async function main() {
    const { generateBlogPost, generateSlug, discoverAndResearch, checkContentQuality, sanitizeContent, validatePost, PostsDB, config } = await importLib();
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
        includeSetupSteps?: boolean;
        autoPublish?: boolean;
        internalLink?: string;
        sponsorEnabled?: boolean;
        sponsorText?: string;
        sponsorLink?: string;
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
    const includeSetupSteps = settings.includeSetupSteps ?? true;
    const tone = settings.aiTone || undefined;
    const internalLink = settings.internalLink || 'https://shabih.tech';

    // ── Determine Topic ──────────────────────────────────
    const manualTopic = process.argv[2];
    let topic: string;
    let researchContext = '';

    if (manualTopic) {
        topic = manualTopic;
        console.log(`📌 Manual topic: "${topic}"`);
    } else {
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('  🔍 AUTONOMOUS TOPIC DISCOVERY');
        console.log('═══════════════════════════════════════════');
        console.log(`  Focus areas: ${[...focusAreas].join(', ')}`);
        console.log('');

        try {
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
            console.warn('⚠️ Autonomous discovery failed, using evergreen fallback:', error);
            const picked = config.EVERGREEN_FALLBACK_TOPICS[Math.floor(Math.random() * config.EVERGREEN_FALLBACK_TOPICS.length)];
            topic = picked;
        }
    }

    console.log(`🤖 Generating blog post about: "${topic}"`);

    try {
        // ── Generate Content (Single-Pass JSON) ──────────
        let qualityCheck;
        let content = '';
        let model = '';
        let metadata;
        let attempts = 0;
        const MAX_ATTEMPTS = config.ai.maxQualityAttempts;

        while (attempts < MAX_ATTEMPTS) {
            attempts++;
            console.log(`📝 Generating content (Attempt ${attempts}/${MAX_ATTEMPTS})...`);

            const result = await generateBlogPost({
                topic,
                tone,
                includeSetupSteps,
                minWords,
                maxWords,
                tags: extractTags(topic),
                internalLink,
                sponsorEnabled: settings.sponsorEnabled,
                sponsorText: settings.sponsorText,
                sponsorLink: settings.sponsorLink,
                context: [
                    researchContext,
                    attempts > 1 ? 'Previous attempt failed quality checks. Ensure 500-700 words, numbered steps, "Who benefits" section, "The catch" section, internal link to shabih.tech, and external link to the tool.' : '',
                ].filter(Boolean).join('\n\n'),
            });

            content = result.content;
            model = result.model;
            metadata = result.metadata;

            // Sanitize UI artifacts, fix code blocks, strip JSX
            content = sanitizeContent(content);

            console.log('✅ Checking content quality (100-point rubric)...');
            qualityCheck = checkContentQuality(content);

            console.log(`   Score: ${qualityCheck.score}/100`);
            if (qualityCheck.issues.length) console.log(`   Issues: ${qualityCheck.issues.join('; ')}`);

            if (qualityCheck.passed) break;

            console.log('❌ Quality check failed (need ≥60)');
            if (attempts < MAX_ATTEMPTS) console.log('🔄 Retrying...');
        }

        if (!qualityCheck?.passed) {
            console.error('❌ Failed to generate quality content after multiple attempts.');
            process.exit(1);
        }

        console.log(`✅ Quality score: ${qualityCheck.score}/100 ${qualityCheck.autoPublish ? '(auto-publish eligible)' : '(needs review)'}`);

        // ── Pre-publish Validation ─────────────────────────
        const validation = validatePost(content, { title: metadata!.seo_title, metaDescription: metadata!.meta_description });
        if (!validation.passed) {
            console.error('❌ Post validation failed:');
            validation.issues.forEach(i => console.error(`   [${i.severity}] ${i.rule}: ${i.message}`));
            process.exit(1);
        }
        if (validation.issues.length > 0) {
            console.warn('⚠️ Validation warnings:');
            validation.issues.forEach(i => console.warn(`   [${i.severity}] ${i.rule}: ${i.message}`));
        }

        const slug = metadata!.slug || await generateSlug(metadata!.seo_title);
        const stats = readingTime(content);

        const siteUrl = config.site.url;
        const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(metadata!.seo_title)}&tags=${encodeURIComponent((metadata!.tags || []).slice(0, 3).join(','))}`;

        // ── Derive tags & category ───────────────────────
        const keywords = metadata!.tags || [];
        const resolvedTags = new Set<string>();
        keywords.forEach((kw: string) => {
            for (const [key, tags] of Object.entries(config.tagMap)) {
                if (kw.toLowerCase().includes(key.toLowerCase())) {
                    tags.forEach(t => resolvedTags.add(t));
                }
            }
            resolvedTags.add(kw);
        });

        let category = config.defaultCategory;
        for (const rule of config.categoryRules) {
            if (rule.keywords.some(k => keywords.some((kw: string) => kw.toLowerCase().includes(k.toLowerCase())))) {
                category = rule.category;
                break;
            }
        }

        // ── Save to Database ─────────────────────────────
        let finalSlug = slug;
        const existing = await PostsDB.getBySlug(slug);
        if (existing) {
            console.log('⚠️ Slug exists, adding timestamp');
            finalSlug = `${slug}-${Date.now()}`;
        }

        const postData = {
            slug: finalSlug,
            title: String(metadata!.seo_title),
            content: String(content),
            excerpt: String(metadata!.meta_description || ''),
            coverImage: ogImageUrl,
            author: process.env.NEXT_PUBLIC_AUTHOR_NAME || config.author.name,
            status: 'draft' as const,
            metaDescription: String(metadata!.meta_description || ''),
            metaKeywords: keywords.map(String),
            ogImage: ogImageUrl,
            tags: [...resolvedTags].slice(0, 5),
            category,
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
        console.log(`  📝 Title: ${metadata!.seo_title}`);
        console.log(`  🔗 Slug: ${finalSlug}`);
        console.log(`  📅 Scheduled: ${postData.scheduledFor.toISOString()}`);
        console.log(`  📊 Quality: ${qualityCheck.score}/100`);
        console.log(`  🤖 Model: ${model}`);
        console.log(`  📢 Auto-publish: ${qualityCheck.autoPublish ? 'Yes' : 'No (needs review)'}`);
        console.log('═══════════════════════════════════════════');

        console.log(JSON.stringify({
            success: true,
            slug: finalSlug,
            title: metadata!.seo_title,
            scheduledFor: postData.scheduledFor,
            qualityScore: qualityCheck.score,
            autoPublish: qualityCheck.autoPublish,
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
        sections.push('Key points discovered:');
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

    sections.push('IMPORTANT: Write an ORIGINAL practical guide informed by this research. Focus on helping non-technical readers USE the tool, not understand how it works internally.');

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

    return tags.length > 0 ? tags : ['AI Tools'];
}

main();
