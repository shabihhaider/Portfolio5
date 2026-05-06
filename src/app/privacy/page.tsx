import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Contact';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for shabih.tech.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-white">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-mono text-gray-400 hover:text-brand transition-colors"
                >
                    ← Back to Home
                </Link>

                <header className="mt-6 mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-gray-400 font-mono text-sm">
                        Last updated: May 6, 2026
                    </p>
                </header>

                <section className="space-y-10 text-gray-300 leading-relaxed">
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-white mb-3">Who We Are</h2>
                        <p className="whitespace-pre-line">
                            Muhammad Shabih Haider (Shabih.)
                            <br />shabih.tech — <a href="mailto:shabihhaider191@gmail.com" className="text-brand hover:underline">shabihhaider191@gmail.com</a>
                        </p>
                    </div>
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-white mb-3">What We Collect</h2>
                        <p className="whitespace-pre-line">
                            When you submit our contact form, we collect your 
                            name, email, phone number (optional), project type, 
                            budget range, and message. Our web server also 
                            automatically logs IP addresses and browser data 
                            for security purposes.
                        </p>
                    </div>
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-white mb-3">Why &amp; How Long</h2>
                        <p className="whitespace-pre-line">
                            We use your data solely to respond to your project 
                            inquiry — nothing else. Legal basis: legitimate 
                            interest (GDPR Art. 6(1)(f)).

                            We retain contact data for 2 years, then delete it. 
                            Server logs are deleted after 90 days.
                        </p>
                    </div>
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-white mb-3">Where It&apos;s Stored</h2>
                        <p className="whitespace-pre-line">
                            Submissions are stored in Notion (Notion Labs Inc., 
                            US). Notion is certified under the EU–US Data 
                            Privacy Framework. We do not sell or share your 
                            data with anyone.
                        </p>
                    </div>
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-white mb-3">Your Rights</h2>
                        <p className="whitespace-pre-line">
                            You have the right to access, correct, delete, or 
                            export your data at any time. To exercise any right, 
                            email: <a href="mailto:shabihhaider191@gmail.com" className="text-brand hover:underline">shabihhaider191@gmail.com</a>
                            <br />We respond within 30 days at no charge.

                            EU/UK residents may also file a complaint with their 
                            local Data Protection Authority.
                        </p>
                    </div>
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-white mb-3">Cookies</h2>
                        <p className="whitespace-pre-line">
                            We use functional cookies for basic site operation. 
                            If analytics are enabled, anonymised usage data may 
                            be collected. You can disable cookies in your 
                            browser settings at any time.
                        </p>
                    </div>
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-white mb-3">Changes</h2>
                        <p className="whitespace-pre-line">
                            We update this policy when our practices change. 
                            The date above reflects the latest revision.

                            Questions? <a href="mailto:shabihhaider191@gmail.com" className="text-brand hover:underline">shabihhaider191@gmail.com</a>
                        </p>
                    </div>
                    <div className="border-y border-white/10 py-6 text-center tracking-widest text-sm text-gray-500 font-mono">
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
