import Link from 'next/link';
import { BlogPost } from '@/lib/db/schema';

export default function BlogCard({ post }: { post: BlogPost }) {
    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
        : 'Draft';

    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:bg-white/10 group-hover:border-[rgb(var(--brand))]/50 group-hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] group-hover:-translate-y-1 flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] uppercase tracking-wider font-mono text-[rgb(var(--brand))]"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[rgb(var(--brand))] transition-colors font-heading leading-tight">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                    {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono mt-auto pt-4 border-t border-white/5">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--brand))]"></span>
                        {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                        READ_TRANSMISSION
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 transform group-hover:translate-x-1 transition-transform">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
