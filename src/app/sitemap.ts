import { MetadataRoute } from 'next';
import { PostsDB } from '@/lib/db/posts';
import { site } from '@/lib/config/site';
import { caseStudies } from '@/data/case-studies';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = site.url;

    // Get all published posts
    const posts = await PostsDB.getPublishedPosts();

    // Base routes
    const routes = [
        { route: '', priority: 1.0, freq: 'weekly' as const },
        { route: '/work', priority: 0.9, freq: 'weekly' as const },
        { route: '/blog', priority: 0.8, freq: 'weekly' as const },
    ].map(({ route, priority, freq }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
    }));

    // Case study pages — high priority, these convert leads
    const caseStudyRoutes = caseStudies.map((study) => ({
        url: `${baseUrl}/work/${study.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    // Blog post routes
    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...caseStudyRoutes, ...postRoutes];
}
