"use client";

import { motion } from "framer-motion";
import { Mouse } from "lucide-react";

export function ScrollIndicator() {
    return (
        <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
        >
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Mouse size={20} className="text-gray-400" />
            </motion.div>
            <motion.div
                className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
            />
        </motion.div>
    );
}
