import { PostsDB } from '@/lib/db/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import CTASection from '@/components/blog/CTASection';
import ReadingProgress from '@/components/blog/ReadingProgress';
import CodeBlock from '@/components/blog/CodeBlock';
import Callout from '@/components/blog/Callout';
import { sanitizeContent } from '@/lib/ai/sanitize';
import { author, blog } from '@/lib/config/site';
import { Metadata } from 'next';
import Link from 'next/link';

// Map every JSX component the AI might emit
const mdxComponents = {
    pre: CodeBlock,
    Callout,
    Note: Callout,
    Tip: (props: React.ComponentProps<typeof Callout>) => <Callout type="tip" {...props} />,
    Warning: (props: React.ComponentProps<typeof Callout>) => <Callout type="warning" {...props} />,
    Info: (props: React.ComponentProps<typeof Callout>) => <Callout type="info" {...props} />,
    Danger: (props: React.ComponentProps<typeof Callout>) => <Callout type="danger" {...props} />,
};

// Next.js requires segment config to be a static literal
export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await PostsDB.getBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: post.title,
        description: post.excerpt || undefined,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            type: 'article',
            publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
            tags: post.tags,
            images: [
                {
                    url: `/api/og?title=${encodeURIComponent(post.title)}&tags=${post.tags.join(',')}`,
                    width: 1200,
                    height: 630,
                },
            ],
        },
    };
}

/**
 * Clean AI-generated content so MDX can render it properly.
 * Uses the shared sanitizer + a final pass for any remaining unknown JSX.
 */
function cleanContent(raw: string): string {
    // Run the shared sanitizer (strips UI artifacts, fixes code blocks, etc.)
    let content = sanitizeContent(raw);

    // Extra safety: strip any remaining unknown JSX for the MDX renderer
    const known = Object.keys(mdxComponents).join('|');
    const unknownSelfClosing = new RegExp(`<(?!(?:${known}|[a-z]))[A-Z]\\w*\\b[^>]*/>`, 'g');
    content = content.replace(unknownSelfClosing, '');

    const unknownBlock = new RegExp(
        `<(?!(?:${known}|[a-z]))[A-Z](\\w*)\\b[^>]*>([\\s\\S]*?)</[A-Z]\\1>`,
        'g',
    );
    content = content.replace(unknownBlock, (_m, _tag, inner) =>
        inner
            .trim()
            .split('\n')
            .map((l: string) => `> ${l}`)
            .join('\n'),
    );

    return content;
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await PostsDB.getBySlug(slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-8xl font-bold font-heading text-white/5 mb-4">404</div>
                    <p className="text-gray-400 font-mono mb-8">This post doesn&apos;t exist or has been removed.</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                        </svg>
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const cleanedContent = cleanContent(post.content);
    const publishDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[rgb(var(--brand))] selection:text-black">
            <ReadingProgress />

            {/* Ambient background glow */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[rgb(var(--brand))] opacity-[0.03] rounded-full blur-[150px]" />
            </div>

            {/* Back nav */}
            <nav className="relative z-10 max-w-4xl mx-auto px-6 pt-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    All Posts
                </Link>
            </nav>

            <article className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">
                {/* ── Header ─────────────────────────────────── */}
                <header className="mb-16">
                    {/* Category & Reading Time */}
                    <div className="flex items-center gap-3 mb-6">
                        {post.category && (
                            <span className="px-3 py-1 bg-[rgb(var(--brand))]/10 border border-[rgb(var(--brand))]/20 rounded-full text-xs font-mono text-[rgb(var(--brand))] uppercase tracking-widest">
                                {post.category}
                            </span>
                        )}
                        {post.readingTime && (
                            <span className="text-xs text-gray-500 font-mono">{post.readingTime}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-[1.1] tracking-tight mb-8">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-3xl">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author & Date */}
                    <div className="flex items-center gap-4 pb-8 border-b border-white/10">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[rgb(var(--brand))]/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-sm font-bold font-mono">
                            {author.initials}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-white">{post.author}</div>
                            <div className="text-xs text-gray-500 font-mono">{publishDate}</div>
                        </div>

                        {/* Tags */}
                        <div className="ml-auto hidden sm:flex flex-wrap gap-2">
                            {post.tags.slice(0, 4).map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 text-[11px] font-mono text-gray-400 bg-white/5 border border-white/5 rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                {/* ── Article Body ───────────────────────────── */}
                <div className="prose prose-lg prose-invert max-w-none
                    prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mt-16 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
                    prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-gray-100
                    prose-p:text-gray-300 prose-p:leading-[1.8] prose-p:text-[17px]
                    prose-a:text-[rgb(var(--brand))] prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-code:text-[rgb(var(--brand))] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[15px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-transparent prose-pre:border-0 prose-pre:rounded-none prose-pre:shadow-none prose-pre:my-0 prose-pre:p-0
                    prose-ul:my-6 prose-ul:pl-0 prose-li:text-gray-300 prose-li:pl-2 prose-li:marker:text-[rgb(var(--brand))]
                    prose-ol:my-6 prose-ol:pl-0 prose-ol:marker:text-[rgb(var(--brand))]
                    prose-blockquote:border-l-2 prose-blockquote:border-[rgb(var(--brand))]/50 prose-blockquote:bg-white/[0.02] prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-300
                    prose-img:rounded-xl prose-img:border prose-img:border-white/10
                    prose-hr:border-white/10 prose-hr:my-12
                ">
                    <MDXRemote
                        source={cleanedContent}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [rehypeHighlight],
                            },
                        }}
                        components={mdxComponents}
                    />
                </div>

                {/* ── Tags (mobile) ──────────────────────────── */}
                <div className="flex sm:hidden flex-wrap gap-2 mt-12 pt-8 border-t border-white/10">
                    {post.tags.map((tag: string) => (
                        <span
                            key={tag}
                            className="px-3 py-1.5 text-xs font-mono text-gray-400 bg-white/5 border border-white/5 rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* ── Share & CTA ─────────────────────────────── */}
                <div className="mt-16 pt-12 border-t border-white/10">
                    <CTASection postSlug={post.slug} />
                </div>

                {/* ── More posts link ────────────────────────── */}
                <div className="mt-12 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                        </svg>
                        View All Posts
                    </Link>
                </div>
            </article>
        </div>
    );
}
