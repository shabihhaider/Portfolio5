'use client';

import { BlogPost } from '@/lib/db/schema';
import Link from 'next/link';

export default function PostsList({ posts }: { posts: BlogPost[] }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white font-heading">Recent Transmissions</h3>
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-[rgb(var(--brand))] animate-pulse"></span>
                    <span className="text-xs font-mono text-gray-400">LIVE FEED</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-black/50 text-gray-400 text-xs font-mono uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Stats</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.slug} className="hover:bg-white/5 transition group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white group-hover:text-[rgb(var(--brand))] transition-colors">{post.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs font-mono">
                                        /{post.slug}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${post.status === 'published'
                                            ? 'bg-[rgb(var(--brand))]/10 text-[rgb(var(--brand))] border border-[rgb(var(--brand))]/20'
                                            : post.status === 'scheduled'
                                                ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}
                                    >
                                        {post.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                                    {post.status === 'scheduled' && post.scheduledFor
                                        ? new Date(post.scheduledFor).toLocaleDateString()
                                        : new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        {post.views}
                                    </div>
                                    <div className="text-xs opacity-50">Score: {post.qualityScore}/10</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        target="_blank"
                                        className="text-[rgb(var(--brand))] hover:text-white text-sm font-bold font-mono border-b border-[rgb(var(--brand))] hover:border-white transition-all pb-0.5"
                                    >
                                        VIEW_POST
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
