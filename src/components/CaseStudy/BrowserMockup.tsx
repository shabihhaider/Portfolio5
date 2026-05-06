import Image from 'next/image';

interface BrowserMockupProps {
    url: string;
    alt: string;
    livePreview?: boolean;
    gradient?: string;
    screenshotSrc?: string;
}

export function BrowserMockup({ url, alt, livePreview = true, gradient = 'from-brand/10 to-cyan-500/10', screenshotSrc }: BrowserMockupProps) {
    return (
        <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-[#111] rounded-md px-3 py-1 text-xs text-gray-500 font-mono truncate">
                    {url.replace('https://', '')}
                </div>
            </div>
            {/* Content */}
            <div className={`relative w-full aspect-[16/10] bg-gradient-to-br ${gradient}`}>
                {livePreview ? (
                    <iframe
                        src={url}
                        title={alt}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : screenshotSrc ? (
                    <Image
                        src={screenshotSrc}
                        alt={alt}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-8">
                        <div className="flex gap-2">
                            <div className="w-32 h-3 rounded-full bg-white/10" />
                            <div className="w-16 h-3 rounded-full bg-white/5" />
                        </div>
                        <div className="w-48 h-2 rounded-full bg-white/10" />
                        <div className="w-40 h-2 rounded-full bg-white/5" />
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-5 py-2 rounded-lg bg-brand/20 border border-brand/30 text-brand text-sm font-mono hover:bg-brand/30 transition-colors pointer-events-auto"
                        >
                            Open {url.replace('https://', '')} ↗
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
