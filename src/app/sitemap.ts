import { MetadataRoute } from 'next';
import { PostsDB } from '@/lib/db/posts';
import { site } from '@/lib/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = site.url;

    // Get all published posts
    const posts = await PostsDB.getPublishedPosts();

    // Base routes (only pages that actually exist)
    const routes = [
        '',
        '/blog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Blog post routes
    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...postRoutes];
}
