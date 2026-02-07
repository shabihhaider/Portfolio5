import { ObjectId } from 'mongodb';

export interface BlogPost {
    _id?: ObjectId;
    slug: string;
    title: string;
    content: string; // MDX content
    excerpt: string;
    coverImage: string;

    // Metadata
    author: string;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'scheduled' | 'published';
    scheduledFor?: Date;

    // SEO
    metaDescription: string;
    metaKeywords: string[];
    ogImage?: string;

    // Categorization
    tags: string[];
    category: string;

    // Engagement
    views: number;
    likes: number;
    readingTime: string;

    // AI Metadata
    generatedBy: string; // 'groq-llama3', 'human', etc.
    humanEdited: boolean;
    qualityScore: number; // 0-10

    // Monetization
    affiliateLinks?: Array<{
        product: string;
        url: string;
        clicked: number;
    }>;
    ctaClicks: number;
}

export interface EmailSubscriber {
    _id?: ObjectId;
    email: string;
    name?: string;
    subscribedAt: Date;
    source: string; // which blog post they came from
    tags: string[]; // interests
    active: boolean;
}

export interface Analytics {
    _id?: ObjectId;
    postSlug: string;
    date: Date;
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    bounceRate: number;
    referrers: Record<string, number>;
}

export interface SiteSettings {
    _id?: ObjectId;
    autoPublish: boolean;
    postingSchedule: 'daily' | 'weekly' | 'biweekly';
    contentTopics: string[];
    aiTone: string;
    includeCodeExamples: boolean;
    minWordCount: number;
    maxWordCount: number;
}
