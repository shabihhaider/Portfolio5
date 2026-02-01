"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "./Navbar";
import { ScrollIndicator } from "./ScrollIndicator";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background */}
            <AnimatedBackground />

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <motion.div
                className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Professional Tagline */}
                <motion.div
                    variants={itemVariants}
                    className="mb-4 flex items-center justify-center gap-3 text-sm sm:text-base font-mono tracking-wider"
                >
                    <span className="text-gray-300">Full-Stack Developer</span>
                    <span className="text-brand">•</span>
                    <span className="text-gray-300">AI Enthusiast</span>
                    <span className="text-brand">•</span>
                    <span className="text-gray-300">Tech Innovator</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-[0.9] text-foreground"
                >
                    MUHAMMAD
                    <br />
                    <span className="text-gradient-animated text-shadow-neon">SHABIH HAIDER</span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    variants={itemVariants}
                    className="mt-6 text-lg sm:text-xl text-gray-400 max-w-xl font-light tracking-wide"
                >
                    Crafting intelligent web experiences with React & AI.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    variants={itemVariants}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    {/* Primary CTA */}
                    <Link
                        href="#work"
                        className="group relative flex items-center gap-2 bg-brand text-black font-semibold px-8 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span>VIEW MY WORK</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-brand via-[#E5FF66] to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    {/* Secondary CTA */}
                    <Link
                        href="#timeline"
                        className="group relative px-8 py-4 text-gray-200 hover:text-white transition-all duration-300 hover:scale-105"
                    >
                        <span className="relative z-10">About Me</span>
                        <span className="absolute bottom-3 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent group-hover:via-brand transition-all duration-300" />
                        <span className="absolute inset-0 rounded-lg border border-transparent group-hover:border-brand/20 transition-all duration-300" />
                    </Link>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <ScrollIndicator />
        </section>
    );
}
