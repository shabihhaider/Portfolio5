"use client";

import { useEffect, useState } from "react";

export function StatusBar() {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
            );
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400 tracking-wide">
            <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                <span>Lahore, PK</span>
            </span>
            <span className="text-gray-600">|</span>
            <span>{time || "00:00 AM"}</span>
            <span className="text-gray-600">|</span>
            <span className="text-brand">System: Online & Building</span>
        </div>
    );
}
