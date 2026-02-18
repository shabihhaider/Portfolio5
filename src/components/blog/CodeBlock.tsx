'use client';

import { useState, useRef, ReactNode } from 'react';

interface CodeBlockProps {
    children: ReactNode;
    className?: string;
    [key: string]: unknown;
}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = async () => {
        const text = preRef.current?.innerText ?? '';
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const area = document.createElement('textarea');
            area.value = text;
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            document.body.removeChild(area);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Try to extract language from the child <code> className (e.g. "hljs language-tsx")
    let language = '';
    if (
        children &&
        typeof children === 'object' &&
        'props' in (children as unknown as Record<string, unknown>)
    ) {
        const codeProps = (children as unknown as { props: { className?: string } }).props;
        const match = codeProps?.className?.match(/language-(\w+)/);
        if (match) language = match[1];
    }

    return (
        <div className="group relative my-8 rounded-xl border border-white/[0.08] bg-[#0C0C0C] overflow-hidden shadow-2xl">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
                {/* Window dots */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    </div>
                    {language && (
                        <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
                            {language}
                        </span>
                    )}
                </div>

                {/* Copy button */}
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[rgb(var(--brand))]">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[rgb(var(--brand))]">Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                            </svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code content */}
            <pre
                ref={preRef}
                {...props}
                className="!bg-transparent !border-0 !rounded-none !shadow-none !my-0 overflow-x-auto p-5 text-[14px] leading-relaxed"
            >
                {children}
            </pre>
        </div>
    );
}
