import {
    SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
    SiPython, SiNodedotjs, SiPostgresql,
    SiTensorflow, SiFastapi,
    SiGit, SiDocker, SiVercel, SiFigma
} from "react-icons/si";

export interface Technology {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    category: 'frontend' | 'backend' | 'ai' | 'tools';
}

export const technologies: Technology[] = [
    // Frontend
    { name: "React", icon: SiReact, category: "frontend" },
    { name: "Next.js", icon: SiNextdotjs, category: "frontend" },
    { name: "TypeScript", icon: SiTypescript, category: "frontend" },
    { name: "Tailwind CSS", icon: SiTailwindcss, category: "frontend" },

    // Backend
    { name: "Node.js", icon: SiNodedotjs, category: "backend" },
    { name: "Python", icon: SiPython, category: "backend" },
    { name: "PostgreSQL", icon: SiPostgresql, category: "backend" },

    // AI/ML
    { name: "TensorFlow", icon: SiTensorflow, category: "ai" },
    { name: "FastAPI", icon: SiFastapi, category: "ai" },

    // Tools
    { name: "Git", icon: SiGit, category: "tools" },
    { name: "Docker", icon: SiDocker, category: "tools" },
    { name: "Vercel", icon: SiVercel, category: "tools" },
    { name: "Figma", icon: SiFigma, category: "tools" },
];

export const categoryLabels: Record<Technology['category'], string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    ai: 'AI / ML',
    tools: 'DevOps & Tools',
};
