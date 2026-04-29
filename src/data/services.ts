import { Layout, Globe, Bot, Code2 } from "lucide-react";

export interface Service {
    id: string;
    title: string;
    description: string;
    features: string[];
    techStack: string[];
    priceRange: { min: number; max: number; unit: string };
    deliveryTime: string;
    icon: typeof Layout;
    gradient: string;
}

export const services: Service[] = [
    {
        id: 'landing-pages',
        title: 'Landing Pages',
        description: 'High-converting landing pages built with React and Next.js. Pixel-perfect, fast-loading, and designed to turn your visitors into customers.',
        features: [
            'React / Next.js / Tailwind CSS',
            'Mobile-first responsive design',
            'SEO optimized with Core Web Vitals',
            'Contact forms & CTA integration',
            'Deployed on Vercel with analytics',
        ],
        techStack: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
        priceRange: { min: 400, max: 1500, unit: 'project' },
        deliveryTime: '1–2 weeks',
        icon: Layout,
        gradient: 'from-brand/20 to-emerald-500/10',
    },
    {
        id: 'wordpress',
        title: 'WordPress Development',
        description: 'Theme customization, plugin fixes, WooCommerce setup, and speed optimization. Fast turnaround on fixes, reliable builds for new sites.',
        features: [
            'Theme customization & fixes',
            'Plugin installation & troubleshooting',
            'WooCommerce store setup',
            'Speed optimization & security',
            'Ongoing maintenance available',
        ],
        techStack: ['WordPress', 'PHP', 'WooCommerce', 'Elementor', 'MySQL'],
        priceRange: { min: 50, max: 500, unit: 'project' },
        deliveryTime: '1–5 days',
        icon: Globe,
        gradient: 'from-blue-500/20 to-cyan-500/10',
    },
    {
        id: 'ai-integrations',
        title: 'AI Integrations',
        description: 'Add AI to your business — chatbots that talk to your customers, content automation, API integrations, and custom workflows using OpenAI and more.',
        features: [
            'Custom chatbot development',
            'OpenAI / Claude API integration',
            'Content automation pipelines',
            'AI-powered search & recommendations',
            'Business process automation',
        ],
        techStack: ['OpenAI', 'Python', 'Node.js', 'FastAPI', 'LangChain'],
        priceRange: { min: 800, max: 4000, unit: 'project' },
        deliveryTime: '2–3 weeks',
        icon: Bot,
        gradient: 'from-purple-500/20 to-fuchsia-500/10',
    },
    {
        id: 'custom-dev',
        title: 'Custom Development',
        description: 'Dashboards, web applications, APIs, and tools built to your exact requirements. We scope it together, then we build it right.',
        features: [
            'Web applications & dashboards',
            'Database design & API development',
            'Authentication & user management',
            'Third-party integrations',
            'Production deployment & handoff',
        ],
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'TypeScript'],
        priceRange: { min: 1500, max: 10000, unit: 'project' },
        deliveryTime: 'Varies by scope',
        icon: Code2,
        gradient: 'from-orange-500/20 to-amber-500/10',
    },
];
