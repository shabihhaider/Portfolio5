"use client";

import { motion } from "framer-motion";
import type { ProcessStep as ProcessStepType } from "@/data/process";

interface ProcessStepProps {
    step: ProcessStepType;
    index: number;
}

export function ProcessStep({ step, index }: ProcessStepProps) {
    const Icon = step.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative flex-1"
        >

            <div className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand/30 transition-all duration-300">
                {/* Step Number & Icon */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-shrink-0 w-16 h-16 rounded-full border-2 border-brand/30 bg-brand/10 flex items-center justify-center group-hover:border-brand group-hover:bg-brand/20 transition-all duration-300">
                        <Icon className="w-6 h-6 text-brand" />
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand text-black text-xs font-bold flex items-center justify-center">
                            {step.id}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-heading font-bold text-white group-hover:text-brand transition-colors">
                            {step.title}
                        </h3>
                        <span className="text-xs font-mono text-gray-500">{step.duration}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {step.description}
                </p>

                {/* Details */}
                <ul className="space-y-1.5">
                    {step.details.map((detail) => (
                        <li key={detail} className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="text-brand">›</span>
                            {detail}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
