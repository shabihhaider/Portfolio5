"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { useState, useRef } from "react";
import { DemoCredentials } from "./DemoCredentials";

interface ProjectCardProps {
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
    size?: "small" | "medium" | "large" | "wide" | "tall";
    gradient?: string;
    demoCredentials?: {
        email: string;
        password: string;
    };
}

export function ProjectCard({
    title,
    description,
    techStack,
    githubUrl,
    liveUrl,
    size = "medium",
    gradient = "from-brand/10 to-transparent",
    demoCredentials,
}: ProjectCardProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const sizeClasses = {
        small: "col-span-1 row-span-1 min-h-[320px]",
        medium: "col-span-1 md:col-span-2 row-span-1 min-h-[320px]",
        large: "col-span-1 md:col-span-2 row-span-1 md:row-span-2 min-h-[320px] md:min-h-[660px]",
        wide: "col-span-1 md:col-span-4 row-span-1 min-h-[320px]",
        tall: "col-span-1 md:col-span-2 row-span-1 md:row-span-2 min-h-[320px] md:min-h-[660px]",
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            className={`group relative ${sizeClasses[size]} rounded-2xl overflow-hidden`}
        >
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div
                    className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg 90deg, rgba(204, 255, 0, 0.4) 180deg, transparent 270deg 360deg)`,
                    }}
                />
                <div
                    className="absolute -inset-[2px] rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg 90deg, rgba(204, 255, 0, 0.3) 180deg, transparent 270deg 360deg)`,
                    }}
                />
            </div>

            {/* Inner Card Content Container */}
            <div className="absolute inset-[1px] rounded-2xl bg-[#121212] border border-white/10 overflow-hidden transition-colors duration-300 group-hover:border-brand/30">
                {/* Noise Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Spotlight Effect */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(204, 255, 0, 0.08), transparent 40%)`,
                    }}
                />

                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />

                {/* Content */}
                <div className="relative h-full p-6 md:p-8 flex flex-col">
                    {/* Header */}
                    <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3 group-hover:text-brand transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                            {description}
                        </p>
                    </div>

                    {/* Tech Stack - Reveals on Hover */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <div className="text-xs font-mono text-gray-600 mb-2">{"// STACK"}</div>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tech, index) => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="px-3 py-1.5 text-sm font-mono rounded bg-brand/10 text-brand border border-brand/20"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Action Links */}
                    <div className="flex gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-gray-300 hover:text-brand border border-white/20 hover:border-brand/40 rounded-lg transition-all duration-300 hover:scale-105"
                            >
                                <Github className="w-4 h-4" />
                                Code
                            </a>
                        )}
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-black bg-brand hover:bg-brand/90 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Live
                            </a>
                        )}
                    </div>

                    {/* Demo Credentials */}
                    {demoCredentials && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <DemoCredentials email={demoCredentials.email} password={demoCredentials.password} />
                        </div>
                    )}
                </div>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-brand/0 group-hover:border-brand/40 rounded-tr-2xl transition-all duration-500" />
        </motion.div>
    );
}
