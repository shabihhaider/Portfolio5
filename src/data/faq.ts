export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export const faqItems: FAQItem[] = [
    {
        id: 'services',
        question: 'What services do you offer?',
        answer: 'We specialize in four core areas: high-converting landing pages (React/Next.js), WordPress development (themes, plugins, WooCommerce), AI integrations (chatbots, automation, OpenAI), and custom web application development. Each project is built with modern, production-ready technologies.',
    },
    {
        id: 'pricing',
        question: 'How much does a project cost?',
        answer: 'Landing pages start at $400, WordPress projects at $50, AI integrations at $800, and custom development at $1,500+. Every project gets a fixed-price quote upfront — no hourly surprises. We discuss your exact requirements and scope before quoting so there are no surprises on either side.',
    },
    {
        id: 'timeline',
        question: 'How fast can you deliver?',
        answer: 'Landing pages typically take 1–2 weeks. WordPress fixes can be done in 1–5 days depending on complexity. AI integrations take 2–3 weeks. Custom development timelines vary by scope — we agree on a realistic timeline before starting and keep you updated daily.',
    },
    {
        id: 'process',
        question: 'What does your process look like?',
        answer: 'Every project follows four steps: Discovery (we define requirements), Design (wireframes and approval), Development (building with daily updates), and Deployment (launch with full handoff). You stay informed at every stage.',
    },
    {
        id: 'revisions',
        question: 'How do revisions work?',
        answer: 'Every project includes 2 rounds of revisions. We nail the brief upfront so revisions are rare — but those 2 rounds ensure the result matches your vision. Additional revisions beyond that can be arranged at a small fee.',
    },
    {
        id: 'communication',
        question: 'How do we communicate during a project?',
        answer: 'You get direct access to the developer — no middlemen, no project managers adding overhead. We communicate via your preferred channel (email, Slack, WhatsApp, Upwork). You will receive daily progress updates and can reach us within 24 hours.',
    },
    {
        id: 'technologies',
        question: 'What technologies do you use?',
        answer: 'Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Python, PostgreSQL, FastAPI. AI: OpenAI, TensorFlow, LangChain. CMS: WordPress, WooCommerce. Deployment: Vercel, Docker. We pick the right tool for each project.',
    },
    {
        id: 'upwork',
        question: 'Can I hire you through Upwork?',
        answer: 'Yes, we are available on Upwork for clients who prefer the platform\'s payment protection and milestone system. You can also hire us directly through this website for a more streamlined experience. Same quality, same developer, your choice of platform.',
    },
    {
        id: 'maintenance',
        question: 'Do you offer ongoing maintenance?',
        answer: 'Yes. After delivery, we offer maintenance packages for bug fixes, updates, and new features. Many clients continue working with us on a monthly basis. We also provide documentation so you can manage things independently if you prefer.',
    },
    {
        id: 'payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept payments via Upwork (milestone-based), Payoneer, and bank transfer. For direct projects, we typically work with a 50% upfront deposit and 50% on delivery. All payments are handled securely.',
    },
];
