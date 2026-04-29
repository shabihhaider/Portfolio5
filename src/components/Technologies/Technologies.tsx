"use client";

import { motion } from "framer-motion";
import { technologies, categoryLabels } from "@/data/technologies";

export function Technologies() {
    const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

    return (
        <section id="stack" className="relative py-20 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <span className="text-sm font-mono text-brand">TECH STACK</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                        Technologies We
                        <br />
                        <span className="text-gradient-animated">Work With</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                        {"// Modern tools for modern solutions"}
                    </p>
                </motion.div>

                {/* Technology Grid by Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category, catIndex) => {
                        const techs = technologies.filter(t => t.category === category);
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                                className="space-y-4"
                            >
                                <h3 className="text-sm font-mono text-brand border-b border-brand/20 pb-2">
                                    {categoryLabels[category]}
                                </h3>
                                <div className="space-y-3">
                                    {techs.map((tech) => {
                                        const Icon = tech.icon;
                                        return (
                                            <div
                                                key={tech.name}
                                                className="group flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-brand/20 transition-all duration-300"
                                            >
                                                <Icon className="w-5 h-5 text-gray-400 group-hover:text-brand transition-colors" />
                                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                                    {tech.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
