'use client';

import { ReactNode } from 'react';

const icons: Record<string, string> = {
    info: 'ℹ️',
    tip: '💡',
    warning: '⚠️',
    danger: '🚨',
    note: '📝',
};

const borderColors: Record<string, string> = {
    info: 'border-blue-500/40',
    tip: 'border-[rgb(var(--brand))]/40',
    warning: 'border-amber-500/40',
    danger: 'border-red-500/40',
    note: 'border-white/20',
};

const bgColors: Record<string, string> = {
    info: 'bg-blue-500/5',
    tip: 'bg-[rgb(var(--brand))]/5',
    warning: 'bg-amber-500/5',
    danger: 'bg-red-500/5',
    note: 'bg-white/[0.03]',
};

interface CalloutProps {
    type?: string;
    title?: string;
    children: ReactNode;
}

export default function Callout({ type = 'note', title, children }: CalloutProps) {
    const key = (type || 'note').toLowerCase();
    const icon = icons[key] || icons.note;
    const border = borderColors[key] || borderColors.note;
    const bg = bgColors[key] || bgColors.note;

    return (
        <div className={`my-6 rounded-lg border-l-4 ${border} ${bg} p-4 md:p-5`}>
            {title && (
                <p className="mb-2 flex items-center gap-2 font-semibold text-white text-sm">
                    <span>{icon}</span> {title}
                </p>
            )}
            <div className="text-gray-300 text-sm leading-relaxed [&>p]:m-0">
                {children}
            </div>
        </div>
    );
}
