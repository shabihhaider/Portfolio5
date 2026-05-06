export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export const faqItems: FAQItem[] = [
    {
        id: 'services',
        question: 'What services do you offer?',
        answer: 'We offer six services: high-converting landing pages (React/Next.js), WordPress development (themes, plugins, WooCommerce), AI integrations (chatbots, automation, OpenAI), custom web application development, SaaS/dashboard platforms, and mobile app development (Flutter/React Native). Each project is built with modern, production-ready technologies.',
    },
    {
        id: 'pricing',
        question: 'How much does a project cost?',
        answer: 'Landing pages start at $400, WordPress at $500, AI integrations at $800, custom development at $1,500, SaaS/dashboards at $1,200, and mobile apps at $1,500. Every project gets a fixed-price quote upfront — no hourly surprises. We scope your exact requirements before quoting so there are no surprises on either side.',
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
        answer: 'You get direct access to the developer — no middlemen, no project managers adding overhead. We communicate via your preferred channel (email, Slack, or WhatsApp). You will receive daily progress updates and can reach us within 24 hours.',
    },
    {
        id: 'technologies',
        question: 'What technologies do you use?',
        answer: 'Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Python, PostgreSQL, FastAPI. AI: OpenAI, TensorFlow, LangChain. CMS: WordPress, WooCommerce. Deployment: Vercel, Docker. We pick the right tool for each project.',
    },
    {
        id: 'upwork',
        question: 'Can I hire you through Upwork?',
        answer: 'Yes, we are available on Upwork for clients who prefer the platform\'s payment protection and milestone system. Hiring directly through this site is also an option for a faster, more streamlined experience. Same developer, same quality, your choice.',
    },
    {
        id: 'maintenance',
        question: 'Do you offer ongoing maintenance?',
        answer: "We don't offer ongoing maintenance retainers, but we're happy to help with one-off fixes, updates, or improvements on request. Just reach out and we'll scope it together.",
    },
    {
        id: 'payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept payments via Payoneer, bank transfer, and Upwork for clients on that platform. For direct projects, we work with a 50% upfront deposit and 50% on delivery. All payments are handled securely.',
    },
];
