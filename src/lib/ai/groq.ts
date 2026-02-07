import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set');
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface GeneratePostOptions {
    topic: string;
    tone?: string;
    includeCode?: boolean;
    minWords?: number;
    maxWords?: number;
    tags?: string[];
    context?: string;
}

export async function generateBlogPost(options: GeneratePostOptions) {
    const {
        topic,
        tone = 'technical but friendly, like explaining to a peer developer',
        includeCode = true,
        minWords = 800,
        maxWords = 1500,
        tags = [],
        context = '',
    } = options;

    const systemPrompt = `You are Shabih Haider, a full-stack developer and AI enthusiast specializing in:
- AI/Machine Learning (TensorFlow, PyTorch, Computer Vision)
- Web Development (React, Next.js, TypeScript)
- Full-stack applications (Node.js, PostgreSQL, MongoDB)

Writing style:
- ${tone}
- Use first-person perspective
- Share practical insights from building real projects
- Include code examples when relevant
- Be authentic and genuine
- Focus on solving real problems
- Teach something valuable
- Share your journey and learnings
- Provide actionable takeaways
- Are SEO-friendly but not keyword-stuffed

Your portfolio projects include:
1. AI Fashion Stylist - Computer vision app using TensorFlow
2. HydroPak Dashboard - SaaS admin panel with Next.js
3. Unified Social Insights - Analytics platform
4. Online Research Platform - Academic collaboration tool

Write blog posts that feel like a genuine share from your development journey, not a generic tutorial.`;

    const userPrompt = `Write a comprehensive blog post about: ${topic}
${context ? `\nContext/Background:\n${context}` : ''}

Requirements:
- Length: ${minWords}-${maxWords} words
- Include code examples: ${includeCode ? 'Yes' : 'No'}
- Tags to incorporate: ${tags.join(', ') || 'relevant to the topic'}
- Format: MDX (Markdown with JSX support)

Structure:
1. Engaging introduction with a hook
2. Main content with clear sections
3. Code examples (if applicable)
4. Practical takeaways
5. Call-to-action (encouraging readers to try building something)

The post should feel like a genuine share from your development journey, not a generic tutorial.
Return ONLY the MDX content, no preamble.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: 'llama-3.3-70b-versatile', // Fast and high quality
            temperature: 0.7,
            max_tokens: 4000,
        });

        const content = completion.choices[0]?.message?.content || '';

        return {
            content,
            model: 'groq-llama3.3-70b',
            tokensUsed: completion.usage?.total_tokens || 0,
        };
    } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Failed to generate content');
    }
}

export async function generatePostMetadata(content: string, topic: string) {
    const prompt = `Based on this blog post content, generate:
1. A catchy SEO title (60 chars max)
2. Meta description (155 chars max)
3. 5-7 relevant keywords
4. An excerpt (150 chars)

Blog topic: ${topic}

Content preview:
${content.slice(0, 500)}...

Return strictly as JSON object with keys: title, metaDescription, keywords (array), excerpt.
Do not wrap in markdown code blocks.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            response_format: { type: 'json_object' },
        });

        const metadata = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return metadata;
    } catch (error) {
        console.error('Metadata generation error:', error);
        return null;
    }
}

export async function generateSlug(title: string): Promise<string> {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
