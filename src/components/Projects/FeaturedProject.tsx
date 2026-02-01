"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, ExternalLink, Play } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Upload Your Wardrobe",
        description: "Take photos of your clothing items or upload existing images",
        detail: "AI identifies colors, patterns, and styles",
    },
    {
        id: 2,
        title: "AI Analysis",
        description: "TensorFlow processes your wardrobe using computer vision",
        detail: "Analyzing 50K+ fashion combinations",
    },
    {
        id: 3,
        title: "Get Recommendations",
        description: "Receive personalized outfit suggestions for any occasion",
        detail: "Formal • Casual • Wedding ready",
    },
];

export function FeaturedProject() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full min-h-[70vh] py-12 px-6">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute w-96 h-96 rounded-full bg-brand/10 blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ top: "20%", right: "10%" }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Featured Label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="text-sm font-mono text-brand">FEATURED PROJECT</span>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Project Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                            AI Fashion
                            <br />
                            <span className="text-gradient-animated">Stylist</span>
                        </h2>

                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            An intelligent wardrobe assistant that analyzes your clothing items
                            and provides personalized outfit recommendations using computer vision
                            and deep learning.
                        </p>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-2xl font-bold text-brand">50K+</div>
                                <div className="text-xs text-gray-500">Training Images</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-2xl font-bold text-brand">95%</div>
                                <div className="text-xs text-gray-500">Accuracy</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-2xl font-bold text-brand">3</div>
                                <div className="text-xs text-gray-500">Categories</div>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="mb-8">
                            <div className="text-sm font-mono text-gray-500 mb-3">TECH STACK</div>
                            <div className="flex flex-wrap gap-2">
                                {["Python", "TensorFlow", "React", "OpenCV", "FastAPI"].map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-4 py-2 text-sm font-mono rounded-full bg-brand/10 text-brand border border-brand/20"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#"
                                className="group relative flex items-center gap-2 px-6 py-3 bg-brand text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Play className="w-4 h-4" />
                                    View Demo Video
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-brand via-[#E5FF66] to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </a>
                            <a
                                href="#"
                                className="group flex items-center gap-2 px-6 py-3 text-gray-200 border border-white/20 rounded-lg hover:border-brand/50 hover:text-white transition-all duration-300 hover:scale-105"
                            >
                                <Github className="w-4 h-4" />
                                View Source
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Animated Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Steps Progress */}
                        <div className="mb-8 space-y-4">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    className={`relative p-6 rounded-xl border transition-all duration-500 ${currentStep === index
                                        ? "bg-brand/10 border-brand/50 shadow-[0_0_30px_rgba(204,255,0,0.25)] scale-105"
                                        : "bg-white/5 border-white/10 scale-100"
                                        }`}
                                    animate={{
                                        scale: currentStep === index ? 1.02 : 1,
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold transition-all duration-500 text-lg ${currentStep === index
                                                ? "border-brand bg-brand text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]"
                                                : currentStep > index
                                                    ? "border-brand/50 bg-brand/20 text-brand"
                                                    : "border-white/20 text-gray-500"
                                                }`}
                                        >
                                            {step.id}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-semibold mb-1 transition-colors ${currentStep === index ? 'text-white text-lg' : 'text-gray-300'}`}>{step.title}</h4>
                                            <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                                            <AnimatePresence mode="wait">
                                                {currentStep === index && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-xs font-mono text-brand font-semibold"
                                                    >
                                                        → {step.detail}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {currentStep === index && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-1 bg-brand rounded-b-xl"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 4, ease: "linear" }}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Visual State Indicator */}
                        <div className="relative h-80 rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-transparent overflow-hidden backdrop-blur-sm shadow-xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {currentStep === 0 && (
                                        <motion.div
                                            key="upload"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="text-center p-8"
                                        >
                                            <div className="w-28 h-28 mx-auto mb-6 rounded-2xl bg-brand/20 border-2 border-dashed border-brand flex items-center justify-center">
                                                <ExternalLink className="w-14 h-14 text-brand" />
                                            </div>
                                            <p className="text-gray-300 font-mono text-sm">Drop your images here</p>
                                        </motion.div>
                                    )}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="analyzing"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="text-center"
                                        >
                                            <motion.div
                                                className="w-36 h-36 mx-auto mb-6 rounded-full border-4 border-brand/30 border-t-brand"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                            <p className="text-brand font-mono text-base font-semibold">Analyzing wardrobe...</p>
                                        </motion.div>
                                    )}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="results"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="w-full p-8"
                                        >
                                            <div className="grid grid-cols-3 gap-4">
                                                {["Formal", "Casual", "Wedding"].map((category, i) => (
                                                    <motion.div
                                                        key={category}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="aspect-square rounded-xl bg-gradient-to-br from-brand/30 to-brand/10 border-2 border-brand/40 flex flex-col items-center justify-center p-3 shadow-lg"
                                                    >
                                                        <div className="w-12 h-12 mb-2 rounded-lg bg-brand/20 border border-brand/30" />
                                                        <span className="text-xs font-mono text-brand font-semibold">{category}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
