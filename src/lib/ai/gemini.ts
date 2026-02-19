import { GoogleGenerativeAI } from '@google/generative-ai';
import { ai, systemPrompt } from '@/lib/config/site';

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface GeneratePostOptions {
    topic: string;
    tone?: string;
    includeCode?: boolean;
    minWords?: number;
    maxWords?: number;
    tags?: string[];
    context?: string;
}

const SYSTEM_PROMPT = systemPrompt;

// Models to try in order (fallback chain — each has separate quota)
const MODELS = ai.models;

async function callGeminiWithRetry(
    prompt: string,
    systemInstruction: string,
    options: { temperature?: number; maxOutputTokens?: number; jsonMode?: boolean } = {},
    maxRetries = ai.maxRetries
): Promise<{ text: string; model: string }> {
    let lastError: Error | null = null;

    for (const modelName of MODELS) {
        console.log(`🔄 Trying model: ${modelName}`);

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction,
            generationConfig: {
                temperature: options.temperature ?? ai.generation.temperature,
                maxOutputTokens: options.maxOutputTokens ?? ai.generation.maxOutputTokens,
                ...(options.jsonMode ? { responseMimeType: 'application/json' } : {}),
            },
        });

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                if (!text) throw new Error('Empty response from Gemini');
                console.log(`✅ Success with model: ${modelName}`);
                return { text, model: modelName };
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                const msg = lastError.message;

                // If quota is 0 (not enabled/available), skip to next model immediately
                if (msg.includes('limit: 0') || msg.includes('429')) {
                    console.warn(`⚠️ Model ${modelName} quota exhausted, trying next model...`);
                    break; // Break retry loop, try next model
                }

                console.error(`Gemini attempt ${attempt}/${maxRetries} (${modelName}) failed:`, msg);

                if (attempt < maxRetries) {
                    const suggestedMatch = msg.match(/retry in ([\d.]+)s/i);
                    const suggestedDelay = suggestedMatch ? Math.ceil(parseFloat(suggestedMatch[1])) * 1000 : 0;
                    const backoffDelay = Math.pow(2, attempt) * ai.backoffBaseMs;
                    const delay = Math.max(suggestedDelay, backoffDelay);
                    console.log(`⏳ Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }

    throw new Error(`Gemini API failed across all models (${MODELS.join(', ')}): ${lastError?.message}`);
}

export async function generateBlogPost(options: GeneratePostOptions) {
    const {
        topic,
        tone = ai.defaults.tone,
        includeCode = true,
        minWords = ai.defaults.minWords,
        maxWords = ai.defaults.maxWords,
        tags = [],
        context = '',
    } = options;

    const userPrompt = `Write a practical, actionable blog post about: ${topic}
${context ? `\nResearch context:\n${context}` : ''}

Requirements:
- Length: ${minWords}-${maxWords} words
- Code examples: ${includeCode ? 'Yes — include copy-pasteable snippets with language tags' : 'No'}
- Tags: ${tags.join(', ') || 'relevant to the topic'}
- Format: Standard Markdown ONLY (no JSX, no import/export)
- Tone: ${tone}

Structure:
1. Hook — open with a specific problem or surprising result (NOT "In today's world...")
2. Why it matters — 2-3 sentences of context
3. Step-by-step solution — the core tutorial with real code
4. Gotchas & real-world notes — things that tripped you up or surprised you
5. Takeaway — ONE clear action item the reader should do next

Rules:
- Every section must teach something the reader can USE immediately
- Replace filler phrases with concrete examples
- Code blocks must have language tags (\`\`\`typescript, \`\`\`bash, etc.)
- Do NOT include any UI text like "Copy", navigation elements, or HTML comments
- Do NOT use <Callout>, <Note>, <Tip> or any JSX component tags
- End with a clear call-to-action: what should the reader build/try/install next?

Return ONLY the Markdown content. No preamble, no wrapper fences.`;

    const result = await callGeminiWithRetry(userPrompt, SYSTEM_PROMPT, {
        temperature: ai.generation.temperature,
        maxOutputTokens: ai.generation.maxOutputTokens,
    });

    return {
        content: result.text,
        model: result.model,
        tokensUsed: 0,
    };
}

export async function generatePostMetadata(content: string, topic: string) {
    const prompt = `Generate SEO metadata for a blog post about "${topic}".

Return a JSON object with exactly these keys:
- "title": catchy SEO title, max 60 characters
- "metaDescription": meta description, max 155 characters  
- "keywords": array of 5 relevant keywords as strings
- "excerpt": short excerpt, max 150 characters

Content starts with:
${content.slice(0, 300)}`;

    try {
        const result = await callGeminiWithRetry(prompt, 'Return ONLY valid JSON with double-quoted string keys: title, metaDescription, keywords, excerpt. No markdown fences, no explanation.', {
            temperature: ai.metadata.temperature,
            maxOutputTokens: ai.metadata.maxOutputTokens,
            jsonMode: true,
        });

        // Aggressively clean LLM JSON output
        let cleaned = result.text
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        // Extract JSON object if surrounded by extra text
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleaned = jsonMatch[0];
        }

        // Fix common LLM issues
        cleaned = cleaned
            .replace(/[\x00-\x1F\x7F]/g, ' ')  // control chars → space
            .replace(/,\s*([}\]])/g, '$1');       // trailing commas

        const metadata = JSON.parse(cleaned);

        // Validate shape
        if (typeof metadata.title !== 'string') throw new Error('Invalid title');

        return {
            title: String(metadata.title || '').slice(0, 60),
            metaDescription: String(metadata.metaDescription || '').slice(0, 155),
            keywords: Array.isArray(metadata.keywords) ? metadata.keywords.map(String) : [],
            excerpt: String(metadata.excerpt || '').slice(0, 150),
        };
    } catch (error) {
        console.error('Metadata generation error:', error);

        // Fallback: extract metadata from content directly
        console.log('📝 Using fallback metadata extraction...');
        const lines = content.split('\n').filter(l => l.trim());
        const titleLine = lines.find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || topic;
        const plainText = content.replace(/[#*`\n\r]/g, ' ').replace(/\s+/g, ' ').trim();

        return {
            title: titleLine.slice(0, 60),
            metaDescription: plainText.slice(0, 155),
            keywords: topic.split(/[\s,]+/).filter(w => w.length > 3).slice(0, 5),
            excerpt: plainText.slice(0, 150),
        };
    }
}

export async function generateSlug(title: string): Promise<string> {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
