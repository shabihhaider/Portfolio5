"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated Gradient Orbs */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
                style={{
                    background: "radial-gradient(circle, rgba(204, 255, 0, 0.4) 0%, transparent 70%)",
                }}
                animate={{
                    x: ["-10%", "10%", "-10%"],
                    y: ["0%", "20%", "0%"],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ x: "-10%", y: "0%" }}
            />

            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
                style={{
                    background: "radial-gradient(circle, rgba(204, 255, 0, 0.3) 0%, transparent 70%)",
                    right: 0,
                    top: "50%",
                }}
                animate={{
                    x: ["10%", "-10%", "10%"],
                    y: ["-10%", "10%", "-10%"],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ x: "10%", y: "-10%" }}
            />

            {/* Floating Geometric Shapes */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 border border-brand/30"
                    style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 3) * 20}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                    }}
                />
            ))}

            {/* Animated Grid with Pulse */}
            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundSize: "60px 60px",
                    backgroundImage: `
                        linear-gradient(to right, rgba(204, 255, 0, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(204, 255, 0, 0.1) 1px, transparent 1px)
                    `,
                }}
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Radial Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 0%, #050505 100%)`,
                }}
            />
        </div>
    );
}
