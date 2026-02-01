"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Skill, categoryColors } from "@/data/skills";

interface ElementCardProps {
    skill: Skill;
    index: number;
}

export function ElementCard({ skill, index }: ElementCardProps) {
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

    const colors = categoryColors[skill.category];

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onMouseMove={handleMouseMove}
            className="group relative min-h-[200px]"
        >
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div
                    className="absolute -inset-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg 90deg, ${colors.glow} 180deg, transparent 270deg 360deg)`,
                    }}
                />
                <div
                    className="absolute -inset-[2px] rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg 90deg, ${colors.glow} 180deg, transparent 270deg 360deg)`,
                    }}
                />
            </div>

            {/* Inner Card */}
            <div className={`absolute inset-[1px] rounded-xl bg-[#0A0A0A] border ${colors.border} overflow-hidden transition-all duration-300 group-hover:bg-[#0F0F0F]`}>
                {/* Spotlight Effect */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${colors.glow.replace('0.4', '0.1')}, transparent 40%)`,
                    }}
                />

                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-40`} />

                {/* Content */}
                <div className="relative h-full p-4 flex flex-col items-center justify-between">
                    {/* Header: Atomic Number & Category Badge */}
                    <div className="w-full flex items-start justify-between">
                        <span className="text-xs font-mono text-gray-600">
                            {String(skill.id).padStart(2, '0')}
                        </span>
                        <span className={`text-xs font-mono font-bold ${colors.text} px-2 py-0.5 rounded bg-white/5`}>
                            {colors.badge}
                        </span>
                    </div>

                    {/* Element Icon (Center) */}
                    <div className="flex-1 flex items-center justify-center">
                        <skill.icon
                            className={`text-6xl md:text-7xl ${colors.text} opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110`}
                        />
                    </div>

                    {/* Element Name & Proficiency Bar */}
                    <div className="w-full">
                        <div className="text-sm font-mono text-gray-400 text-center mb-2 truncate">
                            {skill.name}
                        </div>

                        {/* Proficiency Bar */}
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                                className={`h-full bg-gradient-to-r ${colors.bg.replace('/10', '/50')}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-2 right-2 w-8 h-8 border-t border-r ${colors.border} opacity-0 group-hover:opacity-60 rounded-tr-lg transition-all duration-500`} />
            </div>
        </motion.div>
    );
}
