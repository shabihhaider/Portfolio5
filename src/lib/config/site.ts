/**
 * ═══════════════════════════════════════════════════════════
 *  SITE CONFIG — Single source of truth for the entire app
 * ═══════════════════════════════════════════════════════════
 *
 *  Change values here and they propagate everywhere:
 *  layout metadata, blog pages, CTA, OG images, RSS feed,
 *  robots.txt, sitemap, AI prompts, and the generate script.
 */

// ── Identity ──────────────────────────────────────────────
export const author = {
    name: 'Shabih Haider',
    fullName: 'Muhammad Shabih Haider',
    initials: 'SH',
    title: 'Full Stack Developer',
    roles: ['Full-Stack Developer', 'AI Enthusiast', 'Tech Innovator'],
    twitter: '@shabihhaider',
    email: 'shabihhaider191@gmail.com',
    bio: 'Crafting intelligent web experiences with React & AI.',
    social: {
        github: 'https://github.com/shabihhaider',
        linkedin: 'https://www.linkedin.com/in/muhammad-shabih-haider/',
        instagram: 'https://www.instagram.com/muhammadshabihhaider/',
    },
} as const;

// ── Site / URLs ───────────────────────────────────────────
export const site = {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio5-olive.vercel.app',
    name: `${author.name} Portfolio`,
    locale: 'en_US',
    language: 'en-us',
} as const;

// ── SEO / Metadata ────────────────────────────────────────
export const seo = {
    titleDefault: `${author.name} | ${author.title}`,
    titleTemplate: `%s | ${author.name}`,
    description:
        `Portfolio of ${author.name}, a ${author.title} specializing in React, Next.js, AI Integration, and Modern Web Technologies. View my projects and skills.`,
    ogDescription: 'Building the impossible with modern web technologies and AI.',
    keywords: [
        'Full Stack Developer', 'React', 'Next.js', 'Portfolio',
        'Web Development', 'AI', author.name,
    ],
} as const;

// ── Blog ──────────────────────────────────────────────────
export const blog = {
    title: 'Thoughts & Deep Dives',
    description:
        'Writing about full-stack development, AI/ML, and the things I learn building real products.',
    rssTitle: `${author.name} | Digital Lab Notes`,
    rssDescription:
        'Exploring the frontiers of Full Stack development, AI agents, and modern interfaces.',
    revalidateSeconds: 3600,
    featuredBadge: 'Latest',
    emptyTitle: 'No posts yet',
    emptyDescription: 'Check back soon — new content is on the way.',
} as const;

// ── CTA (end of blog posts) ──────────────────────────────
export const cta = {
    heading: 'Build the Future With Me',
    headingHighlight: 'Future',
    description:
        'Need a high-performance, AI-integrated web application? Let\'s turn your concept into a production-ready reality.',
    primaryButton: { text: 'Start a Project', href: '/#contact' },
    secondaryButton: { text: 'View Portfolio', href: '/' },
} as const;

// ── Email Capture / Newsletter ────────────────────────────
export const newsletter = {
    badge: 'NETWORK_UPLINK',
    heading: 'Join the Inner Circle',
    headingHighlight: 'Inner Circle',
    description:
        'Get weekly drops on Full Stack engineering, AI agents, and modern UI design directly to your inbox.',
    placeholder: 'enter_email_address',
    successMessage: 'Subscription confirmed. Welcome aboard!',
    errorMessage: 'Something went wrong. Please try again.',
    systemError: 'System error. Network unreachable.',
} as const;

// ── AI Generation Config ──────────────────────────────────
export const ai = {
    models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'] as string[],
    maxRetries: 3,
    backoffBaseMs: 5000,
    generation: {
        temperature: 0.7,
        maxOutputTokens: 4000,
    },
    metadata: {
        temperature: 0.2,
        maxOutputTokens: 1024,
    },
    defaults: {
        tone: 'technical but friendly, like explaining to a peer developer',
        minWords: 800,
        maxWords: 1500,
    },
    /** Max quality-retry loop attempts in the generate script */
    maxQualityAttempts: 3,
    /** How far in the future to schedule a generated post (ms) */
    schedulingDelayMs: 48 * 60 * 60 * 1000, // 48 hours
} as const;

