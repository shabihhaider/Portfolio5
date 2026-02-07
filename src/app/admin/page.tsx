import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/admin';
import { PostsDB } from '@/lib/db/posts';
import AdminStats from '@/components/admin/AdminStats';
import PostsList from '@/components/admin/PostsList';
import { Sparkles, BarChart3, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        redirect('/admin/login');
    }

    const [publishedPosts, drafts, scheduled] = await Promise.all([
        PostsDB.getPublishedPosts(),
        PostsDB.getDrafts(),
        PostsDB.getScheduledPosts(),
    ]);

    const allPosts = [...drafts, ...scheduled, ...publishedPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalViews = publishedPosts.reduce((sum, p) => sum + p.views, 0);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-8 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgb(var(--brand))] opacity-[0.03] rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 font-heading tracking-tight flex items-center gap-2">
                            <span className="w-2 h-8 bg-[rgb(var(--brand))] rounded-full display-block"></span>
                            Mission Control
                        </h1>
                        <p className="text-gray-400 ml-4 font-mono text-sm">System Status: <span className="text-[rgb(var(--brand))]">ONLINE</span></p>
                    </div>
                    <div className="flex gap-3">
                        {/* Logout button placeholder - would be nice to have a real logout here */}
                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-gray-400">
                            ADMIN_SESSION_ACTIVE
                        </div>
                    </div>
                </header>

                <AdminStats
                    published={publishedPosts.length}
                    drafts={drafts.length}
                    scheduled={scheduled.length}
                    totalViews={totalViews}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    <div className="lg:col-span-2">
                        <PostsList posts={allPosts} />
                    </div>

                    <div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-8">
                            <h3 className="text-xl font-bold mb-6 font-heading flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[rgb(var(--brand))]">
                                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                                </svg>
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                {/* Generate Post Button - triggers generation */}
                                <form action="/api/generate" method="POST">
                                    <button type="submit" className="w-full px-4 py-4 bg-[rgb(var(--brand))] hover:opacity-90 text-black rounded-lg font-bold transition-all transform hover:scale-[1.02] text-left flex items-center gap-3 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="font-mono text-sm uppercase tracking-wide">Generate New Post (AI)</span>
                                    </button>
                                </form>

                                {/* Analytics Link */}
                                <a href="/admin/analytics" className="w-full px-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition text-left flex items-center gap-3 text-white group block">
                                    <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                    <span className="font-mono text-sm uppercase tracking-wide text-gray-300 group-hover:text-white">View Analytics</span>
                                </a>

                                {/* Settings Link */}
                                <a href="/admin/settings" className="w-full px-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition text-left flex items-center gap-3 text-white group block">
                                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors group-hover:rotate-90 transition-transform duration-500" />
                                    <span className="font-mono text-sm uppercase tracking-wide text-gray-300 group-hover:text-white">System Settings</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
