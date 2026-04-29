"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Upload Your Wardrobe",
        description: "Photos are auto-processed — background removed, colors extracted, and each item tagged using OpenAI CLIP",
    },
    {
        id: 2,
        title: "3-Gate AI Pipeline",
        description: "Hard fashion rules → occasion filter → ML scoring using EfficientNet, color theory, and live weather data",
    },
    {
        id: 3,
        title: "Ranked Recommendations",
        description: "Outfits scored and ranked for your occasion, weather, and color harmony in real time",
    },
];

const wardrobeItems = [
    { label: "Top",      color: "#1e2a3a" },
    { label: "Bottom",   color: "#1a1a28" },
    { label: "Outwear",  color: "#1c2418" },
    { label: "Shoes",    color: "#241408" },
    { label: "Jumpsuit", color: "#1e1e1e" },
    { label: "Dress",    color: "#221428" },
];

const gates = [
    "Hard Rules",
    "Occasion Filter",
    "AI Scoring",
];

const outfitItems = [
    { label: "Top",    color: "#1e2a3a" },
    { label: "Bottom", color: "#2a2010" },
    { label: "Shoes",  color: "#1a1008" },
];

const STEP_DURATION = 4500;

export function FeaturedProject() {
    const [currentStep, setCurrentStep] = useState(0);
    const [activeGate, setActiveGate]   = useState(-1);
    const [showScore, setShowScore]     = useState(false);

    // Auto-cycle steps
    useEffect(() => {
        const id = setInterval(() => {
            setCurrentStep(s => (s + 1) % 3);
        }, STEP_DURATION);
        return () => clearInterval(id);
    }, []);

    // Reset sub-states on step change
    useEffect(() => {
        setActiveGate(-1);
        setShowScore(false);

        if (currentStep === 1) {
            const t0 = setTimeout(() => setActiveGate(0), 400);
            const t1 = setTimeout(() => setActiveGate(1), 1200);
            const t2 = setTimeout(() => setActiveGate(2), 2000);
            return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
        }
        if (currentStep === 2) {
            const t = setTimeout(() => setShowScore(true), 600);
            return () => clearTimeout(t);
        }
    }, [currentStep]);

    return (
        <section className="relative w-full py-12 px-6">
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-80 h-80 rounded-full bg-brand/8 blur-3xl" style={{ top: "15%", right: "8%" }} />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Label */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="text-sm font-mono text-brand">CASE STUDY</span>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* ── Left ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-xs font-mono text-gray-500 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4 inline-block">
                            FYP @ UET Lahore — Team of 4
                        </span>

                        <h2 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
                            OutfitAI
                            <br />
                            <span className="text-gradient-animated">Fashion Assistant</span>
                        </h2>

                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            A full-stack AI fashion assistant that recommends outfits from your personal wardrobe based on real-time weather, occasion, and color harmony — with Virtual Try-On and a social feed.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { value: "117K+", label: "Training Images" },
                                { value: "89%",   label: "Model 1 Accuracy" },
                                { value: "81.4%", label: "Model 2 AUC-ROC" },
                                { value: "203",   label: "Tests Passing" },
                            ].map(s => (
                                <div key={s.label} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-2xl font-bold text-brand">{s.value}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="https://drssl.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-brand text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(204,255,0,0.3)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Live Demo
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-brand via-[#E5FF66] to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                    </motion.div>

                    {/* ── Right ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="space-y-4"
                    >
                        {/* Step list — left-aligned labels */}
                        <div className="space-y-2">
                            {steps.map((step, i) => (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(i)}
                                    className="w-full text-left"
                                >
                                    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                                        currentStep === i
                                            ? "border-brand/30 bg-brand/5"
                                            : "border-transparent hover:border-white/10"
                                    }`}>
                                        <span className={`mt-0.5 text-xs font-mono shrink-0 transition-colors ${currentStep === i ? "text-brand" : "text-gray-600"}`}>
                                            0{step.id}
                                        </span>
                                        <div>
                                            <p className={`text-sm font-semibold transition-colors ${currentStep === i ? "text-white" : "text-gray-500"}`}>
                                                {step.title}
                                            </p>
                                            <AnimatePresence>
                                                {currentStep === i && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="text-xs text-gray-500 mt-1 leading-relaxed"
                                                    >
                                                        {step.description}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Visual panel */}
                        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] overflow-hidden">
                            {/* macOS bar */}
                            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                <span className="ml-3 text-xs font-mono text-gray-600">outfitai</span>
                            </div>

                            <div className="p-5 min-h-[220px] flex items-center">
                                <AnimatePresence mode="wait">

                                    {/* Step 1 — Wardrobe grid */}
                                    {currentStep === 0 && (
                                        <motion.div
                                            key="wardrobe"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.25 }}
                                            className="w-full"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono text-gray-500">My Wardrobe</span>
                                                <span className="text-xs font-mono text-brand">19 / 50 items</span>
                                            </div>
                                            <div className="grid grid-cols-6 gap-2">
                                                {wardrobeItems.map((item, i) => (
                                                    <motion.div
                                                        key={item.label}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.07, duration: 0.25 }}
                                                        className="aspect-square rounded-lg border border-white/10 flex items-end justify-center pb-1.5"
                                                        style={{ background: item.color }}
                                                    >
                                                        <span className="text-[8px] font-mono text-white/50">{item.label}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2 — Pipeline gates */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="pipeline"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.25 }}
                                            className="w-full space-y-2.5"
                                        >
                                            {gates.map((name, i) => (
                                                <motion.div
                                                    key={name}
                                                    animate={activeGate >= i
                                                        ? { opacity: 1 }
                                                        : { opacity: 0.25 }
                                                    }
                                                    transition={{ duration: 0.3 }}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors duration-300 ${
                                                        activeGate >= i
                                                            ? "border-brand/25 bg-brand/5"
                                                            : "border-white/8 bg-white/2"
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300 ${
                                                        activeGate >= i
                                                            ? "bg-brand text-black"
                                                            : "bg-white/10 text-gray-600"
                                                    }`}>
                                                        {activeGate >= i ? "✓" : i + 1}
                                                    </div>
                                                    <span className={`text-sm transition-colors duration-300 ${activeGate >= i ? "text-white" : "text-gray-600"}`}>
                                                        {name}
                                                    </span>
                                                    {activeGate === i && (
                                                        <motion.div
                                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-brand"
                                                            animate={{ opacity: [1, 0.3, 1] }}
                                                            transition={{ duration: 0.8, repeat: Infinity }}
                                                        />
                                                    )}
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* Step 3 — Result */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.25 }}
                                            className="w-full"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-mono text-gray-500">Top Result</span>
                                                <span className="text-xs font-mono text-brand px-2 py-0.5 rounded-full border border-brand/25 bg-brand/8">CASUAL</span>
                                            </div>

                                            {/* Outfit items */}
                                            <div className="flex gap-2 mb-5">
                                                {outfitItems.map((item, i) => (
                                                    <motion.div
                                                        key={item.label}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.08 }}
                                                        className="flex-1 h-16 rounded-xl border border-white/10 flex items-end justify-center pb-1.5"
                                                        style={{ background: item.color }}
                                                    >
                                                        <span className="text-[9px] font-mono text-white/40">{item.label}</span>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Score — single number, clean */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: showScore ? 1 : 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-brand/20 bg-brand/5"
                                            >
                                                <div>
                                                    <p className="text-xs font-mono text-gray-500">Compatibility</p>
                                                    <p className="text-xs font-mono text-brand mt-0.5">Strong Match</p>
                                                </div>
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: showScore ? 1 : 0, scale: showScore ? 1 : 0.8 }}
                                                    transition={{ delay: 0.2, duration: 0.35 }}
                                                    className="text-3xl font-bold text-brand font-mono"
                                                >
                                                    82%
                                                </motion.span>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>

                            {/* Progress line */}
                            <div className="h-px bg-white/5">
                                <motion.div
                                    key={currentStep}
                                    className="h-full bg-brand/40"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
