import { GoogleGenerativeAI } from '@google/generative-ai';
import { ai, systemPrompt, defaultAppPromos, type AppPromo } from '@/lib/config/site';

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface GeneratePostOptions {
    topic: string;
    tone?: string;
    includeSetupSteps?: boolean;
    minWords?: number;
    maxWords?: number;
    tags?: string[];
    context?: string;
    internalLink?: string;
    appPromos?: AppPromo[];
    sponsorEnabled?: boolean;
    sponsorText?: string;
    sponsorLink?: string;
}

export interface SinglePassResult {
    seo_title: string;
    meta_description: string;
    slug: string;
    tags: string[];
    post_body: string;
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

/**
 * Single-pass generation: produces metadata + body in one JSON call.
 * This replaces the old generateBlogPost() + generatePostMetadata() two-call approach.
 */
export async function generateBlogPost(options: GeneratePostOptions): Promise<{
    content: string;
    metadata: SinglePassResult;
    model: string;
}> {
    const {
        topic,
        tone = ai.defaults.tone,
        includeSetupSteps = true,
        minWords = ai.defaults.minWords,
        maxWords = ai.defaults.maxWords,
        tags = [],
        context = '',
        internalLink = 'https://shabih.tech',
        appPromos = defaultAppPromos,
        sponsorEnabled = false,
        sponsorText = '',
        sponsorLink = '',
    } = options;

    // Find relevant app promo if any
    const topicLower = topic.toLowerCase();
    const relevantPromo = appPromos.find(p =>
        p.relevantTopics.some(t => topicLower.includes(t.toLowerCase()))
    );

    const promoInstruction = relevantPromo
        ? `\n\nAPP MENTION (include naturally, NOT as an ad):\nMention "${relevantPromo.name}" (${relevantPromo.url}) — ${relevantPromo.oneLiner}. Work it in like a friend's recommendation, e.g. "If you're already using AI for [context], check out ${relevantPromo.name} — I built it for [audience]."`
        : '';

    const sponsorInstruction = sponsorEnabled && sponsorText
        ? `\n\nSPONSOR (insert after section 3 — "How to use it"):\n> **Sponsored:** ${sponsorText}${sponsorLink ? ` [Learn more](${sponsorLink})` : ''}`
        : '';

    const userPrompt = `Write a practical AI tool guide about: ${topic}
${context ? `\nResearch context:\n${context}` : ''}

REQUIREMENTS:
- Length: ${minWords}-${maxWords} words. Do NOT exceed ${maxWords}. Every word must earn its place.
- Setup steps: ${includeSetupSteps ? 'Yes — 4-6 numbered steps in plain English, no code' : 'Minimal'}
- Tone: ${tone}
- Include 1 internal link to ${internalLink} (natural anchor text, not "click here")
- Include 1 external link to the tool's official website
- Tags for context: ${tags.join(', ') || 'relevant to the topic'}
${promoInstruction}${sponsorInstruction}

STRUCTURE (strict — do not deviate):
1. Hook (~30 words max) — name the exact problem this solves
2. What is [Tool]? (~50 words) — what it does, who built it, free/paid
3. How to use it (4–6 numbered steps, plain English, no code)
4. Who benefits most (3 bullet points: Personal / Business / Agency)
5. The honest catch (~30 words — one real limitation)
6. Bottom line (~20 words + internal link)

FORMATTING:
- Standard Markdown only: # headings, **bold**, *italic*, lists, > blockquotes, [links](url)
- No code blocks, no JSX, no import/export, no UI elements
- H2 headings phrased as questions people actually Google, when relevant

RETURN FORMAT — Return ONLY a valid JSON object with these exact keys:
{
  "seo_title": "Tool Name: Outcome in Under 55 Chars",
  "meta_description": "One compelling sentence under 155 chars, includes tool name, does NOT start with the title",
  "slug": "lowercase-hyphen-slug-under-60-chars",
  "tags": ["5 specific tags", "not generic"],
  "post_body": "# Title\\n\\nFull post content in markdown..."
}

CRITICAL: Return ONLY the JSON object. No markdown fences, no explanation, no preamble.`;

    const result = await callGeminiWithRetry(userPrompt, SYSTEM_PROMPT, {
        temperature: ai.generation.temperature,
        maxOutputTokens: ai.generation.maxOutputTokens,
        jsonMode: true,
    });

    // Parse the single-pass JSON response
    let parsed: SinglePassResult;
    try {
        let cleaned = result.text
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleaned = jsonMatch[0];

        // Strip control chars EXCEPT \n (0x0A), \r (0x0D), \t (0x09)
        cleaned = cleaned
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .replace(/,\s*([}\]])/g, '$1');

