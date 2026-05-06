import Image from 'next/image';

interface PhoneMockupProps {
    src: string;
    alt: string;
}

export function PhoneMockup({ src, alt }: PhoneMockupProps) {
    return (
        <div className="relative mx-auto w-[280px]">
            {/* Phone frame */}
            <div className="relative rounded-[2.5rem] border-[6px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl shadow-black/60 overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" />
                {/* Screen */}
                <div className="relative w-full aspect-[9/19] bg-black overflow-hidden rounded-[2rem]">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover object-top"
                        sizes="280px"
                    />
                </div>
                {/* Home indicator */}
                <div className="flex justify-center py-2 bg-[#1a1a1a]">
                    <div className="w-20 h-1 rounded-full bg-white/20" />
                </div>
            </div>
        </div>
    );
}
