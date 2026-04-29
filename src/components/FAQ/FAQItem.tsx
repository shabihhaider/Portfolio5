"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FAQItem as FAQItemType } from "@/data/faq";

interface FAQItemProps {
    item: FAQItemType;
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}

export function FAQItem({ item, isOpen, onToggle, index }: FAQItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`border rounded-xl transition-all duration-300 ${
                isOpen
                    ? 'border-brand/30 bg-brand/5'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <span className={`text-base font-medium transition-colors ${
                    isOpen ? 'text-brand' : 'text-white'
                }`}>
                    {item.question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 ml-4 transition-all duration-300 ${
                        isOpen ? 'text-brand rotate-180' : 'text-gray-500'
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5">
                            <div className="h-px bg-white/10 mb-4" />
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
