import { PostsDB } from '@/lib/db/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import CTASection from '@/components/blog/CTASection';
import { Metadata } from 'next';
import '@/app/globals.css';
import Link from 'next/link';

// Tailwind Typography Prose Config (Inline for validation)
const prosemagnify = `
  prose prose-invert max-w-none
  prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight
  prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:text-white
  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-white prose-h2:border-l-4 prose-h2:border-[rgb(var(--brand))] prose-h2:pl-4
  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-100
  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
  prose-a:text-[rgb(var(--brand))] prose-a:no-underline prose-a:border-b prose-a:border-[rgb(var(--brand))]/30 hover:prose-a:border-[rgb(var(--brand))] prose-a:transition-all
  prose-code:text-[rgb(var(--brand))] prose-code:bg-[rgb(var(--brand))]/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
  prose-strong:text-white prose-strong:font-bold
  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:text-gray-300 prose-li:mb-2
  prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
  prose-blockquote:border-l-4 prose-blockquote:border-[rgb(var(--brand))] prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
`;

// ✅ FIXED: Performance - Use ISR
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

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await PostsDB.getBySlug(slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 font-heading">404</h1>
                    <p className="text-gray-400 font-mono">TRANSMISSION_NOT_FOUND</p>
                    <Link href="/blog" className="mt-8 inline-block text-[rgb(var(--brand))] hover:underline font-mono">RETURN_TO_BASE</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Progress Bar (Simulated) */}
            <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
                <div className="h-full bg-[rgb(var(--brand))] w-full origin-left animate-[grow_1s_ease-out]" style={{ width: '100%' }}></div>
            </div>

            <article className="max-w-4xl mx-auto px-6 py-20">
                {/* Header */}
                <header className="mb-16 text-center border-b border-white/10 pb-16">
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {post.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[rgb(var(--brand))] uppercase tracking-wider">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-8 font-heading leading-tight tracking-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-sm font-mono text-gray-400 mb-12">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center text-xs">SH</span>
                            <span>Shabih Haider</span>
                        </div>
                        <span>•</span>
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                    </div>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                                src={post.coverImage.startsWith('http') || post.coverImage.startsWith('/') ? post.coverImage : '/placeholder.jpg'}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className={prosemagnify}>
                    <MDXRemote
                        source={post.content}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [rehypeHighlight],
                            },
                        }}
                    />
                </div>

                {/* Footer */}
                <div className="mt-20 pt-10 border-t border-white/10">
                    <CTASection postSlug={post.slug} />
                </div>
            </article>
        </div>
    );
}
