import { MetadataRoute } from 'next';
import { site } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/private/', '/admin/'],
            },
            // Block AI training crawlers
            {
                userAgent: 'GPTBot',
                disallow: ['/'],
            },
            {
                userAgent: 'anthropic-ai',
                disallow: ['/'],
            },
            {
                userAgent: 'CCBot',
                disallow: ['/'],
            },
        ],
        sitemap: `${site.url}/sitemap.xml`,
    };
}
