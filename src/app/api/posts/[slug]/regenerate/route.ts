import { NextRequest, NextResponse } from 'next/server';
import { PostsDB } from '@/lib/db/posts';
import { isAuthenticated } from '@/lib/auth/admin';
import { generateBlogPost, generateSlug } from '@/lib/ai/gemini';
import { checkContentQuality } from '@/lib/ai/quality-check';
import { sanitizeContent } from '@/lib/ai/sanitize';
import { validatePost } from '@/lib/ai/validate-post';
import { author, site, ai, tagMap, categoryRules, defaultCategory } from '@/lib/config/site';
import readingTime from 'reading-time';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { slug } = await params;

        const oldPost = await PostsDB.getBySlug(slug);
        if (!oldPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Reject the old post
        await PostsDB.reject(slug);

        // Extract topic from the old post's tags/title
        const topic = oldPost.tags?.[0]
            ? `${oldPost.tags.join(', ')} - ${oldPost.title}`
            : oldPost.title;

        // Generate new content (single-pass JSON)
        const { content: rawContent, metadata, model } = await generateBlogPost({
            topic,
            includeSetupSteps: true,
            minWords: ai.defaults.minWords,
            maxWords: ai.defaults.maxWords,
            context: 'This is a regeneration. The previous version was rejected. Write a substantially different version with a fresh angle.',
        });

        const content = sanitizeContent(rawContent);
        const qualityCheck = checkContentQuality(content);

        // Validate before saving
        const validation = validatePost(content, { title: metadata.seo_title, metaDescription: metadata.meta_description });
        if (!validation.passed) {
            console.warn('⚠️ Regeneration validation failed:', validation.issues);
            return NextResponse.json(
                { error: 'Regenerated post failed validation', issues: validation.issues },
                { status: 422 }
            );
        }

        const baseSlug = metadata.slug || await generateSlug(metadata.seo_title);
        let newSlug = baseSlug;
        const existing = await PostsDB.getBySlug(newSlug);
        if (existing) {
            newSlug = `${baseSlug}-${Date.now()}`;
        }

        const stats = readingTime(content);
        const ogImageUrl = `${site.url}/api/og?title=${encodeURIComponent(metadata.seo_title)}&tags=${encodeURIComponent((metadata.tags || []).slice(0, 3).join(','))}`;

        // Derive category from tags
        const keywords = metadata.tags || [];
        const resolvedTags = new Set<string>();
        keywords.forEach((kw: string) => {
            for (const [key, tags] of Object.entries(tagMap)) {
                if (kw.toLowerCase().includes(key.toLowerCase())) {
                    tags.forEach(t => resolvedTags.add(t));
                }
            }
            resolvedTags.add(kw);
        });

        let category = defaultCategory;
        for (const rule of categoryRules) {
            if (rule.keywords.some(k => keywords.some((kw: string) => kw.toLowerCase().includes(k.toLowerCase())))) {
                category = rule.category;
                break;
            }
        }

        const postData = {
            slug: newSlug,
            title: metadata.seo_title,
            content,
            excerpt: metadata.meta_description || '',
            coverImage: ogImageUrl,
            author: author.name,
            status: 'draft',
            publishedAt: null,
            scheduledFor: new Date(Date.now() + ai.schedulingDelayMs),
            metaDescription: metadata.meta_description,
            metaKeywords: keywords,
            ogImage: ogImageUrl,
            tags: [...resolvedTags].slice(0, 5),
            category,
            readingTime: stats.text,
            generatedBy: model,
            humanEdited: false,
            qualityScore: qualityCheck.score,
        };

        const postId = await PostsDB.create(postData);

        return NextResponse.json({
            success: true,
            postId,
            slug: newSlug,
            title: metadata.seo_title,
            qualityScore: qualityCheck.score,
            autoPublish: qualityCheck.autoPublish,
            oldSlug: slug,
        });
    } catch (error) {
        console.error('Regenerate error:', error);
        return NextResponse.json({ error: 'Failed to regenerate post' }, { status: 500 });
    }
}
