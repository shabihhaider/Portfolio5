import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, generateSlug } from '@/lib/ai/gemini';
import { checkContentQuality } from '@/lib/ai/quality-check';
import { sanitizeContent } from '@/lib/ai/sanitize';
import { validatePost } from '@/lib/ai/validate-post';
import { discoverAndResearch } from '@/lib/ai/topic-discovery';
import { PostsDB } from '@/lib/db/posts';
import { author, site, ai, defaultFocusAreas, tagMap, categoryRules, defaultCategory } from '@/lib/config/site';
import prisma from '@/lib/db/prisma';
import readingTime from 'reading-time';

/**
 * POST /api/generate
 * Full autonomous pipeline: discover → research → generate (single-pass JSON) → quality check → save
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
            includeSetupSteps?: boolean;
            internalLink?: string;
            sponsorEnabled?: boolean;
            sponsorText?: string;
            sponsorLink?: string;
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
        const includeSetupSteps = settings.includeSetupSteps ?? true;
        const tone = settings.aiTone || undefined;
        const internalLink = settings.internalLink || 'https://shabih.tech';

        // ── Determine Topic ───────────────────────────────
        let topic: string;
        let researchContext = '';

        if (manualTopic) {
            topic = manualTopic;
            console.log(`🤖 Manual topic: "${topic}"`);
        } else {
            console.log(`🔍 Autonomous topic discovery...`);

            const existingPosts = await PostsDB.getAll();
            const existingSlugs = existingPosts.map(p => p.slug);

            const research = await discoverAndResearch(focusAreas as string[], existingSlugs);
            topic = research.topic.title;

            const parts: string[] = [`Research context for: "${topic}"`];
            if (research.keyPoints.length) parts.push(`Key points: ${research.keyPoints.join('; ')}`);
            if (research.recentDevelopments.length) parts.push(`Recent developments: ${research.recentDevelopments.join('; ')}`);
            if (research.uniqueAngles.length) parts.push(`Unique angles: ${research.uniqueAngles.join('; ')}`);
            if (research.researchContext) parts.push(`Summary: ${research.researchContext}`);
            researchContext = parts.join('\n\n');
        }

        // ── Generate Content (Single-Pass JSON) with retry ──
        const MAX_ATTEMPTS = ai.maxQualityAttempts;
        let content = '';
        let metadata;
        let model = '';
        let qualityCheck;
        let lastIssues: string[] = [];

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            console.log(`📝 Generate attempt ${attempt}/${MAX_ATTEMPTS}...`);

            try {
                const result = await generateBlogPost({
                    topic,
                    context: [
                        researchContext,
                        attempt > 1 ? `Previous attempt failed quality checks: ${lastIssues.join('; ')}. Fix ALL issues this time.` : '',
                    ].filter(Boolean).join('\n\n'),
                    includeSetupSteps,
                    minWords,
                    maxWords,
                    tone,
                    internalLink,
                    sponsorEnabled: settings.sponsorEnabled,
                    sponsorText: settings.sponsorText,
                    sponsorLink: settings.sponsorLink,
                });

                content = sanitizeContent(result.content);
                metadata = result.metadata;
                model = result.model;
            } catch (genError) {
                console.error(`❌ Generation attempt ${attempt} failed:`, genError);
                if (attempt === MAX_ATTEMPTS) throw genError;
                continue;
            }

            // ── Quality Check (100-point rubric) ──────────────
            qualityCheck = checkContentQuality(content);
            console.log(`📊 Quality score: ${qualityCheck.score}/100 (attempt ${attempt})`);

            if (qualityCheck.passed) break;

            lastIssues = qualityCheck.issues;
            console.log(`❌ Quality check failed (attempt ${attempt}):`, lastIssues);
        }

        if (!qualityCheck?.passed) {
            return NextResponse.json(
                { error: 'Quality check failed after retries', issues: qualityCheck?.issues || lastIssues, score: qualityCheck?.score || 0, breakdown: qualityCheck?.breakdown || {} },
                { status: 422 }
            );
        }

        // ── Validate ─────────────────────────────────────
        const validation = validatePost(content, { title: metadata!.seo_title, metaDescription: metadata!.meta_description });
        if (!validation.passed) {
            return NextResponse.json(
                { error: 'Validation failed', issues: validation.issues },
                { status: 422 }
            );
        }

        // ── Use metadata from single-pass response ───────
        const slug = metadata!.slug || await generateSlug(metadata!.seo_title);
        let finalSlug = slug;
        const existing = await PostsDB.getBySlug(finalSlug);
        if (existing) finalSlug = `${slug}-${Date.now()}`;

        // ── Derive tags & category ────────────────────────
        const keywords: string[] = metadata!.tags || [];
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
        const ogImageUrl = `${site.url}/api/og?title=${encodeURIComponent(metadata!.seo_title)}&tags=${encodeURIComponent([...resolvedTags].slice(0, 3).join(','))}`;

        const postData = {
            slug: finalSlug,
            title: metadata!.seo_title,
            content,
            excerpt: metadata!.meta_description || '',
            coverImage: ogImageUrl,
            author: author.name,
            publishedAt: null,
            scheduledFor: new Date(Date.now() + ai.schedulingDelayMs),
            status: 'draft',
            metaDescription: metadata!.meta_description,
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
            slug: finalSlug,
            title: metadata!.seo_title,
            qualityScore: qualityCheck.score,
            autoPublish: qualityCheck.autoPublish,
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
