import { Post, Subscriber, Analytics } from '@prisma/client';

export type BlogPost = Post;
export type EmailSubscriber = Subscriber;
export type AnalyticsEvent = Analytics;

export interface SiteSettings {
    id?: string;
    autoPublish: boolean;
    postingSchedule: 'daily' | 'weekly' | 'biweekly';
    contentTopics: string[];
    aiTone: string;
    includeCodeExamples: boolean;
    minWordCount: number;
    maxWordCount: number;
}
