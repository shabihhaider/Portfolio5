import { PostsDB } from '@/lib/db/posts';
import BlogCard from '@/components/blog/BlogCard';
import EmailCapture from '@/components/EmailCapture';

// ✅ FIXED: Performance - Use ISR instead of force-dynamic
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
    const posts = await PostsDB.getPublishedPosts();

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[rgb(var(--brand))] selection:text-black">
            {/* Decorative Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[rgb(var(--brand))] opacity-[0.05] rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900 opacity-[0.05] rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                {/* Header */}
                <header className="mb-20 text-center max-w-3xl mx-auto">
                    <div className="inline-block mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-mono text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-[rgb(var(--brand))] animate-pulse"></span>
                            <span>SYSTEM_LOGS_V3.0</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                        Digital Lab <span className="text-[rgb(var(--brand))]">Notes</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Exploring the frontiers of Full Stack development, AI agents, and Cyberpunk interfaces.
                        Raw transmissions from the code mines.
                    </p>
                </header>

                {/* Featured/Latest Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {posts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}

                    {posts.length === 0 && (
                        <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <p className="text-gray-500 font-mono">NO_TRANSMISSIONS_FOUND</p>
                        </div>
                    )}
                </div>

                {/* Newsletter Section */}
                <div className="max-w-4xl mx-auto">
                    <EmailCapture />
                </div>
            </div>
        </div>
    );
}
