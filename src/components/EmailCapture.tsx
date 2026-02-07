'use client';

import { useState } from 'react';

export default function EmailCapture() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('success');
                setMessage('Transmission link established. Welcome to the network.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage('Connection failed. Please retry transmission.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('System error. Network unreachable.');
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[rgb(var(--brand))] opacity-10 rounded-full blur-[64px] group-hover:opacity-20 transition-opacity duration-700" />

            <div className="relative z-10 text-center max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(var(--brand))]/10 border border-[rgb(var(--brand))]/20 text-[rgb(var(--brand))] text-xs font-mono mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--brand))] animate-pulse"></span>
                    NETWORK_UPLINK
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                    Join the <span className="text-[rgb(var(--brand))]">Inner Circle</span>
                </h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                    Get weekly drops on Full Stack engineering, AI agents, and Cyberpunk UI design directly to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="enter_email_address"
                        required
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[rgb(var(--brand))] focus:ring-1 focus:ring-[rgb(var(--brand))] outline-none transition-all font-mono text-sm"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="bg-[rgb(var(--brand))] hover:bg-[rgb(var(--brand))]/90 text-black font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-heading tracking-wide uppercase shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                    >
                        {status === 'loading' ? 'Processing...' : status === 'success' ? 'Connected' : 'Subscribe'}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-xs font-mono border px-3 py-2 rounded bg-black/50 inline-block ${status === 'success' ? 'text-[rgb(var(--brand))] border-[rgb(var(--brand))]/30' : 'text-red-500 border-red-500/30'
                        }`}>
                        {status === 'success' ? '✓' : '⚠'} {message}
                    </p>
                )}
            </div>
        </div>
    );
}
