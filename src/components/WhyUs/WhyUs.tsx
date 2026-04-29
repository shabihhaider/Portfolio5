"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { whyUsItems } from "@/data/whyus";

export function WhyUs() {
    return (
        <section id="why-us" className="relative py-20 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
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
                        <span className="text-sm font-mono text-brand">WHY CHOOSE US</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                        Why Work
                        <br />
                        <span className="text-gradient-animated">With Us</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                        {"// What you get when you work with Shabih."}
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {whyUsItems.map((item, index) => (
                        <WhyUsCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhyUsCard({ item, index }: { item: typeof whyUsItems[number]; index: number }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-brand/30 hover:bg-white/10 transition-all duration-300 overflow-hidden"
        >
            {/* Spotlight */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(204, 255, 0, 0.06), transparent 40%)`,
                }}
            />

            <div className="relative">
                <div className="p-3 rounded-xl bg-brand/10 border border-brand/20 w-fit mb-4">
                    <Icon className="w-6 h-6 text-brand" />
                </div>

                <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-brand transition-colors">
                    {item.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                </p>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-brand/0 group-hover:border-brand/30 rounded-tr-xl transition-all duration-500" />
        </motion.div>
    );
}
