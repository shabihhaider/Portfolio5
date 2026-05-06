"use client";

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/data/case-studies';

interface CaseStudyCardProps {
    study: CaseStudy;
}

export function CaseStudyCard({ study }: CaseStudyCardProps) {
    return (
        <Link
            href={`/work/${study.slug}`}
            className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-brand/30 transition-all duration-300"
        >
            {/* Preview */}
            <div className="relative w-full aspect-[16/10] overflow-hidden">
                {study.mockupType === 'browser' && study.liveUrl && study.livePreview !== false ? (
                    <>
                        {/* Mini browser chrome */}
                        <div className="absolute top-0 left-0 right-0 z-10 bg-[#1a1a1a] px-3 py-2 flex items-center gap-2 border-b border-white/10">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                                <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                                <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="flex-1 bg-[#0a0a0a] rounded px-2 py-0.5 text-[10px] text-gray-600 font-mono truncate">
                                {study.liveUrl.replace('https://', '')}
                            </div>
                        </div>
                        <div className="absolute inset-0 top-8">
                            <iframe
                                src={study.liveUrl}
                                title={study.title}
                                className="w-full h-full border-0 pointer-events-none"
                                style={{ width: '125%', height: '125%', transform: 'scale(0.8)', transformOrigin: 'top left' }}
                                loading="lazy"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </div>
                    </>
                ) : (
                    // Intentional branded placeholder for sites that block iframes
                    <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient ?? 'from-brand/10 to-cyan-500/10'} flex flex-col items-center justify-center gap-3`}>
                        {study.liveUrl && (
                            <span className="text-brand font-mono font-bold text-lg tracking-tight">
                                {study.liveUrl.replace('https://', '')}
                            </span>
                        )}
                        <span className="text-xs font-mono text-gray-500">View live site →</span>
                    </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-20" />
            </div>

            {/* Content */}
            <div className="flex items-start justify-between gap-2 p-5">
                <div>
                    <span className="text-xs font-mono text-brand">{study.category}</span>
                    <h3 className="text-lg font-heading font-bold text-white mt-0.5 group-hover:text-brand transition-colors">
                        {study.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{study.tagline}</p>
                </div>
                <div className="mt-1 p-1.5 rounded-lg border border-white/10 bg-white/5 group-hover:bg-brand/10 group-hover:border-brand/30 transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
                </div>
            </div>
        </Link>
    );
}
