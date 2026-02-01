import {
    SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
    SiPython, SiNodedotjs, SiPostgresql, SiLaravel,
    SiTensorflow, SiOpencv, SiFastapi, SiPytorch,
    SiGit, SiDocker, SiFigma, SiVercel
} from "react-icons/si";

export interface Skill {
    id: number;
    symbol: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    category: 'frontend' | 'backend' | 'ai' | 'tools';
    proficiency: number; // 0-100
    relatedSkills?: string[];
}

export const skills: Skill[] = [
    // Frontend
    { id: 1, symbol: "Re", name: "React", icon: SiReact, category: "frontend", proficiency: 95 },
    { id: 2, symbol: "Nx", name: "Next.js", icon: SiNextdotjs, category: "frontend", proficiency: 90 },
    { id: 3, symbol: "Ts", name: "TypeScript", icon: SiTypescript, category: "frontend", proficiency: 88 },
    { id: 4, symbol: "Tw", name: "TailwindCSS", icon: SiTailwindcss, category: "frontend", proficiency: 92 },

    // Backend
    { id: 5, symbol: "Py", name: "Python", icon: SiPython, category: "backend", proficiency: 90 },
    { id: 6, symbol: "Nd", name: "Node.js", icon: SiNodedotjs, category: "backend", proficiency: 87 },
    { id: 7, symbol: "Pg", name: "PostgreSQL", icon: SiPostgresql, category: "backend", proficiency: 85 },
    { id: 8, symbol: "La", name: "Laravel", icon: SiLaravel, category: "backend", proficiency: 82 },

    // AI/ML
    { id: 9, symbol: "Tf", name: "TensorFlow", icon: SiTensorflow, category: "ai", proficiency: 88 },
    { id: 10, symbol: "Cv", name: "OpenCV", icon: SiOpencv, category: "ai", proficiency: 85 },
    { id: 11, symbol: "Fa", name: "FastAPI", icon: SiFastapi, category: "ai", proficiency: 83 },
    { id: 12, symbol: "Pt", name: "PyTorch", icon: SiPytorch, category: "ai", proficiency: 80 },

    // Tools
    { id: 13, symbol: "Gi", name: "Git", icon: SiGit, category: "tools", proficiency: 95 },
    { id: 14, symbol: "Dk", name: "Docker", icon: SiDocker, category: "tools", proficiency: 78 },
    { id: 15, symbol: "Fi", name: "Figma", icon: SiFigma, category: "tools", proficiency: 85 },
    { id: 16, symbol: "Vr", name: "Vercel", icon: SiVercel, category: "tools", proficiency: 98 },
];

export const categoryColors = {
    frontend: {
        bg: "from-green-500/10 to-emerald-500/10",
        border: "border-green-500/30",
        text: "text-green-400",
        glow: "rgba(16, 185, 129, 0.4)", // emerald-500
        badge: "FE"
    },
    backend: {
        bg: "from-blue-500/10 to-cyan-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        glow: "rgba(59, 130, 246, 0.4)", // blue-500
        badge: "BE"
    },
    ai: {
        bg: "from-purple-500/10 to-fuchsia-500/10",
        border: "border-purple-500/30",
        text: "text-purple-400",
        glow: "rgba(168, 85, 247, 0.4)", // purple-500
        badge: "AI"
    },
    tools: {
        bg: "from-cyan-500/10 to-teal-500/10",
        border: "border-cyan-500/30",
        text: "text-cyan-400",
        glow: "rgba(6, 182, 212, 0.4)", // cyan-500
        badge: "TL"
    }
};
