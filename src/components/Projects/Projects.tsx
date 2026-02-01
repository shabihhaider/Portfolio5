"use client";

import { motion } from "framer-motion";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectCard } from "./ProjectCard";

// Real projects data from GitHub - Top 3 showcase
const projects = [
    {
        title: "HydroPak Dashboard",
        description: "Full-stack SaaS admin panel for water bottle distribution management with real-time analytics, inventory tracking, and automated order processing.",
        techStack: ["Next.js", "Node.js", "PostgreSQL", "TailwindCSS"],
        githubUrl: "https://github.com/shabihhaider/waterbottle-admin",
        liveUrl: "https://hydropak.vercel.app/dashboard",
        demoCredentials: {
            email: "admin@hydropak.pk",
            password: "Admin@123",
        },
        size: "large" as const, // 2x2 HERO CARD - Top Left
        gradient: "from-cyan-500/10 to-blue-500/10",
    },
    {
        title: "Unified Social Insights",
        description: "Advanced social media analytics platform aggregating data from multiple platforms with AI-powered sentiment analysis and engagement metrics visualization.",
        techStack: ["TypeScript", "Python", "React", "Data Analytics"],
        githubUrl: "https://github.com/shabihhaider/unified-social-insights",
        size: "medium" as const, // Top Right
        gradient: "from-violet-500/10 to-fuchsia-500/10",
    },
    {
        title: "Online Research Platform",
        description: "Academic collaboration platform featuring peer review workflow, paper submissions, reviewer assignments, and administrative management for research journals.",
        techStack: ["Laravel", "PHP", "MySQL", "TailwindCSS"],
        githubUrl: "https://github.com/shabihhaider/Online-Research-Collaboration-Platform",
        size: "medium" as const, // Bottom Right
        gradient: "from-purple-500/10 to-pink-500/10",
    },
];

export function Projects() {
    return (
        <section id="work" className="relative py-12 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <span className="font-mono text-sm text-brand">{"// SELECTED_WORKS"}</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-brand/40 to-transparent" />
                        <span className="font-mono text-sm text-gray-600">[01]</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-heading font-bold">
                        The Alchemist&apos;s
                        <br />
                        <span className="text-gradient-animated">Lab</span>
                    </h2>
                </motion.div>

                {/* Featured Project */}
                <FeaturedProject />

                {/* Bento Grid - Other Projects */}
                <div className="mt-20">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-heading font-bold mb-12"
                    >
                        <span className="text-gray-400">More</span> Experiments
                    </motion.h3>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.title}
                                {...project}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
