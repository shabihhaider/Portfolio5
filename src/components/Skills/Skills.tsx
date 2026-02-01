"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ElementCard } from "./ElementCard";
import { skills } from "@/data/skills";

type CategoryFilter = 'all' | 'frontend' | 'backend' | 'ai' | 'tools';

export function Skills() {
    const [filter, setFilter] = useState<CategoryFilter>('all');

    const filteredSkills = filter === 'all'
        ? skills
        : skills.filter(skill => skill.category === filter);

    const filters: { label: string; value: CategoryFilter; color: string }[] = [
        { label: "All Elements", value: "all", color: "brand" },
        { label: "Frontend", value: "frontend", color: "green-400" },
        { label: "Backend", value: "backend", color: "blue-400" },
        { label: "AI/ML", value: "ai", color: "purple-400" },
        { label: "Tools", value: "tools", color: "cyan-400" },
    ];

    return (
        <section id="skills" className="relative py-20 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <span className="text-sm font-mono text-brand">ELEMENTAL MASTERY</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                        The Periodic Table
                        <br />
                        <span className="text-gradient-animated">of Dev</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                        {"// Hover over an element to analyze its properties"}
                    </p>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {filters.map((filterOption) => (
                        <button
                            key={filterOption.value}
                            onClick={() => setFilter(filterOption.value)}
                            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${filter === filterOption.value
                                ? `bg-${filterOption.color}/20 text-${filterOption.color} border border-${filterOption.color}/40 shadow-[0_0_20px_rgba(204,255,0,0.2)]`
                                : "bg-white/5 text-gray-400 border border-white/10 hover:border-brand/30"
                                }`}
                        >
                            {filterOption.label}
                        </button>
                    ))}
                </motion.div>

                {/* Elements Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    {filteredSkills.map((skill, index) => (
                        <ElementCard key={skill.id} skill={skill} index={index} />
                    ))}
                </motion.div>

                {/* Lab Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm font-mono text-gray-600">
                        <span className="text-brand">⚗️</span> Synthesized through years of experimentation in the digital laboratory
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
