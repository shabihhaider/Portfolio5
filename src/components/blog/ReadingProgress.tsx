'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(scrollPercent, 100));
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] bg-white/5 z-50">
            <div
                className="h-full bg-gradient-to-r from-[rgb(var(--brand))] to-[rgb(var(--brand))]/70 transition-[width] duration-150 ease-out shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
