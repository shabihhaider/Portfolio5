/**
 * ═══════════════════════════════════════════════════════════
 *  TOPIC DISCOVERY — AI-powered trending topic finder
 * ═══════════════════════════════════════════════════════════
 *
 *  Uses Gemini + Google Search grounding to:
 *  1. Discover trending developer/AI topics from the web
 *  2. Research a chosen topic in depth (reads real articles)
 *  3. Return structured research context for original content
 *
 *  Zero extra cost — uses the same Gemini free tier.
 *  No Python, no scraping, no external APIs.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ai } from '@/lib/config/site';

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface DiscoveredTopic {
    title: string;
    angle: string;
    whyTrending: string;
    searchQuery: string;
}

export interface TopicResearch {
    topic: DiscoveredTopic;
    keyPoints: string[];
    recentDevelopments: string[];
    uniqueAngles: string[];
    sources: string[];
    researchContext: string;
}

/**
 * Call Gemini with Google Search grounding + model fallback.
 * Tries each model in the fallback chain until one succeeds.
 */
async function callSearchWithRetry(prompt: string): Promise<{ text: string; model: string }> {
    const models = ai.models;
    let lastError: Error | null = null;

    for (const modelName of models) {
        try {
            console.log(`🔄 Trying model: ${modelName} with Google Search`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                tools: [{ googleSearch: {} } as any],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 2048,
                },
            });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            console.log(`✅ Search grounding succeeded with: ${modelName}`);
            return { text, model: modelName };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            const isQuota = lastError.message.includes('429') || lastError.message.includes('quota');
            if (isQuota) {
                console.warn(`⚠️ Model ${modelName} quota exhausted, trying next...`);
            } else {
                console.warn(`⚠️ Model ${modelName} failed: ${lastError.message}`);
            }
        }
    }

    throw new Error(`All models exhausted for search grounding: ${lastError?.message}`);
}

/**
 * Discover trending topics that are relevant to the given focus areas.
 * Uses Google Search grounding to find what's actually being discussed right now.
 */
export async function discoverTrendingTopics(
    focusAreas: string[] = ['AI/ML', 'Web Development', 'Full Stack'],
    count: number = 5,
    existingSlugs: string[] = []
): Promise<DiscoveredTopic[]> {
    console.log(`🔍 Searching for trending topics in: ${focusAreas.join(', ')}...`);

    const avoidList = existingSlugs.length > 0
        ? `\n\nAVOID these topics (already published): ${existingSlugs.slice(0, 10).join(', ')}`
        : '';

    const prompt = `Search the web for PRACTICAL topics developers are talking about this week in: ${focusAreas.join(', ')}.

I need topics that answer "How do I actually use this?" — NOT trend summaries.

Look for:
- New tools, libraries, or CLI utilities developers can install and try TODAY
- Practical workflows: how devs use AI to write emails, summarize meetings, debug code, etc.
- Step-by-step setup guides for newly released frameworks or features
- Real "I tried X and here's what happened" developer experiences
- Productivity hacks, dev environment setups, or automation scripts gaining traction
- Specific techniques with before/after code examples

AVOID:
- Generic trend roundups ("Top 10 AI trends in 2026")
- News-only topics with no actionable angle
- Broad overviews without a specific how-to

${avoidList}

Return EXACTLY ${count} topics as a JSON array. Each topic must have:
- "title": A specific how-to or practical blog post title (e.g. "How to Use Cursor AI to Refactor a Legacy Codebase" NOT "AI Code Editors Are Changing Everything")
- "angle": The practical angle — what will the reader be able to DO after reading?
- "whyTrending": Why this is trending RIGHT NOW (1 sentence)
- "searchQuery": A Google search query to research this topic deeper

IMPORTANT: Topics must be CURRENT (this week/month) and ACTIONABLE.
Return ONLY the JSON array, no markdown fences.`;

    try {
        const { text } = await callSearchWithRetry(prompt);

        // Parse JSON from response
        let cleaned = text
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            cleaned = jsonMatch[0];
        }

        // Sanitize control chars and trailing commas
        cleaned = cleaned
            .replace(/[\x00-\x1F\x7F]/g, ' ')
            .replace(/,\s*([}\]])/g, '$1');

        const topics: DiscoveredTopic[] = JSON.parse(cleaned);

        if (!Array.isArray(topics) || topics.length === 0) {
            throw new Error('No topics returned');
        }

        console.log(`✅ Discovered ${topics.length} trending topics`);
        return topics.slice(0, count);
    } catch (error) {
        console.error('❌ Topic discovery failed:', error);
        // Fallback: return a generic prompt for Gemini to pick a topic without search
        return [{
            title: `Latest Trends in ${focusAreas[0] || 'Web Development'}`,
            angle: 'Overview of the most important recent developments',
            whyTrending: 'Developers always want to stay current with the latest trends',
            searchQuery: `${focusAreas[0] || 'web development'} trends ${new Date().getFullYear()}`,
        }];
    }
}

