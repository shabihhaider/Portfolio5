
'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MousePointerClick } from 'lucide-react';

interface AnalyticsData {
    totalViews: number;
    totalLikes: number;
    ctaClicks: number;
    topPosts: Array<{
        title: string;
        slug: string;
        views: number;
        likes: number;
        ctaClicks: number;
    }>;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!data) return <div className="p-8 text-white">Error loading analytics</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 font-heading">Analytics Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Users size={24} />
                        </div>
                        <span className="text-gray-400 text-sm font-mono">TOTAL_VIEWS</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{data.totalViews.toLocaleString()}</div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-gray-400 text-sm font-mono">ENGAGEMENT (LIKES)</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{data.totalLikes.toLocaleString()}</div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-[rgb(var(--brand))]/10 rounded-lg text-[rgb(var(--brand))]">
                            <MousePointerClick size={24} />
                        </div>
                        <span className="text-gray-400 text-sm font-mono">CTA_CONVERSIONS</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{data.ctaClicks.toLocaleString()}</div>
                </div>
            </div>

            {/* Top Posts */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BarChart3 size={20} />
                        Top Performing Content
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-gray-400 text-xs font-mono uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Views</th>
                                <th className="px-6 py-4">Likes</th>
                                <th className="px-6 py-4">CTA Clicks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {data.topPosts.map((post) => (
                                <tr key={post.slug} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                                    <td className="px-6 py-4 text-gray-300">{post.views}</td>
                                    <td className="px-6 py-4 text-gray-300">{post.likes}</td>
                                    <td className="px-6 py-4 text-[rgb(var(--brand))] font-bold">{post.ctaClicks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
