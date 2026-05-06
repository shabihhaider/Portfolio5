import type { Metadata } from 'next';
import { caseStudies } from '@/data/case-studies';
import { CaseStudyCard } from '@/components/CaseStudy';
import { getWorkPageSchema } from '@/lib/seo/json-ld';
import { site } from '@/lib/config/site';

export const metadata: Metadata = {
    title: 'Work',
    description: 'Case studies from real client projects — AI platforms, admin dashboards, and landing pages. See the problem, the approach, and the result.',
    alternates: {
        canonical: `${site.url}/work`,
    },
    openGraph: {
        title: 'Our Work | Shabih.',
        description: 'Case studies from real client projects — AI platforms, dashboards, and landing pages. See the problem, the approach, and the result.',
        url: `${site.url}/work`,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Work | Shabih.',
        description: 'Real projects, real results. AI platforms, dashboards, landing pages.',
    },
};

export default function WorkPage() {
    return (
        <main className="min-h-screen bg-background text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getWorkPageSchema()) }}
            />
            <div className="max-w-5xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="mb-16">
                    <span className="text-xs font-mono text-brand tracking-widest">// PORTFOLIO</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mt-3">
                        Our Work
                    </h1>
                    <p className="text-gray-400 mt-4 text-lg max-w-xl">
                        Real projects, real clients, real results. Each case study shows the problem, the approach, and what was delivered.
                    </p>
                </div>

                {/* Grid */}
                {caseStudies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {caseStudies.map(study => (
                            <CaseStudyCard key={study.slug} study={study} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 font-mono">// No projects yet</p>
                )}
            </div>
        </main>
    );
}
