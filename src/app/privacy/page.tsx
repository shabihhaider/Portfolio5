import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Contact';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for shabih.tech — how we collect, use, and protect your data.',
    alternates: { canonical: 'https://shabih.tech/privacy' },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h2 className="text-xl font-heading font-semibold text-white mb-4">{title}</h2>
        <div className="space-y-3 text-gray-300 leading-relaxed">{children}</div>
    </div>
);

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-white">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-mono text-gray-400 hover:text-brand transition-colors mb-8"
                >
                    ← Back to Home
                </Link>

                <header className="mb-12">
                    <p className="text-xs font-mono text-brand tracking-widest mb-3">// LEGAL</p>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-gray-500 font-mono text-sm">
                        Last updated: May 7, 2026 &nbsp;·&nbsp; Effective immediately
                    </p>
                </header>

                <div className="space-y-10 divide-y divide-white/10">

                    <Section title="1. Who We Are">
                        <p>
                            <strong className="text-white">Shabih. Agency</strong> is operated by Muhammad Shabih Haider, a sole trader providing web development and AI integration services.
                        </p>
                        <p>
                            <strong className="text-white">Website:</strong> <a href="https://shabih.tech" className="text-brand hover:underline">shabih.tech</a><br />
                            <strong className="text-white">Contact:</strong> <a href="mailto:shabihhaider191@gmail.com" className="text-brand hover:underline">shabihhaider191@gmail.com</a><br />
                            <strong className="text-white">Location:</strong> Lahore, Pakistan
                        </p>
                        <p>
                            For the purpose of the GDPR and UK GDPR, Muhammad Shabih Haider is the <strong className="text-white">data controller</strong> for personal data collected via this website.
                        </p>
                    </Section>

                    <div className="pt-10">
                    <Section title="2. What Data We Collect">
                        <p>We collect only what is necessary to respond to your project inquiry:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="text-white">Name</strong> — to address you correctly</li>
                            <li><strong className="text-white">Email address</strong> — to send you a response</li>
                            <li><strong className="text-white">Project type &amp; budget range</strong> — to give you a relevant quote</li>
                            <li><strong className="text-white">Message</strong> — the details you share about your project</li>
                        </ul>
                        <p>
                            We do <strong className="text-white">not</strong> collect payment details, sensitive personal data, or any data from minors. The contact form does not require a phone number.
                        </p>
                        <p>
                            Our web infrastructure (Vercel) automatically records standard server logs — IP addresses, browser type, and request timestamps — for security and performance purposes.
                        </p>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="3. Legal Basis for Processing">
                        <p>We process your personal data under the following lawful bases (GDPR Article 6):</p>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li>
                                <strong className="text-white">Legitimate interests</strong> (Art. 6(1)(f)) — responding to your project inquiry is a legitimate business interest, and you would reasonably expect a response after submitting a contact form.
                            </li>
                            <li>
                                <strong className="text-white">Consent</strong> (Art. 6(1)(a)) — by submitting the contact form, you consent to us processing your data to follow up on your inquiry.
                            </li>
                        </ul>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="4. How We Use Your Data">
                        <p>Your data is used <strong className="text-white">solely</strong> to:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Respond to your project inquiry via email</li>
                            <li>Send you a confirmation that your message was received</li>
                            <li>Prepare a project scope and quote</li>
                        </ul>
                        <p>We do <strong className="text-white">not</strong> use your data for marketing, sell it to third parties, or share it with advertisers.</p>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="5. Third-Party Data Processors">
                        <p>To operate this website, we use the following third-party services that may process your personal data. All are engaged under appropriate data processing agreements:</p>

                        <div className="space-y-4 mt-2">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="font-semibold text-white mb-1">Notion (Notion Labs, Inc.)</p>
                                <p className="text-sm">Contact form submissions are stored in a private Notion database to manage project inquiries. Notion is certified under the EU–US Data Privacy Framework.</p>
                                <a href="https://www.notion.so/privacy" target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline mt-1 inline-block">notion.so/privacy</a>
                            </div>

                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="font-semibold text-white mb-1">Google (Gmail &amp; reCAPTCHA v3)</p>
                                <p className="text-sm">
                                    <strong className="text-gray-200">Gmail</strong> — confirmation and notification emails are sent via Gmail (Google LLC). Your email address is passed to Google's mail infrastructure to deliver these messages.<br /><br />
                                    <strong className="text-gray-200">reCAPTCHA v3</strong> — our contact form uses Google reCAPTCHA v3 to detect automated submissions. reCAPTCHA operates in the background and collects hardware and software information (e.g. device and application data) to assess whether a submission is from a human. This data is sent to Google for analysis. Google is certified under the EU–US Data Privacy Framework.
                                </p>
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline mt-1 inline-block">policies.google.com/privacy</a>
                            </div>

                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="font-semibold text-white mb-1">Vercel (Vercel Inc.)</p>
                                <p className="text-sm">This website is hosted on Vercel. Vercel processes server request logs (IP addresses, request data) to operate and secure the platform. Vercel is SOC 2 Type II certified.</p>
                                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline mt-1 inline-block">vercel.com/legal/privacy-policy</a>
                            </div>
                        </div>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="6. Data Retention">
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Contact form submissions: retained for <strong className="text-white">2 years</strong>, then deleted</li>
                            <li>Server logs (Vercel): deleted after <strong className="text-white">90 days</strong></li>
                            <li>Email correspondence: retained for the duration of the client relationship</li>
                        </ul>
                        <p>You can request deletion at any time — see Your Rights below.</p>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="7. Cookies">
                        <p>
                            This website uses only the cookies necessary for basic operation. No marketing or tracking cookies are set by us.
                        </p>
                        <p>
                            <strong className="text-white">Google reCAPTCHA</strong> sets a cookie (<code className="text-brand text-xs">_GRECAPTCHA</code>) to function. This cookie is necessary for spam protection and is covered by Google's privacy policy. You can manage or delete cookies via your browser settings.
                        </p>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="8. Your Rights">
                        <p>Under the GDPR (and UK GDPR), you have the following rights regarding your personal data:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="text-white">Access</strong> — request a copy of the data we hold about you</li>
                            <li><strong className="text-white">Rectification</strong> — ask us to correct inaccurate data</li>
                            <li><strong className="text-white">Erasure</strong> ("right to be forgotten") — request deletion of your data</li>
                            <li><strong className="text-white">Restriction</strong> — ask us to limit how we process your data</li>
                            <li><strong className="text-white">Portability</strong> — receive your data in a structured, machine-readable format</li>
                            <li><strong className="text-white">Objection</strong> — object to processing based on legitimate interests</li>
                            <li><strong className="text-white">Withdraw consent</strong> — at any time, without affecting prior processing</li>
                        </ul>
                        <p>
                            To exercise any of these rights, email: <a href="mailto:shabihhaider191@gmail.com" className="text-brand hover:underline">shabihhaider191@gmail.com</a>. We will respond within <strong className="text-white">30 days</strong> at no charge.
                        </p>
                        <p>
                            EU residents may lodge a complaint with their national Data Protection Authority. UK residents may contact the <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-brand hover:underline">ICO</a>.
                        </p>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="9. International Transfers">
                        <p>
                            Your data may be processed outside your country of residence (e.g. in the United States) by the processors listed in Section 5. All such transfers are safeguarded by the EU–US Data Privacy Framework, Standard Contractual Clauses, or equivalent mechanisms approved by the European Commission.
                        </p>
                    </Section>
                    </div>

                    <div className="pt-10">
                    <Section title="10. Changes to This Policy">
                        <p>
                            We update this policy when our practices change. The date at the top reflects the latest revision. Continued use of the website after changes constitutes acceptance of the updated policy.
                        </p>
                        <p>
                            Questions? <a href="mailto:shabihhaider191@gmail.com" className="text-brand hover:underline">shabihhaider191@gmail.com</a>
                        </p>
                    </Section>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
