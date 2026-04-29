"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { faqItems } from "@/data/faq";
import { FAQItem } from "./FAQItem";

export function FAQ() {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <section id="faq" className="relative py-20 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-3xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <span className="text-sm font-mono text-brand">FAQ</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                        Common
                        <br />
                        <span className="text-gradient-animated">Questions</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                        {"// Everything you need to know before starting"}
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-3">
                    {faqItems.map((item, index) => (
                        <FAQItem
                            key={item.id}
                            item={item}
                            index={index}
                            isOpen={openId === item.id}
                            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
