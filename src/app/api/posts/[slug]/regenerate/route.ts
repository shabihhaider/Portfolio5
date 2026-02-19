import { NextRequest, NextResponse } from 'next/server';
import { PostsDB } from '@/lib/db/posts';
import { isAuthenticated } from '@/lib/auth/admin';
import { generateBlogPost, generatePostMetadata, generateSlug } from '@/lib/ai/gemini';
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

        // Generate new content
        const { content: rawContent, model } = await generateBlogPost({
            topic,
            includeCode: true,
            minWords: 800,
            maxWords: 1500,
            context: 'This is a regeneration. The previous version was rejected. Write a substantially different version with a fresh angle.',
        });

        const content = sanitizeContent(rawContent);
        const qualityCheck = checkContentQuality(content, 600);

        const metadata = await generatePostMetadata(content, topic);
        if (!metadata) {
            return NextResponse.json({ error: 'Failed to generate metadata' }, { status: 500 });
        }

        // Validate before saving
        const validation = validatePost(content, metadata);
        if (!validation.passed) {
            console.warn('⚠️ Regeneration validation failed:', validation.issues);
            return NextResponse.json(
                { error: 'Regenerated post failed validation', issues: validation.issues },
                { status: 422 }
            );
        }

        const baseSlug = await generateSlug(metadata.title);
        let newSlug = baseSlug;
        const existing = await PostsDB.getBySlug(newSlug);
        if (existing) {
            newSlug = `${baseSlug}-${Date.now()}`;
        }

        const stats = readingTime(content);
        const ogImageUrl = `${site.url}/api/og?title=${encodeURIComponent(metadata.title)}&tags=${encodeURIComponent((metadata.keywords || []).slice(0, 3).join(','))}`;

        const postData = {
            slug: newSlug,
            title: metadata.title,
            content,
            excerpt: metadata.excerpt || '',
            coverImage: ogImageUrl,
            author: author.name,
            status: 'draft',
            publishedAt: null,
            scheduledFor: new Date(Date.now() + ai.schedulingDelayMs),
            metaDescription: metadata.metaDescription,
            metaKeywords: metadata.keywords || [],
            ogImage: ogImageUrl,
            tags: (metadata.keywords || []).slice(0, 5),
            category: (() => {
                const kws = metadata.keywords || [];
                for (const rule of categoryRules) {
                    if (rule.keywords.some(k => kws.some((kw: string) => kw.toLowerCase().includes(k.toLowerCase())))) return rule.category;
                }
                return defaultCategory;
            })(),
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
            title: metadata.title,
            qualityScore: qualityCheck.score,
            oldSlug: slug,
        });
    } catch (error) {
        console.error('Regenerate error:', error);
        return NextResponse.json({ error: 'Failed to regenerate post' }, { status: 500 });
    }
}