// ── Default Focus Areas (guide AI topic discovery) ───────
// These are broad themes — the AI uses Google Search to find
// specific trending topics within these areas autonomously.
export const defaultFocusAreas = [
    'AI/Machine Learning',
    'Web Development',
    'Full Stack Engineering',
    'React & Next.js',
    'TypeScript',
    'Developer Tools',
] as const;

// ── System Prompt (AI persona) ────────────────────────────
export const systemPrompt = `You are ${author.name}, a full-stack developer and AI enthusiast specializing in:
- AI/Machine Learning (TensorFlow, PyTorch, Computer Vision)
- Web Development (React, Next.js, TypeScript, Tailwind CSS)
- Full-stack applications (Node.js, PostgreSQL/Prisma, MongoDB)

Writing style:
- Technical but friendly, like explaining to a peer developer
- Use first-person perspective ("I built...", "In my experience...")
- Share practical insights from building real projects
- Include code examples when relevant (TypeScript/React preferred)
- Be authentic and genuine - admit challenges and failures
- Focus on solving real problems, not just syntax
- Teach something valuable
- Share your journey and learnings
- Provide actionable takeaways
- Are SEO-friendly but not keyword-stuffed

IMPORTANT formatting rules:
- Use ONLY standard Markdown: headings (#), bold (**), italic (*), lists (- or 1.), code blocks (\`\`\`), blockquotes (>), links, and images.
- Do NOT use custom JSX components like <Callout>, <Note>, <Tip>, <Warning>, <Alert>, <Tabs>, or any similar tags.
- For callouts or tips, use a blockquote with bold label instead: > **💡 Tip:** Your text here
- Do NOT include import or export statements.

Your real-world portfolio experience to draw anecdotes from:

1. AI Fashion Stylist (TensorFlow + React)
   - Challenge: Real-time clothing segmentation on mobile devices was too slow.
   - Solution: Optimized the TFLite model and moved processing to a Web Worker.
   - Insight: Edge AI has limits; hybrid processing is often the answer.

2. HydroPak Dashboard (Next.js SaaS)
   - Challenge: Handling thousands of real-time IoT sensor data points without freezing the UI.
   - Solution: Implemented virtualization for lists and WebSockets for data streaming.
   - Insight: state management becomes the bottleneck before rendering does.

3. Unified Social Insights (Analytics Platform)
   - Challenge: Aggregating API data from Twitter, LinkedIn, and Instagram with different rate limits.
   - Solution: Built a durable queue system (Redis) to decouple ingestion from display.
   - Insight: Third-party APIs are unreliable; always design for partial failure.

4. Online Research Platform (Academic Tool)
   - Challenge: Implementing real-time collaboration on large PDF documents.
   - Solution: Used Operational Transformation (OT) logic similar to Google Docs.
   - Insight: Real-time syncing is 10% coding and 90% handling edge cases.

Write blog posts that connect the topic to these real experiences. If writing about performance, mention the HydroPak dashboard. If writing about AI, mention the Fashion Stylist model optimization. Make it personal.`;

// ── Branding (OG Image) ──────────────────────────────────
export const ogBranding = {
    bgColor: '#000',
    dotColor: '#333',
    /** Title gradient — matches site brand */
    titleGradient: 'linear-gradient(to right, #CCFF00, #66CC33, #00CC88)',
    tagBg: 'rgba(204, 255, 0, 0.15)',
    tagColor: '#CCFF00',
    tagBorder: 'rgba(204, 255, 0, 0.3)',
    blogName: 'Digital Lab Notes',
    width: 1200,
    height: 630,
} as const;

// ── Tag / Category Mappings (generate script) ─────────────
export const tagMap: Record<string, string[]> = {
    'AI': ['AI/ML', 'Artificial Intelligence'],
    'TensorFlow': ['TensorFlow', 'Machine Learning'],
    'Next.js': ['Next.js', 'React', 'Web Development'],
    'TypeScript': ['TypeScript', 'JavaScript'],
    'MongoDB': ['MongoDB', 'Database'],
    'performance': ['Performance', 'Optimization'],
    'SaaS': ['SaaS', 'Full-Stack'],
};

export const categoryRules: Array<{ keywords: string[]; category: string }> = [
    { keywords: ['AI', 'ML', 'TensorFlow', 'PyTorch'], category: 'AI/Machine Learning' },
    { keywords: ['Next.js', 'React', 'TypeScript'], category: 'Web Development' },
    { keywords: ['MongoDB', 'PostgreSQL', 'Database'], category: 'Backend' },
];

export const defaultCategory = 'General';
