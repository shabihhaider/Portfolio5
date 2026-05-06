import { Layout, Globe, Bot, Code2, LayoutDashboard, Smartphone } from "lucide-react";

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
            'React / Next.js landing page',
            'WordPress landing page',
            'Multi-section marketing page',
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
            'Theme customisation & setup',
            'Custom business website',
            'WooCommerce store setup',
            'Plugin development',
            'Speed optimisation',
        ],
        techStack: ['WordPress', 'PHP', 'WooCommerce', 'Elementor', 'MySQL'],
        priceRange: { min: 500, max: 3000, unit: 'project' },
        deliveryTime: '1–2 weeks',
        icon: Globe,
        gradient: 'from-blue-500/20 to-cyan-500/10',
    },
    {
        id: 'ai-integrations',
        title: 'AI Integrations',
        description: 'Add AI to your business — chatbots that talk to your customers, content automation, API integrations, and custom workflows using OpenAI and more.',
        features: [
            'AI feature added to existing app',
            'AI-powered web app (full build)',
            'Chatbot / AI assistant',
            'Content automation pipeline',
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
            'Admin dashboard & internal tools',
            'Full-stack web application',
            'API development & integration',
            'SaaS MVP (multi-tenant)',
        ],
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'TypeScript'],
        priceRange: { min: 1500, max: 10000, unit: 'project' },
        deliveryTime: 'Varies by scope',
        icon: Code2,
        gradient: 'from-orange-500/20 to-amber-500/10',
    },
    {
        id: 'saas-dashboard',
        title: 'SaaS / Dashboard Development',
        description: 'Multi-tenant SaaS platforms and admin dashboards built for scale. Role-based access, real-time data.',
        features: [
            'Multi-tenant SaaS platforms',
            'Role-based access control',
            'Real-time data & analytics',
            'Production-ready deployment',
        ],
        techStack: ['Next.js', 'Laravel', 'PostgreSQL', 'Redis'],
        priceRange: { min: 1200, max: 8000, unit: 'project' },
        deliveryTime: '3–6 weeks',
        icon: LayoutDashboard,
        gradient: 'from-cyan-500/20 to-blue-500/10',
    },
    {
        id: 'mobile-apps',
        title: 'Mobile App Development',
        description: 'Cross-platform iOS and Android apps. From concept to App Store in weeks.',
        features: [
            'Simple cross-platform app',
            'iOS & Android from one codebase',
            'Native performance with Flutter/RN',
            'App Store & Play Store submission',
            'Push notifications & offline support',
            'Backend API integration',
        ],
        techStack: ['Flutter', 'React Native', 'iOS', 'Android'],
        priceRange: { min: 1500, max: 5000, unit: 'project' },
        deliveryTime: '4–8 weeks',
        icon: Smartphone,
        gradient: 'from-rose-500/20 to-pink-500/10',
    },
];
