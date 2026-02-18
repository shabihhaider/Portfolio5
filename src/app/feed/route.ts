import { PostsDB } from '@/lib/db/posts';
import { site, blog } from '@/lib/config/site';

export async function GET() {
  const baseUrl = site.url;
  const posts = await PostsDB.getPublishedPosts();

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blog.rssTitle}</title>
    <link>${baseUrl}</link>
    <description>${blog.rssDescription}</description>
    <language>${site.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
