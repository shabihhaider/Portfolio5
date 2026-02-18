"use client";

import { FaGithub, FaLinkedin, FaInstagram, FaHeart } from "react-icons/fa6";
import { author } from "@/lib/config/site";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaGithub, href: author.social.github, label: "GitHub" },
        { icon: FaLinkedin, href: author.social.linkedin, label: "LinkedIn" },
        { icon: FaInstagram, href: author.social.instagram, label: "Instagram" },
    ];

    const navLinks = [
        { label: "Home", href: "#" },
        { label: "Projects", href: "#work" },
        { label: "Skills", href: "#skills" },
        { label: "Timeline", href: "#timeline" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <footer className="relative py-12 px-6 bg-[#0A0A0A] border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-heading font-bold text-white">
                            {author.name.split(' ')[0]}<span className="text-brand">.</span>
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                            {author.title}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-mono text-gray-500">{"// NAVIGATION"}</h4>
                        <nav className="flex flex-wrap gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm text-gray-400 hover:text-brand transition-colors font-mono"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-mono text-gray-500">{"// CONNECT"}</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-brand/10 hover:border-brand/30 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="text-lg text-gray-400 hover:text-brand transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5 mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-sm text-gray-600 font-mono">
                        © {currentYear} {author.fullName}. All rights reserved.
                    </p>

                    {/* Built With */}
                    <p className="text-sm text-gray-600 font-mono flex items-center gap-2">
                        Built with <FaHeart className="text-red-500 text-xs" /> using Next.js, Tailwind & Coffee
                    </p>

                    {/* System Status */}
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono text-gray-600">
                            SYSTEM: ALL OPERATIONAL
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
            </div>
        </footer>
    );
}
