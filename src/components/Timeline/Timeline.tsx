"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TimelineCard } from "./TimelineCard";
import { timelineEvents } from "@/data/timeline";

export function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section id="timeline" className="relative py-20 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div ref={containerRef} className="relative max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <span className="text-sm font-mono text-brand">SYSTEM LOGS</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                        The Evolution
                        <br />
                        <span className="text-gradient-animated">Timeline</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                        {"// Tracking the journey from first commit to production"}
                    </p>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Central Timeline Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
                        {/* Background Line */}
                        <div className="absolute inset-0 bg-white/10" />

                        {/* Animated Fill Line */}
                        <motion.div
                            style={{ height: lineHeight }}
                            className="absolute top-0 left-0 right-0 bg-brand origin-top"
                        />
                    </div>

                    {/* Timeline Events */}
                    <div className="space-y-16">
                        {timelineEvents.map((event, index) => (
                            <div key={event.id} className="relative">
                                {/* Commit Dot */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="absolute left-1/2 top-8 -translate-x-1/2 z-10"
                                >
                                    <div className="relative">
                                        {/* Outer Glow Ring */}
                                        <div className="absolute inset-0 w-6 h-6 rounded-full bg-brand/20 animate-ping" />

                                        {/* Main Dot */}
                                        <div className="relative w-6 h-6 rounded-full border-4 border-background bg-brand shadow-[0_0_20px_rgba(204,255,0,0.6)]">
                                            {/* Inner Shine */}
                                            <div className="absolute inset-1 rounded-full bg-white/30" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Event Card (Alternating Sides) */}
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16`}>
                                    {index % 2 === 0 ? (
                                        <>
                                            <TimelineCard event={event} index={index} isLeft={true} />
                                            <div /> {/* Empty space */}
                                        </>
                                    ) : (
                                        <>
                                            <div /> {/* Empty space */}
                                            <TimelineCard event={event} index={index} isLeft={false} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Terminal Arrow at Bottom */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative mt-12 flex justify-center"
                    >
                        <div className="text-brand text-2xl animate-bounce">▼</div>
                    </motion.div>
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-sm font-mono text-gray-600">
                        <span className="text-brand">git log --oneline --graph</span> {"// The journey continues..."}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
