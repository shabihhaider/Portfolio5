"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/data/services";

interface ServiceCardProps {
    service: Service;
    index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const Icon = service.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className="group relative p-6 md:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-brand/30 transition-all duration-500 overflow-hidden"
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(204, 255, 0, 0.06), transparent 40%)`,
                }}
            />

            {/* Icon & Price */}
            <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient} border border-white/10`}>
                    <Icon className="w-6 h-6 text-brand" />
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono mb-1">starting at</div>
                    <div className="text-2xl font-bold text-brand">${service.priceRange.min.toLocaleString()}</div>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-3 group-hover:text-brand transition-colors">
                {service.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {service.description}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-500 flex items-start gap-2">
                        <span className="text-brand mt-0.5">›</span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
                {service.techStack.map((tech) => (
                    <span
                        key={tech}
                        className="px-3 py-1 text-xs font-mono rounded-full bg-brand/10 text-brand border border-brand/20"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-mono text-gray-500">{service.deliveryTime}</span>
                <Link
                    href="#contact"
                    className="group/cta flex items-center gap-2 text-sm font-semibold text-brand hover:text-white transition-colors"
                >
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-brand/0 group-hover:border-brand/30 rounded-tr-xl transition-all duration-500" />
        </motion.div>
    );
}
