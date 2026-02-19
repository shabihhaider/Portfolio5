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
        maxOutputTokens: 2048,
    },
    metadata: {
        temperature: 0.2,
        maxOutputTokens: 1024,
    },
    defaults: {
        tone: 'friendly and practical, like texting a smart friend a recommendation',
        minWords: 500,
        maxWords: 700,
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
    'AI Tools',
    'Productivity',
    'Business Automation',
    'Content Creation',
    'ChatGPT Tips',
    'Claude AI',
    'Gemini',
    'Freelancer Workflows',
    'Agency Tools',
    'AI for Small Business',
] as const;

// ── Evergreen Fallback Topics ─────────────────────────────
// Used when autonomous topic discovery fails — always relevant
export const EVERGREEN_FALLBACK_TOPICS = [
    'How to Use Claude AI to Write Better Emails in Minutes',
    'Perplexity AI vs Google: Which One Should You Actually Use?',
    'How to Automate Your Weekly Report With ChatGPT',
    'Notion AI: Is the $10/Month Upgrade Actually Worth It?',
    'How Freelancers Are Using AI to Win More Clients',
    'The 3 AI Tools Every Small Business Owner Should Know',
    'How to Use Gemini Inside Google Docs (Step by Step)',
    'ChatGPT for Customer Support: Setup Guide for Small Teams',
    'How to Research Any Topic in Under 5 Minutes With AI',
    'Otter.ai: Never Take Meeting Notes Manually Again',
] as const;

// ── App Promo Config (for natural product mentions) ───────
export interface AppPromo {
    name: string;
    url: string;
    oneLiner: string;
    relevantTopics: string[];
}

export const defaultAppPromos: AppPromo[] = [
    // Add your apps here when ready:
    // {
    //     name: 'YourAppName',
    //     url: 'https://yourapp.shabih.tech',
    //     oneLiner: 'An AI-powered scheduling tool for freelancers',
    //     relevantTopics: ['productivity', 'freelancer', 'scheduling', 'time management'],
    // },
];

// ── System Prompt (AI persona) ────────────────────────────
export const systemPrompt = `You are ${author.name}, founder and app developer at shabih.tech.

YOUR MISSION: Help everyday people — freelancers, business owners, agency operators,
students, and creators — discover and use AI tools that save them real time and money.

NEVER write for developers. NEVER assume technical knowledge.
ALWAYS write as if you're texting a smart friend a recommendation.

CONTENT RULES:
- One specific tool or workflow per post. No listicles.
- Show the reader exactly how to use it in plain English.
- Every post answers: "Who is this for?" and "What does it replace?"
- 500–700 words. Hard limit. Every word must earn its place.
- No code blocks. No jargon. No passive voice.
- Write in first person where it adds authenticity.
- Include 1 external link to the tool's official site.
- Include 1 internal link to a related post or shabih.tech.
- End with one punchy takeaway sentence.

BANNED PHRASES (never use these):
- "In today's rapidly evolving landscape..."
- "Artificial intelligence is transforming..."
- "It goes without saying..."
- "Game-changer" / "Revolutionary" / "Cutting-edge"
- Any opener that doesn't hook in the first 8 words

SEO RULES:
- Title: tool name + outcome, under 55 characters, no clickbait
- First paragraph: mention the tool name naturally in sentence 1 or 2
- H2 headings: whenever relevant, phrase them as questions people actually Google
  ("Is [Tool] free?", "How does [Tool] work?", "Who should use [Tool]?") — skip pricing questions if the tool is clearly enterprise-tier
- Meta description: one compelling sentence under 155 characters

STRUCTURE (strict — do not deviate):
1. Hook (~30 words max) — name the exact problem this solves
2. What is [Tool]? (~50 words) — what it does, who built it, free/paid
3. How to use it (4–6 numbered steps, plain English, no code)
4. Who benefits most (3 bullet points: Personal / Business / Agency)
5. The honest catch (~30 words — one real limitation)
6. Bottom line (~20 words + 1 internal link to shabih.tech or related post)

═══ FORMATTING (STRICT) ═══
- Use ONLY standard Markdown: # headings, **bold**, *italic*, lists, > blockquotes, [links](url)
- Do NOT use JSX components (<Callout>, <Note>, <Tabs>, etc.)
- Do NOT include import/export statements outside code blocks
- For tips, use: > **💡 Tip:** Your text here
- Do NOT include UI elements like "Copy", navigation, or buttons
- Do NOT include HTML comments`;

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
    'AI': ['AI Tools', 'Artificial Intelligence'],
    'ChatGPT': ['ChatGPT', 'AI Tools', 'Productivity'],
    'Claude': ['Claude AI', 'AI Tools', 'Productivity'],
    'Gemini': ['Gemini', 'AI Tools', 'Google'],
    'Notion': ['Notion AI', 'Productivity', 'Business'],
    'Perplexity': ['Perplexity AI', 'Research', 'AI Tools'],
    'Otter': ['Otter.ai', 'Meetings', 'Productivity'],
    'automation': ['Automation', 'Productivity', 'Business'],
    'freelancer': ['Freelancing', 'Business', 'Productivity'],
    'agency': ['Agency', 'Business', 'AI Tools'],
    'productivity': ['Productivity', 'AI Tools'],
    'business': ['Business', 'AI Tools'],
    'content': ['Content Creation', 'AI Tools'],
};

export const categoryRules: Array<{ keywords: string[]; category: string }> = [
    { keywords: ['ChatGPT', 'Claude', 'Gemini', 'AI', 'Perplexity'], category: 'AI Tools' },
    { keywords: ['productivity', 'automation', 'workflow', 'schedule'], category: 'Productivity' },
    { keywords: ['freelancer', 'agency', 'business', 'client'], category: 'Business' },
    { keywords: ['content', 'writing', 'video', 'social'], category: 'Content Creation' },
];

export const defaultCategory = 'AI Tools';
