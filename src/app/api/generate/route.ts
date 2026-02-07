import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, generatePostMetadata, generateSlug } from '@/lib/ai/groq';
import { checkContentQuality } from '@/lib/ai/quality-check';
import { PostsDB } from '@/lib/db/posts';
import readingTime from 'reading-time';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const { topic: requestedTopic, context } = body;

        const topic = requestedTopic || 'The future of AI in Web Development';

        console.log(`🤖 Generating blog post about: ${topic}`);

        // 1. Generate content
        const { content, model } = await generateBlogPost({
            topic,
            context,
            includeCode: true,
            minWords: 800,
            maxWords: 1500,
        });

        // 2. Quality check
        const qualityCheck = checkContentQuality(content, 800);

        if (!qualityCheck.passed) {
            return NextResponse.json(
                {
                    error: 'Quality check failed',
                    issues: qualityCheck.issues,
                    score: qualityCheck.score
                },
                { status: 422 }
            );
        }

        // 3. Generate metadata
        const metadata = await generatePostMetadata(content, topic);
        if (!metadata) {
            return NextResponse.json({ error: 'Failed to generate metadata' }, { status: 500 });
        }

        const baseSlug = await generateSlug(metadata.title);
        let slug = baseSlug;

        // Check if slug exists
        const existing = await PostsDB.getBySlug(slug);
        if (existing) {
            slug = `${baseSlug}-${Date.now()}`;
        }

        const stats = readingTime(content);
        const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?title=${encodeURIComponent(metadata.title)}&tags=${encodeURIComponent((metadata.keywords || []).slice(0, 3).join(','))}`;

        // 4. Save to Database
        const postData = {
            slug,
            title: metadata.title,
            content,
            excerpt: metadata.excerpt,
            coverImage: ogImageUrl,

            author: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Shabih Haider',
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedAt: null, // Prisma expects Date | null
            status: 'draft', // Force draft for review

            metaDescription: metadata.metaDescription,
            metaKeywords: metadata.keywords || [],
            ogImage: ogImageUrl,

            tags: (metadata.keywords || []).slice(0, 5),
            category: 'Tech', // Simplified

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
            qualityScore: qualityCheck.score
        });

    } catch (error) {
        console.error('Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
