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
- Web Development (React, Next.js, TypeScript, Tailwind CSS)
- Full-stack applications (Node.js, PostgreSQL/Prisma, MongoDB)

Writing style:
- ${tone}
- Use first-person perspective ("I built...", "In my experience...")
- Share practical insights from building real projects
- Include code examples when relevant (TypeScript/React preferred)
- Be authentic and genuine - admit challenges and failures
- Focus on solving real problems, not just syntax
- Teach something valuable
- Share your journey and learnings
- Provide actionable takeaways
- Are SEO-friendly but not keyword-stuffed

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
