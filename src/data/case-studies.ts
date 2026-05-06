export interface CaseStudy {
    slug: string;
    title: string;
    tagline: string;
    category: string;
    thumbnail?: string;
    liveUrl?: string;
    mockupType: 'browser' | 'phone';
    livePreview?: boolean; // set false if site blocks iframes
    screenshotSrc?: string; // static screenshot for sites that block iframes
    gradient?: string;
    overview: string;
    problem: string;
    solution: string;
    metrics?: { value: string; label: string }[];
    screenshots?: string[];
    techStack?: string[];
    deliverables?: string[];
    duration?: string;
    testimonial?: {
        quote: string;
        author: string;
        role?: string;
    };
    cta: { text: string; href: string };
}

export const caseStudies: CaseStudy[] = [
    {
        slug: 'outfitai',
        title: 'OutfitAI',
        tagline: 'AI-powered outfit recommendations from your own wardrobe',
        category: 'AI / ML',
        liveUrl: 'https://drssl.app',
        mockupType: 'browser',
        livePreview: false,
        screenshotSrc: '/projects/outfitai/screenshot.png',
        gradient: 'from-purple-500/10 to-brand/10',
        overview:
            'OutfitAI is a fashion intelligence platform that analyzes your wardrobe and generates personalized outfit recommendations using a two-model AI pipeline.',
        problem:
            'People own more clothes than they wear. Without a system to surface compatible combinations, most of a wardrobe goes unused. Existing fashion apps rely on pre-built outfit databases — not your actual clothes.',
        solution:
            'We trained two models: EfficientNet-B0 classifies garment types with 89% accuracy, and a custom MLP pairwise scorer rates outfit compatibility (AUC-ROC 0.814). CLIP embeddings provide visual similarity search. The result is a system that works with any wardrobe.',
        metrics: [
            { value: '89%', label: 'Model 1 Accuracy' },
            { value: '81.4%', label: 'Model 2 AUC-ROC' },
            { value: '117K+', label: 'Training Images' },
        ],
        techStack: ['Python', 'TensorFlow', 'EfficientNet-B0', 'CLIP', 'FastAPI', 'Next.js'],
        deliverables: [
            'Garment Classifier (89% accuracy)',
            'Outfit Compatibility Scorer (AUC-ROC 0.814)',
            'Visual Similarity Search',
            'Web Interface',
        ],
        cta: { text: 'Want AI in your product?', href: '/#contact' },
    },
    {
        slug: 'hydropak',
        title: 'HydroPak Dashboard',
        tagline: 'Admin panel replacing a manual spreadsheet workflow',
        category: 'Dashboard',
        liveUrl: 'https://hydropak.vercel.app/dashboard',
        mockupType: 'browser',
        gradient: 'from-cyan-500/10 to-blue-500/10',
        overview:
            'HydroPak is a water bottle distribution business that was managing inventory, orders, and sales entirely through spreadsheets. We built a centralised admin dashboard to replace that workflow.',
        problem:
            'Manual spreadsheets meant no real-time visibility into stock levels, no order tracking, and no way to spot sales trends without hours of data entry. Errors were common and reporting took a full day each week.',
        solution:
            'A full-stack dashboard built with Next.js and PostgreSQL. The admin can manage inventory, process orders, view sales analytics, and export reports — all from a single interface. Deployed on Vercel with role-based access.',
        metrics: [
            { value: '100%', label: 'Spreadsheet Replaced' },
            { value: 'Real-time', label: 'Inventory Tracking' },
            { value: '1 week', label: 'Delivered In' },
        ],
        techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'Vercel'],
        deliverables: [
            'Inventory Management',
            'Order Processing',
            'Sales Analytics',
            'Role-based Access',
            'CSV Export',
        ],
        cta: { text: 'Need a custom dashboard?', href: '/#contact' },
    },
    {
        slug: 'salford-landing',
        title: 'Salford & Co.',
        tagline: 'Rooted in Nature, Made for You',
        category: 'Landing Page',
        liveUrl: 'https://landing-page-salford.vercel.app',
        mockupType: 'browser',
        gradient: 'from-emerald-500/10 to-brand/10',
        overview:
            'Salford & Co. is a nature-inspired brand with handcrafted organic products. They needed a landing page that reflected their values — clean, minimal, and grounded — while driving product discovery.',
        problem:
            'The brand had no digital presence. Products were sold through word-of-mouth only, with no way to communicate their story, showcase their range, or convert online visitors into buyers.',
        solution:
            'A fast, fully responsive landing page built with React and deployed on Vercel. Earthy tones and organic typography mirror the brand identity, with smooth scroll animations and a clear conversion path from hero to CTA.',
        metrics: [
            { value: '< 1s', label: 'Time to Interactive' },
            { value: '98', label: 'Lighthouse Score' },
            { value: '1 week', label: 'Delivered In' },
        ],
        techStack: ['React', 'Tailwind CSS', 'Vercel'],
        deliverables: [
            'Responsive Landing Page',
            'Scroll Animations',
            'Mobile-first Design',
            'Fast Load Performance',
        ],
        cta: { text: 'Need a landing page?', href: '/#contact' },
    },
];
