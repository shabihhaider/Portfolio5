import Link from 'next/link';
import { BlogPost } from '@/lib/db/schema';

export default function BlogCard({ post }: { post: BlogPost }) {
    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : 'Draft';

    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <article className="relative h-full flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:-translate-y-0.5">
                {/* Top accent line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgb(var(--brand))]/0 to-transparent group-hover:via-[rgb(var(--brand))]/40 transition-all duration-500" />

                <div className="p-6 flex flex-col flex-1">
                    {/* Meta row */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500 mb-4">
                        {post.category && (
                            <>
                                <span className="text-[rgb(var(--brand))]/70 uppercase tracking-widest">
                                    {post.category}
                                </span>
                                <span className="text-gray-700">·</span>
                            </>
                        )}
                        <span>{formattedDate}</span>
                        {post.readingTime && (
                            <>
                                <span className="text-gray-700">·</span>
                                <span>{post.readingTime}</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold font-heading text-white leading-snug mb-3 group-hover:text-[rgb(var(--brand))] transition-colors duration-200 line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-gray-500 tracking-wide"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="px-6 py-3.5 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gray-600 group-hover:text-gray-400 transition-colors">
                        Read more
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-600 transform group-hover:translate-x-1 group-hover:text-[rgb(var(--brand))] transition-all duration-200">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                </div>
            </article>
        </Link>
    );
}
