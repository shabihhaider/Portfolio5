'use client';

import { useEffect } from 'react';
import { cta } from '@/lib/config/site';

interface Props {
    postSlug: string;
}

export default function CTASection({ postSlug }: Props) {
    useEffect(() => {
        // Track view on mount
        if (postSlug) {
            fetch('/api/analytics/cta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postSlug, ctaType: 'blog_footer_view' }),
            }).catch(() => { });
        }
    }, [postSlug]);

    const handleClick = () => {
        if (postSlug) {
            fetch('/api/analytics/cta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postSlug, ctaType: 'blog_footer_click' }),
            }).catch(() => { });
        }
    };

    return (
        <div className="bg-gradient-to-br from-[rgb(var(--brand))]/10 to-transparent border border-[rgb(var(--brand))]/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-[rgb(var(--brand))] animate-[spin_20s_linear_infinite]">
                    <path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z" />
                </svg>
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4 font-heading">
                    {cta.heading.split(cta.headingHighlight)[0]}<span className="text-[rgb(var(--brand))]">{cta.headingHighlight}</span>{cta.heading.split(cta.headingHighlight)[1]}
                </h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                    {cta.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={cta.primaryButton.href}
                        onClick={handleClick}
                        className="bg-[rgb(var(--brand))] hover:bg-[rgb(var(--brand))]/90 text-black font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(204,255,0,0.3)] font-mono uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        <span>{cta.primaryButton.text}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a
                        href={cta.secondaryButton.href}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-8 rounded-lg transition-all font-mono uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        {cta.secondaryButton.text}
                    </a>
                </div>
            </div>
        </div>
    );
}
