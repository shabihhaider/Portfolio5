import { Search, Palette, Code, Rocket } from "lucide-react";

export interface ProcessStep {
    id: number;
    title: string;
    description: string;
    details: string[];
    icon: typeof Search;
    duration: string;
}

export const processSteps: ProcessStep[] = [
    {
        id: 1,
        title: 'Discovery',
        description: 'We discuss your goals, requirements, and budget to define exactly what you need and agree on a timeline.',
        details: [
            'Requirements gathering',
            'Scope & deliverables definition',
            'Timeline & budget agreement',
        ],
        icon: Search,
        duration: 'Phase 1',
    },
    {
        id: 2,
        title: 'Design',
        description: 'Wireframes and mockups tailored to your brand. You review and approve before any code is written.',
        details: [
            'UI/UX wireframing',
            'Responsive layout planning',
            'Client review & approval',
        ],
        icon: Palette,
        duration: 'Phase 2',
    },
    {
        id: 3,
        title: 'Develop',
        description: 'Clean, production-ready code built with modern technologies. You get daily progress updates throughout.',
        details: [
            'Frontend & backend build',
            'API & database integration',
            'Testing & quality assurance',
        ],
        icon: Code,
        duration: 'Phase 3',
    },
    {
        id: 4,
        title: 'Deploy',
        description: 'Launch to production with performance optimization and full handoff. Your project is live.',
        details: [
            'Production deployment',
            'Performance optimization',
            'Documentation & handoff',
        ],
        icon: Rocket,
        duration: 'Phase 4',
    },
];
