"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
    { label: "Home", href: "#" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Stack", href: "#stack" },
    { label: "Blog", href: "/blog" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled ? "top-2" : "top-6"
                }`}
        >
            <div
                className={`flex items-center gap-1 px-2 py-2 rounded-full border transition-all duration-300 ${scrolled
                    ? "bg-surface/90 backdrop-blur-xl shadow-lg shadow-black/30 border-brand/20"
                    : "bg-black/30 backdrop-blur-md border-white/10"
                    }`}
            >
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group relative px-4 py-2 text-sm text-gray-200 hover:text-white transition-all rounded-full hover:bg-white/10"
                        >
                            <span className="relative z-10">{item.label}</span>
                            <span className="absolute inset-0 rounded-full bg-brand/0 group-hover:bg-brand/5 transition-colors duration-300" />
                        </Link>
                    ))}
                    <Link
                        href="#contact"
                        className="group relative ml-2 px-5 py-2 text-sm font-medium bg-brand text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]"
                    >
                        <span className="relative z-10">Let&apos;s Talk</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-brand via-[#E5FF66] to-brand bg-[length:200%_100%] group-hover:animate-[gradient-shift_2s_ease_infinite]" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 text-white"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden mt-2 p-4 rounded-2xl bg-surface/95 backdrop-blur-xl border border-white/10">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="#contact"
                            onClick={() => setMobileOpen(false)}
                            className="mt-2 px-4 py-3 text-center font-medium bg-brand text-black rounded-lg"
                        >
                            Let&apos;s Talk
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
