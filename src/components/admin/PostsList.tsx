'use client';

import { BlogPost } from '@/lib/db/schema';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function ActionButton({
    onClick,
    label,
    loadingLabel,
    className,
    confirm: confirmMsg,
}: {
    onClick: () => Promise<void>;
    label: string;
    loadingLabel?: string;
    className: string;
    confirm?: string;
}) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (confirmMsg && !confirm(confirmMsg)) return;
        setLoading(true);
        try {
            await onClick();
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`text-sm font-bold font-mono border-b border-transparent transition-all pb-0.5 disabled:opacity-50 ${className}`}
        >
            {loading ? (loadingLabel || '...') : label}
        </button>
    );
}

function ApproveButton({ slug }: { slug: string }) {
    const router = useRouter();

    return (
        <ActionButton
            label="APPROVE"
            className="text-gray-400 hover:text-blue-400 hover:border-blue-400"
            confirm="Approve this post for publishing?"
            onClick={async () => {
                const res = await fetch(`/api/posts/${slug}/approve`, { method: 'POST' });
                if (res.ok) router.refresh();
                else alert('Failed to approve');
            }}
        />
    );
}

function RejectButton({ slug }: { slug: string }) {
    const router = useRouter();

    return (
        <ActionButton
            label="REJECT"
            className="text-gray-500 hover:text-red-400 hover:border-red-400"
            confirm="Reject this post?"
            onClick={async () => {
                const res = await fetch(`/api/posts/${slug}/reject`, { method: 'POST' });
                if (res.ok) router.refresh();
                else alert('Failed to reject');
            }}
        />
    );
}

function RegenerateButton({ slug }: { slug: string }) {
    const router = useRouter();

    return (
        <ActionButton
            label="REGEN"
            loadingLabel="GENERATING..."
            className="text-gray-400 hover:text-purple-400 hover:border-purple-400"
            confirm="Reject this post and generate a fresh replacement?"
            onClick={async () => {
                const res = await fetch(`/api/posts/${slug}/regenerate`, { method: 'POST' });
                if (res.ok) router.refresh();
                else alert('Failed to regenerate');
            }}
        />
    );
}

function PublishButton({ slug }: { slug: string }) {
    const router = useRouter();

    return (
        <ActionButton
            label="PUBLISH"
            className="text-gray-400 hover:text-green-400 hover:border-green-400"
            confirm="Are you sure you want to publish this post?"
            onClick={async () => {
                const res = await fetch('/api/posts/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug }),
                });
                if (res.ok) router.refresh();
                else alert('Failed to publish');
            }}
        />
    );
}

function DeleteButton({ slug }: { slug: string }) {
    const router = useRouter();

    return (
        <ActionButton
            label="DELETE"
            className="text-gray-500 hover:text-red-500 hover:border-red-500"
            confirm="💥 Are you sure? This cannot be undone."
            onClick={async () => {
                const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
                if (res.ok) router.refresh();
                else {
                    const data = await res.json().catch(() => ({}));
                    alert(`Failed to delete: ${data.error || 'Unknown error'}`);
                }
            }}
        />
    );
}

const STATUS_STYLES: Record<string, string> = {
    published: 'bg-green-500/10 text-green-400 border border-green-500/20',
    approved: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    scheduled: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    draft: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

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
                                        className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${STATUS_STYLES[post.status] || STATUS_STYLES.draft}`}
                                    >
                                        {post.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                                    {post.status === 'scheduled' && post.publishedAt
                                        ? new Date(post.publishedAt).toLocaleDateString()
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
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="text-[rgb(var(--brand))] hover:text-white text-sm font-bold font-mono border-b border-[rgb(var(--brand))] hover:border-white transition-all pb-0.5"
                                        >
                                            VIEW
                                        </Link>

                                        {/* Draft: approve, reject, regenerate, publish, delete */}
                                        {post.status === 'draft' && (
                                            <>
                                                <ApproveButton slug={post.slug} />
                                                <RejectButton slug={post.slug} />
                                                <RegenerateButton slug={post.slug} />
                                                <PublishButton slug={post.slug} />
                                            </>
                                        )}

                                        {/* Approved/Scheduled: publish now or reject */}
                                        {(post.status === 'approved' || post.status === 'scheduled') && (
                                            <>
                                                <PublishButton slug={post.slug} />
                                                <RejectButton slug={post.slug} />
                                            </>
                                        )}

                                        {/* Rejected: regenerate or delete */}
                                        {post.status === 'rejected' && (
                                            <RegenerateButton slug={post.slug} />
                                        )}

                                        <DeleteButton slug={post.slug} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
