"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/data/process";
import { ProcessStep } from "./ProcessStep";

export function Process() {
    return (
        <section id="process" className="relative py-20 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
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
                        <span className="text-sm font-mono text-brand">HOW IT WORKS</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                        Our
                        <br />
                        <span className="text-gradient-animated">Process</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                        {"// A clear, structured workflow for every project"}
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {processSteps.map((step, index) => (
                        <ProcessStep
                            key={step.id}
                            step={step}
                            index={index}
                            isLast={index === processSteps.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