/**
 * Deep-research a specific topic using Google Search grounding.
 * Reads real articles and returns structured research context
 * that the content generator can use to write an original, informed post.
 */
export async function researchTopic(topic: DiscoveredTopic): Promise<TopicResearch> {
    console.log(`📚 Researching: "${topic.title}"...`);

    const prompt = `Research this topic for a PRACTICAL how-to blog post: "${topic.title}"
Search query: "${topic.searchQuery}"
Angle: "${topic.angle}"

Search the web and find ACTIONABLE information. Focus on:
- Exact setup steps, install commands, config files
- Real code examples or CLI commands developers actually use
- Specific version numbers, benchmarks, or performance results
- Common gotchas, mistakes, and how to fix them
- Before/after comparisons showing concrete improvement

Return a JSON object with:
- "keyPoints": Array of 5-8 specific, actionable technical points (not opinions — facts and steps)
- "recentDevelopments": Array of 3-5 specific releases, updates, or changes (with version numbers and dates)
- "uniqueAngles": Array of 3-4 practical angles most articles miss (e.g. "most guides skip the Docker setup" or "the real bottleneck is X not Y")
- "sources": Array of article titles or URLs with useful code examples
- "researchContext": A 200-300 word summary focused on WHAT THE READER CAN DO. Include install commands, config snippets, real numbers. This will be used as context to write a tutorial-style post.

Be specific and factual. Include real version numbers, real commands, real tool names.
Return ONLY valid JSON, no markdown fences.`;

    try {
        const { text } = await callSearchWithRetry(prompt);

        let cleaned = text
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleaned = jsonMatch[0];
        }

        // Fix control chars and trailing commas
        cleaned = cleaned
            .replace(/[\x00-\x1F\x7F]/g, ' ')
            .replace(/,\s*([}\]])/g, '$1');

        const research = JSON.parse(cleaned);

        console.log(`✅ Research complete: ${research.keyPoints?.length || 0} key points found`);

        return {
            topic,
            keyPoints: research.keyPoints || [],
            recentDevelopments: research.recentDevelopments || [],
            uniqueAngles: research.uniqueAngles || [],
            sources: research.sources || [],
            researchContext: research.researchContext || '',
        };
    } catch (error) {
        console.error('❌ Research failed, continuing with topic only:', error);

        return {
            topic,
            keyPoints: [],
            recentDevelopments: [],
            uniqueAngles: [topic.angle],
            sources: [],
            researchContext: `Topic: ${topic.title}. Angle: ${topic.angle}. Why trending: ${topic.whyTrending}`,
        };
    }
}

/**
 * Full pipeline: discover → pick best → research → return ready-to-write context.
 * This is the main entry point for the generate script.
 */
export async function discoverAndResearch(
    focusAreas: string[],
    existingSlugs: string[] = []
): Promise<TopicResearch> {
    // Step 1: Discover trending topics
    const topics = await discoverTrendingTopics(focusAreas, 5, existingSlugs);

    if (topics.length === 0) {
        throw new Error('No topics discovered');
    }

    // Step 2: Pick the best topic (first one — Gemini already ranks by relevance)
    // But if we have multiple, pick randomly from top 3 for variety
    const topPicks = topics.slice(0, Math.min(3, topics.length));
    const chosen = topPicks[Math.floor(Math.random() * topPicks.length)];

    console.log(`\n🎯 Chosen topic: "${chosen.title}"`);
    console.log(`   Angle: ${chosen.angle}`);
    console.log(`   Why trending: ${chosen.whyTrending}\n`);

    // Step 3: Deep research the chosen topic
    const research = await researchTopic(chosen);

    return research;
}
