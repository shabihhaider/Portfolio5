"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectCard } from "./ProjectCard";

const projects = [
    {
        title: "HydroPak Dashboard",
        description: "Admin panel for a water bottle distribution business. Manages inventory, tracks orders, and visualizes sales analytics — built to replace a manual spreadsheet workflow.",
        liveUrl: "https://hydropak.vercel.app/dashboard",
        demoCredentials: {
            email: "admin@hydropak.pk",
            password: "Admin@123",
        },
        size: "medium" as const,
        gradient: "from-cyan-500/10 to-blue-500/10",
        comingSoon: false,
    },
    {
        title: "SnapInvoice",
        description: "Cross-platform invoice management for freelancers and small businesses.",
        liveUrl: undefined,
        demoCredentials: undefined,
        size: "medium" as const,
        gradient: "from-rose-500/10 to-pink-500/10",
        comingSoon: true,
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
                        <span className="font-mono text-sm text-brand">{"// PORTFOLIO"}</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-brand/40 to-transparent" />
                        <span className="font-mono text-sm text-gray-600">[01]</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-heading font-bold">
                        Our
                        <br />
                        <span className="text-gradient-animated">Work</span>
                    </h2>
                </motion.div>

                {/* Featured Project */}
                <FeaturedProject />

                {/* Additional Projects */}
                {projects.length > 0 && (
                    <div className="mt-20">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-heading font-bold mb-12"
                        >
                            <span className="text-gray-400">More</span> Projects
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.title}
                                    {...project}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* View All Work */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 flex justify-center"
                >
                    <Link
                        href="/work"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-sm font-mono text-gray-400 hover:text-brand hover:border-brand/30 hover:bg-brand/5 transition-all"
                    >
                        View All Case Studies <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
