import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, Check } from 'lucide-react';
import { caseStudies } from '@/data/case-studies';
import { BrowserMockup } from '@/components/CaseStudy/BrowserMockup';
import { PhoneMockup } from '@/components/CaseStudy/PhoneMockup';
import { CaseStudyCard } from '@/components/CaseStudy/CaseStudyCard';
import { getCaseStudySchema } from '@/lib/seo/json-ld';
import { site } from '@/lib/config/site';
import Image from 'next/image';

export function generateStaticParams() {
    return caseStudies.map(s => ({ slug: s.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const study = caseStudies.find(s => s.slug === slug);
    if (!study) return {};
    return {
        title: `${study.title} Case Study`,
        description: study.overview,
        alternates: {
            canonical: `${site.url}/work/${study.slug}`,
        },
        openGraph: {
            title: `${study.title} Case Study | Shabih.`,
            description: study.tagline,
            url: `${site.url}/work/${study.slug}`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${study.title} Case Study | Shabih.`,
            description: study.tagline,
        },
    };
}

const midCtaCopy: Record<string, string> = {
    'AI / ML': 'Need AI in your product?',
    'Dashboard': 'Need a custom dashboard?',
    'Landing Page': 'Need a landing page like this?',
};

export default async function CaseStudyPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const study = caseStudies.find(s => s.slug === slug);
    if (!study) notFound();

    const relatedStudies = caseStudies.filter(s => s.slug !== study.slug).slice(0, 2);
    const midCtaHeading = midCtaCopy[study.category] ?? 'Have a similar project in mind?';

    return (
        <main className="min-h-screen bg-background text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getCaseStudySchema(study)) }}
            />

            <div className="max-w-4xl mx-auto px-6 py-16">

                {/* Back link */}
                <Link
                    href="/work"
                    className="inline-flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-brand transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to work
                </Link>

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-10">
                    <Link href="/" className="hover:text-brand transition-colors">Home</Link>
                    <span className="text-brand">/</span>
                    <Link href="/work" className="hover:text-brand transition-colors">Work</Link>
                    <span className="text-brand">/</span>
                    <span className="text-gray-400">{study.title}</span>
                </nav>

                {/* Hero */}
                <div className="mb-12">
                    <span className="text-xs font-mono text-brand tracking-widest">{study.category}</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mt-3">
                        {study.title}
                    </h1>
                    <p className="text-xl text-gray-400 mt-3">{study.tagline}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-6">
                        {study.liveUrl && (
                            <a
                                href={study.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand text-black text-xs font-semibold hover:opacity-90 transition-opacity ml-auto"
                            >
                                Live Site <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Mockup */}
                <div className="mb-16">
                    {study.mockupType === 'browser' && study.liveUrl ? (
                        <BrowserMockup
                            url={study.liveUrl}
                            alt={study.title}
                            livePreview={study.livePreview}
                            screenshotSrc={study.screenshotSrc}
                            gradient={study.gradient}
                        />
                    ) : (
                        <div className="flex justify-center gap-6 flex-wrap">
                            {study.screenshots?.map((src, i) => (
                                <PhoneMockup key={i} src={src} alt={`${study.title} screen ${i + 1}`} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Metrics */}
                {study.metrics && study.metrics.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                        {study.metrics.map(m => (
                            <div key={m.label} className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl font-bold text-brand">{m.value}</div>
                                <div className="text-xs text-gray-500 font-mono mt-1">{m.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Overview */}
                <div className="mb-12">
                    <h2 className="text-xs font-mono text-gray-500 mb-3">// OVERVIEW</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">{study.overview}</p>
                </div>

                {/* Tech Stack */}
                {study.techStack && study.techStack.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xs font-mono text-gray-500 mb-4">// BUILT WITH</h2>
                        <div className="flex flex-wrap gap-2">
                            {study.techStack.map(tech => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Problem / Solution */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
                        <h3 className="text-xs font-mono text-gray-500 mb-3">// THE CHALLENGE</h3>
                        <p className="text-gray-300 leading-relaxed">{study.problem}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-brand/5 border border-brand/20">
                        <h3 className="text-xs font-mono text-brand mb-3">// THE SOLUTION</h3>
                        <p className="text-gray-300 leading-relaxed">{study.solution}</p>
                    </div>
                </div>

                {/* Deliverables */}
                {study.deliverables && study.deliverables.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-xs font-mono text-gray-500 mb-4">// WHAT WAS DELIVERED</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {study.deliverables.map(item => (
                                <div key={item} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-brand shrink-0" />
                                    <span className="text-sm text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mid-page CTA */}
                <div className="mb-16 p-6 rounded-xl bg-brand/5 border border-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-white font-heading font-bold text-lg">{midCtaHeading}</p>
                        <p className="text-gray-400 text-sm mt-1">Fixed price, clear scope, on-time delivery.</p>
                    </div>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shrink-0"
                    >
                        Let&apos;s Talk <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Additional screenshots */}
                {study.screenshots && study.screenshots.length > 0 && study.mockupType === 'browser' && (
                    <div className="mb-16">
                        <h2 className="text-xs font-mono text-gray-500 mb-6">// SCREENSHOTS</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {study.screenshots.map((src, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                    <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 50vw" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Testimonial */}
                {study.testimonial && (
                    <div className="mb-16">
                        <h2 className="text-xs font-mono text-gray-500 mb-6">// CLIENT FEEDBACK</h2>
                        <blockquote className="border-l-2 border-brand pl-6">
                            <p className="text-gray-300 text-lg italic leading-relaxed">&ldquo;{study.testimonial.quote}&rdquo;</p>
                            <footer className="mt-3">
                                <span className="text-xs font-mono text-brand">{study.testimonial.author}</span>
                                {study.testimonial.role && (
                                    <span className="text-xs font-mono text-gray-600"> — {study.testimonial.role}</span>
                                )}
                            </footer>
                        </blockquote>
                    </div>
                )}

                {/* Related Projects */}
                {relatedStudies.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-xs font-mono text-gray-500 mb-6">// MORE WORK</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {relatedStudies.map(s => (
                                <CaseStudyCard key={s.slug} study={s} />
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="border-t border-white/10 pt-16 text-center">
                    <p className="text-sm font-mono text-gray-500 mb-2">// NEXT STEP</p>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                        {study.cta.text}
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Let&apos;s talk about your project. Fixed price, clear scope, on-time delivery.
                    </p>
                    <Link
                        href={study.cta.href}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Start a Project <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="mt-4">
                        <Link href="/work" className="text-sm font-mono text-gray-500 hover:text-brand transition-colors">
                            ← View all work
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