        console.log(`📦 JSON response length: ${cleaned.length} chars`);

        parsed = JSON.parse(cleaned);

        // Validate required fields
        if (!parsed.post_body || typeof parsed.post_body !== 'string') {
            throw new Error('Missing or invalid post_body in response');
        }
        if (!parsed.seo_title || typeof parsed.seo_title !== 'string') {
            throw new Error('Missing or invalid seo_title in response');
        }
    } catch (parseError) {
        console.error('❌ JSON parse failed:', parseError);
        console.error('📄 Raw response (first 500 chars):', result.text.slice(0, 500));

        // Try to extract post_body directly from the raw text via regex
        const bodyMatch = result.text.match(/"post_body"\s*:\s*"([\s\S]*?)"\s*[,}]\s*$/);
        if (bodyMatch) {
            const extractedBody = bodyMatch[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
            console.log('🔧 Extracted post_body via regex fallback');
            const titleLine = extractedBody.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || topic;
            parsed = {
                seo_title: titleLine.slice(0, 55),
                meta_description: extractedBody.replace(/[#*`\n\r]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155),
                slug: titleLine.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60),
                tags: topic.split(/[\s,]+/).filter(w => w.length > 3).slice(0, 5),
                post_body: extractedBody,
            };
        } else {
            // Last resort: treat as plain markdown (only if it looks like markdown, not JSON)
            const text = result.text;
            if (text.trim().startsWith('{')) {
                throw new Error(`Gemini returned invalid JSON that could not be parsed. First 200 chars: ${text.slice(0, 200)}`);
            }
            const titleLine = text.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || topic;
            const plainText = text.replace(/[#*`\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
            parsed = {
                seo_title: titleLine.slice(0, 55),
                meta_description: plainText.slice(0, 155),
                slug: titleLine.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60),
                tags: topic.split(/[\s,]+/).filter(w => w.length > 3).slice(0, 5),
                post_body: text,
            };
        }
    }

    // Enforce field constraints
    parsed.seo_title = trimToWordBoundary(parsed.seo_title, 60);
    parsed.meta_description = trimToWordBoundary(parsed.meta_description || '', 155);
    parsed.slug = (parsed.slug || '').slice(0, 60);
    parsed.tags = Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 5) : [];

    return {
        content: parsed.post_body,
        metadata: parsed,
        model: result.model,
    };
}

/**
 * @deprecated Use generateBlogPost() which now returns metadata too (single-pass).
 * Kept for backward compatibility — extracts metadata from content.
 */
export async function generatePostMetadata(content: string, topic: string) {
    const lines = content.split('\n').filter(l => l.trim());
    const titleLine = lines.find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || topic;
    const plainText = content.replace(/[#*`\n\r]/g, ' ').replace(/\s+/g, ' ').trim();

    return {
        title: titleLine.slice(0, 55),
        metaDescription: plainText.slice(0, 155),
        keywords: topic.split(/[\s,]+/).filter(w => w.length > 3).slice(0, 5),
        excerpt: plainText.slice(0, 150),
    };
}

export async function generateSlug(title: string): Promise<string> {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
}

/** Trim a string to maxLen at a word boundary (never mid-word). */
function trimToWordBoundary(text: string, maxLen: number): string {
    if (!text || text.length <= maxLen) return text;
    const truncated = text.slice(0, maxLen);
    const lastSpace = truncated.lastIndexOf(' ');
    // If there's a space in a reasonable position, cut there
    if (lastSpace > maxLen * 0.6) {
        return truncated.slice(0, lastSpace).replace(/[,\-:;]$/, '').trim();
    }
    return truncated.trim();
}
