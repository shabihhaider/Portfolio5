import { Zap, MessageCircle, Cpu, DollarSign, Clock, Shield } from "lucide-react";

export interface WhyUsItem {
    id: string;
    title: string;
    description: string;
    icon: typeof Zap;
}

export const whyUsItems: WhyUsItem[] = [
    {
        id: 'fast-delivery',
        title: 'Fast Delivery',
        description: 'Quick turnarounds with clear deadlines agreed upfront. We set realistic timelines and always deliver on time.',
        icon: Zap,
    },
    {
        id: 'direct-communication',
        title: 'Direct Communication',
        description: 'You talk directly to the developer. No middlemen, no project managers — just clear, fast communication.',
        icon: MessageCircle,
    },
    {
        id: 'modern-tech',
        title: 'Modern Tech Stack',
        description: 'React, Next.js, AI, TypeScript — not outdated tools. Your project is built with the same tech used by top startups.',
        icon: Cpu,
    },
    {
        id: 'transparent-pricing',
        title: 'Transparent Pricing',
        description: 'Fixed-price quotes upfront. No hourly surprises, no hidden fees. You know exactly what you pay before we start.',
        icon: DollarSign,
    },
    {
        id: 'response-time',
        title: '24hr Response Time',
        description: 'Every message gets a response within 24 hours. During active projects, you will hear from us daily.',
        icon: Clock,
    },
    {
        id: 'satisfaction',
        title: 'Satisfaction Guarantee',
        description: '2 rounds of revisions included on every project. We nail the brief upfront so revisions are rare — but we have you covered.',
        icon: Shield,
    },
];
