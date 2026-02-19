import Groq from 'groq-sdk';
import { systemPrompt as configSystemPrompt } from '@/lib/config/site';

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

    const sysPrompt = configSystemPrompt + `\n\nAdditional style note: ${tone}`;

    const userPrompt = `Write a practical, actionable blog post about: ${topic}
${context ? `\nResearch context:\n${context}` : ''}

Requirements:
- Length: ${minWords}-${maxWords} words
- Code examples: ${includeCode ? 'Yes — include copy-pasteable snippets with language tags' : 'No'}
- Tags: ${tags.join(', ') || 'relevant to the topic'}
- Format: Standard Markdown ONLY (no JSX, no import/export)

Structure:
1. Hook — open with a specific problem or surprising result (NOT "In today's world...")
2. Why it matters — 2-3 sentences of context
3. Step-by-step solution — the core tutorial with real code
4. Gotchas & real-world notes — things that tripped you up or surprised you
5. Takeaway — ONE clear action item the reader should do next

Rules:
- Every section must teach something the reader can USE immediately
- Code blocks must have language tags (\`\`\`typescript, \`\`\`bash, etc.)
- Do NOT include any UI text like "Copy", navigation elements, or HTML comments
- Do NOT use <Callout>, <Note>, <Tip> or any JSX component tags
- End with a clear call-to-action: what should the reader build/try/install next?

Return ONLY the Markdown content. No preamble, no wrapper fences.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: sysPrompt },
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
