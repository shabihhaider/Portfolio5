import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/db/schema';
import { formatDate } from '@/lib/utils';

interface BlogPostLayoutProps {
    post: BlogPost;
    children: React.ReactNode;
}

export default function BlogPostLayout({ post, children }: BlogPostLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation (Simplified) */}
            <nav className="border-b border-gray-800 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        {post.author}
                    </Link>
                    <Link href="/blog" className="text-gray-400 hover:text-white transition">
                        ← Back to Blog
                    </Link>
                </div>
            </nav>

            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <header className="mb-12 text-center">
                    <div className="flex gap-2 justify-center mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm border border-cyan-500/20">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                        <time dateTime={post.publishedAt?.toString()}>
                            {formatDate(post.publishedAt || post.createdAt)}
                        </time>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                    </div>
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden border border-gray-800">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-cyan-100 prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
                    {children}
                </div>

                {/* Footer / Author */}
                <footer className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-400">
                            Written by <span className="text-white font-medium">{post.author}</span>
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    );
}
