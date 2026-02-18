"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaCheck, FaCopy } from "react-icons/fa6";
import { author } from "@/lib/config/site";

export function Contact() {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to send');

            setFormState('success');
            setFormData({ name: '', email: '', message: '' });
        } catch {
            setFormState('error');
            setTimeout(() => setFormState('idle'), 3000);
        }
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(author.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const socialLinks = [
        { icon: FaGithub, href: author.social.github, label: "GitHub" },
        { icon: FaLinkedin, href: author.social.linkedin, label: "LinkedIn" },
        { icon: FaInstagram, href: author.social.instagram, label: "Instagram" },
    ];

    return (
        <section id="contact" className="relative py-20 px-6 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <span className="text-sm font-mono text-brand">INITIALIZE CONNECTION</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                        Let&apos;s Build
                        <br />
                        <span className="text-gradient-animated">The Impossible</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                        {"// Open channel for new transmissions"}
                    </p>
                </motion.div>

                {/* Split Layout */}
                <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                    {/* Left Side - The Pitch */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                                Have an idea?
                            </h3>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                I&apos;m currently open for <span className="text-brand">freelance work</span> and
                                <span className="text-brand"> collaborations</span>. Whether you need a
                                full-stack application, AI integration, or just want to discuss tech—
                                let&apos;s connect.
                            </p>
                        </div>

                        {/* Direct Email */}
                        <div className="space-y-4">
                            <p className="text-sm font-mono text-gray-500">{"// DIRECT_LINK"}</p>
                            <button
                                onClick={copyEmail}
                                className="group flex items-center gap-3 text-lg font-mono text-white hover:text-brand transition-colors"
                            >
                                <span>{author.email}</span>
                                <span className="p-2 rounded-lg bg-white/5 group-hover:bg-brand/20 transition-colors">
                                    {copied ? (
                                        <FaCheck className="text-brand" />
                                    ) : (
                                        <FaCopy className="text-gray-400 group-hover:text-brand" />
                                    )}
                                </span>
                                {copied && (
                                    <span className="text-sm text-brand animate-pulse">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <p className="text-sm font-mono text-gray-500">{"// SOCIAL_NODES"}</p>
                            <div className="flex gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-brand/10 hover:border-brand/30 transition-all duration-300"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="text-2xl text-gray-400 group-hover:text-brand transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Availability Status */}
                        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="font-mono text-green-400 text-sm">
                                    STATUS: AVAILABLE FOR PROJECTS
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - The Terminal Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md h-full relative overflow-hidden">
                            {/* Success Overlay - Replaces Form */}
                            {formState === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-xl"
                                >
                                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                                        <FaCheck className="text-4xl text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-heading font-bold text-white mb-2 text-center">
                                        Transmission Received
                                    </h3>
                                    <p className="text-gray-400 text-center mb-8 max-w-sm">
                                        Thanks for reaching out! I&apos;ve received your message and will get back to you within 24-48 hours.
                                    </p>

                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <p className="text-sm font-mono text-brand mb-2">{"// CONNECT_WITH_ME"}</p>
                                        <div className="flex gap-4">
                                            {socialLinks.map((social) => (
                                                <a
                                                    key={social.label}
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-brand/10 hover:border-brand/30 transition-all duration-300 group"
                                                >
                                                    <social.icon className="text-2xl text-gray-400 group-hover:text-brand transition-colors" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setFormState('idle')}
                                        className="mt-12 text-sm text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-0.5"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Terminal Header */}
                                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="ml-4 text-sm font-mono text-gray-500">
                                            transmission.sh
                                        </span>
                                    </div>

                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-mono text-gray-500">
                                            {'>'} Name_
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-brand font-mono placeholder:text-gray-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-[#CCFF00] transition-all"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-mono text-gray-500">
                                            {'>'} Email_
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-brand font-mono placeholder:text-gray-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-[#CCFF00] transition-all"
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-mono text-gray-500">
                                            {'>'} Message_
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell me about your project..."
                                            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-brand font-mono placeholder:text-gray-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-[#CCFF00] transition-all resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={formState !== 'idle'}
                                        className={`w-full py-4 rounded-lg font-mono font-bold text-lg transition-all duration-300 ${formState === 'sending'
                                            ? 'bg-brand/10 text-brand border border-brand/30 cursor-wait'
                                            : 'bg-brand/10 text-brand border border-brand/30 hover:bg-brand hover:text-background hover:shadow-[0_0_30px_rgba(204,255,0,0.3)]'
                                            }`}
                                    >
                                        {formState === 'idle' && (
                                            <span className="flex items-center justify-center gap-2">
                                                <span>SEND TRANSMISSION</span>
                                                <span className="text-xl">→</span>
                                            </span>
                                        )}
                                        {formState === 'sending' && (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-pulse">UPLOADING...</span>
                                                <span className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                            </span>
                                        )}
                                    </button>

                                    {/* Terminal Footer */}
                                    <p className="text-xs font-mono text-gray-600 text-center">
                                        {"// All transmissions are encrypted and secure"}
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
