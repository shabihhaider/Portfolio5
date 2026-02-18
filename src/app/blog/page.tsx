import { PostsDB } from '@/lib/db/posts';
import BlogCard from '@/components/blog/BlogCard';
import EmailCapture from '@/components/EmailCapture';
import { blog, author } from '@/lib/config/site';
import Link from 'next/link';

// Next.js requires segment config to be a static literal
export const revalidate = 3600;

export default async function BlogPage() {
    let posts: Awaited<ReturnType<typeof PostsDB.getPublishedPosts>> = [];
    try {
        posts = await PostsDB.getPublishedPosts();
    } catch (e) {
        console.error('Failed to fetch posts:', e);
    }
    const [featured, ...rest] = posts;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[rgb(var(--brand))] selection:text-black">
            {/* Ambient background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[rgb(var(--brand))] opacity-[0.04] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-purple-600 opacity-[0.03] rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
                {/* ── Header ───────────────────────────────── */}
                <header className="mb-20 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-500 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--brand))] animate-pulse" />
                        Blog
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold font-heading tracking-tight mb-5">
                        {blog.title.split('&')[0].trim()} &{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--brand))] to-emerald-400">
                            {blog.title.split('&')[1]?.trim() || 'Deep Dives'}
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        {blog.description}
                    </p>
                </header>

                {/* ── Featured Post ─────────────────────────── */}
                {featured && (
                    <section className="mb-16">
                        <Link href={`/blog/${featured.slug}`} className="group block">
                            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12 overflow-hidden transition-all duration-300 hover:border-[rgb(var(--brand))]/30 hover:bg-white/[0.05]">
                                {/* Glow */}
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[rgb(var(--brand))] opacity-[0.05] rounded-full blur-[100px] group-hover:opacity-[0.08] transition-opacity" />

                                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2.5 py-1 bg-[rgb(var(--brand))]/10 border border-[rgb(var(--brand))]/20 rounded-full text-[11px] font-mono text-[rgb(var(--brand))] uppercase tracking-widest">
                                                {blog.featuredBadge}
                                            </span>
                                            {featured.category && (
                                                <span className="text-xs text-gray-500 font-mono">{featured.category}</span>
                                            )}
                                            {featured.readingTime && (
                                                <span className="text-xs text-gray-600 font-mono">{featured.readingTime}</span>
                                            )}
                                        </div>

                                        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-4 group-hover:text-[rgb(var(--brand))] transition-colors leading-tight">
                                            {featured.title}
                                        </h2>

                                        <p className="text-gray-400 leading-relaxed mb-6 max-w-xl line-clamp-3 text-[15px]">
                                            {featured.excerpt}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(var(--brand))]/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold font-mono">
                                                {author.initials}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {featured.publishedAt
                                                    ? new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : 'Draft'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 group-hover:bg-[rgb(var(--brand))]/10 group-hover:border-[rgb(var(--brand))]/30 transition-all shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-[rgb(var(--brand))] group-hover:translate-x-0.5 transition-all">
                                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

                {/* ── Post Grid ─────────────────────────────── */}
                {rest.length > 0 && (
                    <section className="mb-24">
                        <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-8">
                            All Posts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {rest.map((post) => (
                                <BlogCard key={post.slug} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Empty State ───────────────────────────── */}
                {posts.length === 0 && (
                    <div className="text-center py-32">
                        <div className="text-6xl mb-4 opacity-20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto text-gray-600">
                                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg mb-2">{blog.emptyTitle}</p>
                        <p className="text-gray-600 text-sm">{blog.emptyDescription}</p>
                    </div>
                )}

                {/* ── Newsletter ────────────────────────────── */}
                <div className="max-w-2xl mx-auto">
                    <EmailCapture />
                </div>
            </div>
        </div>
    );
}
