"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "./Navbar";
import { ScrollIndicator } from "./ScrollIndicator";
import { author, agency } from "@/lib/config/site";

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
                    {author.roles.map((role, i) => (
                        <span key={role} className="contents">
                            {i > 0 && <span className="text-brand">•</span>}
                            <span className="text-gray-300">{role}</span>
                        </span>
                    ))}
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-[0.9] text-foreground"
                >
                    SHABIH
                    <span className="text-gradient-animated text-shadow-neon">.</span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    variants={itemVariants}
                    className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl font-light tracking-wide"
                >
                    {author.bio}
                </motion.p>

                {/* Availability Badge */}
                {agency.availability && (
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                        </span>
                        <span className="text-sm font-mono text-green-400">Available for Projects</span>
                    </motion.div>
                )}

                {/* CTAs */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                    {/* Primary CTA */}
                    <Link
                        href="#services"
                        className="group relative flex items-center gap-2 bg-brand text-black font-semibold px-8 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span>VIEW SERVICES</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-brand via-[#E5FF66] to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    {/* Secondary CTA */}
                    <Link
                        href="#work"
                        className="group relative px-8 py-4 text-gray-200 hover:text-white transition-all duration-300 hover:scale-105"
                    >
                        <span className="relative z-10">SEE OUR WORK</span>
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
