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
        date: "Jan 2026",
        commitHash: "#f4a2c9",
        title: "AI Fashion Stylist",
        description: "Building intelligent wardrobe recommendation system",
        details: [
            "Developing computer vision models for clothing classification",
            "Training TensorFlow models on 50K+ fashion images",
            "Implementing personalized styling algorithms"
        ],
        tags: ["AI/ML", "Production", "Innovation"],
        icon: "🚀",
        category: "project"
    },
    {
        id: "3",
        date: "Sep 2025",
        commitHash: "#a7d3e5",
        title: "HydroPak Dashboard Launch",
        description: "Deployed full-stack SaaS platform for distribution management",
        details: [
            "Built real-time analytics and inventory tracking",
            "Automated order processing workflows",
            "Successfully managing live customer operations"
        ],
        tags: ["Next.js", "PostgreSQL", "Production"],
        icon: "🚀",
        category: "project"
    },
    {
        id: "2",
        date: "2024 - Present",
        commitHash: "#b8e2f1",
        title: "BS Computer Science",
        description: "Specializing in AI & Web Systems",
        details: [
            "Focus on Machine Learning and Deep Learning",
            "Advanced Full-Stack Development",
            "Lahore, Pakistan"
        ],
        tags: ["Education", "AI", "Web Dev"],
        icon: "🎓",
        category: "education"
    },
    {
        id: "1",
        date: "Early 2024",
        commitHash: "#c9f2d4",
        title: "The Spark",
        description: "Journey began with C++ and algorithmic thinking",
        details: [
            "First 'Hello World' in C++",
            "Discovered passion for problem-solving",
            "Built foundation in computer science fundamentals"
        ],
        tags: ["Learning", "Foundations"],
        icon: "💡",
        category: "learning"
    }
];
