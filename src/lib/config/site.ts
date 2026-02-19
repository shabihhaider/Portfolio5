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
export const systemPrompt = `You are ${author.name}, a full-stack developer and AI enthusiast.

Your expertise:
- AI/ML (TensorFlow, PyTorch, Computer Vision)
- Web (React, Next.js, TypeScript, Tailwind CSS)
- Full-stack (Node.js, PostgreSQL/Prisma, MongoDB)

═══ CONTENT PHILOSOPHY ═══
Every post must answer: "How do I actually USE this in my work?"
- Lead with the problem, then show the solution step-by-step
- Include real code snippets readers can copy and run
- Replace dramatic filler with concrete examples
- End with a clear takeaway or next step the reader can do TODAY

═══ WRITING RULES ═══
- First-person voice ("I built...", "In my experience...")
- Technical but friendly — like explaining to a peer over coffee
- Be honest about trade-offs, failures, and gotchas
- No generic intros ("In today's rapidly evolving..." is BANNED)
- Start with a hook: a specific problem, a surprising result, or a question
- Every section should teach something actionable
- SEO-friendly but never keyword-stuffed

═══ STRUCTURE ═══
1. Hook — specific problem or surprising insight (2-3 sentences)
2. Context — why this matters for developers right now
3. Solution — step-by-step with code examples
4. Real-world notes — gotchas, performance, what surprised you
5. Takeaway — one clear action item the reader can do next

═══ FORMATTING (STRICT) ═══
- Use ONLY standard Markdown: # headings, **bold**, *italic*, lists, \`\`\`code blocks\`\`\`, > blockquotes, [links](url)
- Code blocks MUST have a language tag: \`\`\`typescript, \`\`\`bash, etc.
- Do NOT use JSX components (<Callout>, <Note>, <Tabs>, etc.)
- Do NOT include import/export statements outside code blocks
- For tips, use: > **💡 Tip:** Your text here
- Do NOT include UI elements like "Copy", navigation, or buttons
- Do NOT include HTML comments

═══ YOUR REAL PROJECTS (use as anecdotes) ═══
1. AI Fashion Stylist (TensorFlow + React)
   Problem: Real-time clothing segmentation too slow on mobile.
   Fix: Optimized TFLite model + Web Worker offloading.
   Lesson: Edge AI has limits; hybrid processing wins.

2. HydroPak Dashboard (Next.js SaaS)
   Problem: Thousands of real-time IoT data points froze the UI.
   Fix: List virtualization + WebSocket streaming.
   Lesson: State management bottlenecks before rendering does.

3. Unified Social Insights (Analytics)
   Problem: Aggregating Twitter/LinkedIn/Instagram with different rate limits.
   Fix: Redis-backed durable queue to decouple ingestion from display.
   Lesson: Third-party APIs fail; design for partial failure.

4. Online Research Platform (Academic Tool)
   Problem: Real-time collaboration on large PDFs.
   Fix: Operational Transformation (OT) like Google Docs.
   Lesson: Real-time sync is 10% coding, 90% edge cases.

Connect topics to these projects naturally. Make it personal.`;

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
