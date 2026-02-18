import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, generatePostMetadata, generateSlug } from '@/lib/ai/gemini';
import { checkContentQuality } from '@/lib/ai/quality-check';
import { discoverAndResearch } from '@/lib/ai/topic-discovery';
import { PostsDB } from '@/lib/db/posts';
import { author, site, ai, defaultFocusAreas, tagMap, categoryRules, defaultCategory } from '@/lib/config/site';
import prisma from '@/lib/db/prisma';
import readingTime from 'reading-time';

/**
 * POST /api/generate
 * Full autonomous pipeline: discover → research → generate → quality check → save
 * Called by GitHub Actions cron (Mon/Wed/Fri) or manually from admin.
 */
export async function POST(request: NextRequest) {
    try {
        // ── Auth ──────────────────────────────────────────
        const { isAuthenticated } = await import('@/lib/auth/admin');
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ── Rate Limiting ─────────────────────────────────
        const { generateLimiter } = await import('@/lib/rate-limit');
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        if (!generateLimiter.check(ip)) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        const body = await request.json().catch(() => ({}));
        const { topic: manualTopic } = body;

        // ── Load Admin Settings ───────────────────────────
        let settings: {
            contentTopics?: string[];
            aiTone?: string;
            minWordCount?: number;
            maxWordCount?: number;
            includeCodeExamples?: boolean;
        } = {};
        try {
            const s = await prisma.siteSettings.findFirst();
            if (s) settings = s;
        } catch { /* use defaults */ }

        const focusAreas = settings.contentTopics?.length
            ? settings.contentTopics
            : [...defaultFocusAreas];
        const minWords = settings.minWordCount || ai.defaults.minWords;
        const maxWords = settings.maxWordCount || ai.defaults.maxWords;
        const includeCode = settings.includeCodeExamples ?? true;
        const tone = settings.aiTone || undefined;

        // ── Determine Topic ───────────────────────────────
        let topic: string;
        let researchContext = '';

        if (manualTopic) {
            // Manual topic passed in request body
            topic = manualTopic;
            console.log(`🤖 Manual topic: "${topic}"`);
        } else {
            // Autonomous discovery
            console.log(`🔍 Autonomous topic discovery...`);

            const existingPosts = await PostsDB.getAll();
            const existingSlugs = existingPosts.map(p => p.slug);

            const research = await discoverAndResearch(focusAreas as string[], existingSlugs);
            topic = research.topic.title;

            // Build research context for the content generator
            const parts: string[] = [`Research context for: "${topic}"`];
            if (research.keyPoints.length) parts.push(`Key points: ${research.keyPoints.join('; ')}`);
            if (research.recentDevelopments.length) parts.push(`Recent developments: ${research.recentDevelopments.join('; ')}`);
            if (research.uniqueAngles.length) parts.push(`Unique angles: ${research.uniqueAngles.join('; ')}`);
            if (research.researchContext) parts.push(`Summary: ${research.researchContext}`);
            researchContext = parts.join('\n\n');
        }

        // ── Generate Content ──────────────────────────────
        const { content, model } = await generateBlogPost({
            topic,
            context: researchContext,
            includeCode,
            minWords,
            maxWords,
            tone,
        });

        // ── Quality Check ─────────────────────────────────
        const qualityCheck = checkContentQuality(content, Math.floor(minWords * 0.75));

        if (!qualityCheck.passed) {
            return NextResponse.json(
                { error: 'Quality check failed', issues: qualityCheck.issues, score: qualityCheck.score },
                { status: 422 }
            );
        }

        // ── Metadata ──────────────────────────────────────
        const metadata = await generatePostMetadata(content, topic);
        if (!metadata) {
            return NextResponse.json({ error: 'Failed to generate metadata' }, { status: 500 });
        }

        const baseSlug = await generateSlug(metadata.title);
        let slug = baseSlug;
        const existing = await PostsDB.getBySlug(slug);
        if (existing) slug = `${baseSlug}-${Date.now()}`;

        // ── Derive tags & category ────────────────────────
        const keywords: string[] = metadata.keywords || [];
        const resolvedTags = new Set<string>();
        keywords.forEach(kw => {
            for (const [key, tags] of Object.entries(tagMap)) {
                if (kw.toLowerCase().includes(key.toLowerCase())) {
                    tags.forEach(t => resolvedTags.add(t));
                }
            }
            resolvedTags.add(kw);
        });

        let category = defaultCategory;
        for (const rule of categoryRules) {
            if (rule.keywords.some(k => keywords.some(kw => kw.toLowerCase().includes(k.toLowerCase())))) {
                category = rule.category;
                break;
            }
        }

        // ── Save ──────────────────────────────────────────
        const stats = readingTime(content);
        const ogImageUrl = `${site.url}/api/og?title=${encodeURIComponent(metadata.title)}&tags=${encodeURIComponent([...resolvedTags].slice(0, 3).join(','))}`;

        const postData = {
            slug,
            title: metadata.title,
            content,
            excerpt: metadata.excerpt || '',
            coverImage: ogImageUrl,
            author: author.name,
            publishedAt: null,
            scheduledFor: new Date(Date.now() + ai.schedulingDelayMs),
            status: 'draft',
            metaDescription: metadata.metaDescription,
            metaKeywords: keywords,
            ogImage: ogImageUrl,
            tags: [...resolvedTags].slice(0, 5),
            category,
            views: 0,
            likes: 0,
            readingTime: stats.text,
            generatedBy: model,
            humanEdited: false,
            qualityScore: qualityCheck.score,
            ctaClicks: 0,
        };

        const postId = await PostsDB.create(postData);

        return NextResponse.json({
            success: true,
            postId,
            slug,
            title: metadata.title,
            qualityScore: qualityCheck.score,
            scheduledFor: postData.scheduledFor,
        });
    } catch (error) {
        console.error('Generation Error:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';

        if (msg.includes('GEMINI_API_KEY')) {
            return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
        }
        if (msg.includes('DATABASE_URL') || msg.includes('prisma')) {
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

        return NextResponse.json(
            { error: 'Failed to generate content', details: process.env.NODE_ENV === 'development' ? msg : undefined },
            { status: 500 }
        );
    }
}
