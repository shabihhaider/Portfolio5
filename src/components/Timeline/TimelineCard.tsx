"use client";

import { motion } from "framer-motion";
import { TimelineEvent } from "@/data/timeline";

interface TimelineCardProps {
    event: TimelineEvent;
    index: number;
    isLeft?: boolean;
}

export function TimelineCard({ event, index, isLeft = false }: TimelineCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative ${isLeft ? 'text-right pr-12' : 'pl-12'}`}
        >
            {/* Glass Card */}
            <div className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand/30 transition-all duration-300">
                {/* Date & Hash */}
                <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-3 ${isLeft ? 'flex-row-reverse' : ''}`}>
                        <span className="text-2xl">{event.icon}</span>
                        <div className={isLeft ? 'text-right' : ''}>
                            <div className="text-sm font-mono text-brand">{event.date}</div>
                            <div className="text-xs font-mono text-gray-600">{event.commitHash}</div>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2 group-hover:text-brand transition-colors">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm md:text-base mb-4">
                    {event.description}
                </p>

                {/* Details */}
                <ul className={`space-y-2 mb-4 ${isLeft ? 'text-right' : ''}`}>
                    {event.details.map((detail, i) => (
                        <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                            {!isLeft && <span className="text-brand mt-0.5">›</span>}
                            <span className="flex-1">{detail}</span>
                            {isLeft && <span className="text-brand mt-0.5">‹</span>}
                        </li>
                    ))}
                </ul>

                {/* Tags */}
                <div className={`flex flex-wrap gap-2 ${isLeft ? 'justify-end' : ''}`}>
                    {event.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs font-mono rounded-full bg-brand/10 text-brand border border-brand/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Connector Line to Timeline */}
                <div
                    className={`absolute top-8 ${isLeft ? 'right-0' : 'left-0'} w-12 h-px bg-gradient-to-${isLeft ? 'l' : 'r'} from-brand/50 to-transparent`}
                />

                {/* Corner Accent */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-brand/0 group-hover:border-brand/30 rounded-tr-xl transition-all duration-500" />
            </div>
        </motion.div>
    );
}
