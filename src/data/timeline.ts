export interface TimelineEvent {
    id: string;
    date: string;
    commitHash: string;
    title: string;
    description: string;
    details: string[];
    tags: string[];
    icon: '🎓' | '🚀' | '💡' | '🏆';
    category: 'education' | 'project' | 'learning' | 'achievement';
}

export const timelineEvents: TimelineEvent[] = [
    {
        id: "4",
        date: "2026",
        commitHash: "#f4a2c9",
        title: "Agency Launch",
        description: "Founded Shabih. — a web development and AI integration agency serving clients worldwide",
        details: [
            "Launched agency offering landing pages, WordPress, and AI services",
            "Open for clients on Upwork and direct inquiries",
            "Delivering production-ready projects with fast turnaround"
        ],
        tags: ["Agency", "Launch", "Open for Work"],
        icon: "🏆",
        category: "achievement"
    },
    {
        id: "3",
        date: "2025",
        commitHash: "#a7d3e5",
        title: "Production Projects",
        description: "Built and deployed multiple production-grade applications with real users",
        details: [
            "HydroPak — full-stack SaaS dashboard for distribution management",
            "AI Fashion Stylist — deep learning wardrobe recommendation system",
            "Unified Social Insights — analytics platform with AI sentiment analysis"
        ],
        tags: ["Next.js", "AI/ML", "Production"],
        icon: "🚀",
        category: "project"
    },
    {
        id: "2",
        date: "2024 – Present",
        commitHash: "#b8e2f1",
        title: "Full-Stack Mastery",
        description: "Expanded expertise across frontend, backend, AI, and WordPress development",
        details: [
            "Frontend: React, Next.js, TypeScript, Tailwind CSS",
            "Backend: Node.js, Python, PostgreSQL, FastAPI",
            "AI/ML: TensorFlow, OpenCV, OpenAI integrations"
        ],
        tags: ["Full-Stack", "AI", "WordPress"],
        icon: "💡",
        category: "learning"
    },
    {
        id: "1",
        date: "2024",
        commitHash: "#c9f2d4",
        title: "The Foundation",
        description: "Started BS Computer Science and began building with modern web technologies",
        details: [
            "BS Computer Science at university in Lahore, Pakistan",
            "First production project built and deployed",
            "Developed strong foundation in algorithms and system design"
        ],
        tags: ["Education", "Foundations"],
        icon: "🎓",
        category: "education"
    }
];
