export interface QualityCheck {
    score: number; // 0-10
    passed: boolean;
    issues: string[];
    suggestions: string[];
}

export function checkContentQuality(content: string, minWords: number = 800): QualityCheck {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 10;

    // Word count check
    const wordCount = content.split(/\s+/).length;
    if (wordCount < minWords) {
        issues.push(`Content too short: ${wordCount} words (min: ${minWords})`);
        score -= 3;
    }

    // Code blocks check
    const codeBlocks = (content.match(/```/g) || []).length / 2;
    if (codeBlocks === 0 && (content.includes('code') || content.includes('example'))) {
        suggestions.push('Consider adding code examples for better clarity');
        score -= 0.5;
    }

    // Headers check
    const headers = (content.match(/^#{2,3}\s/gm) || []).length;
    if (headers < 3) {
        issues.push('Not enough section headers for readability');
        score -= 1;
    }

    // Links check
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    if (links === 0) {
        suggestions.push('Consider adding relevant links for context');
        score -= 0.5;
    }

    // Duplicate content check (basic)
    const sentences = content.split(/[.!?]+/);
    // Filtering out short segments and empty strings
    const validSentences = sentences.filter(s => s.trim().length > 10);
    const uniqueSentences = new Set(validSentences.map(s => s.trim().toLowerCase()));

    if (validSentences.length > 0) {
        const duplicateRatio = 1 - (uniqueSentences.size / validSentences.length);
        if (duplicateRatio > 0.1) {
            issues.push('High duplicate content detected');
            score -= 2;
        }
    }

    // Introduction check (checking for typical AI patterns)
    const intro = content.slice(0, 200).toLowerCase();
    if (intro.includes('in today\'s digital world') || intro.includes('in the rapidly evolving')) {
        issues.push('Introduction sounds generic/AI-generated');
        score -= 1;
    }

    // CTA check
    const hasCTA = content.toLowerCase().includes('try') ||
        content.toLowerCase().includes('build') ||
        content.toLowerCase().includes('share') ||
        content.toLowerCase().includes('subscribe');
    if (!hasCTA) {
        suggestions.push('Add a call-to-action to engage readers');
        score -= 0.5;
    }

    const passed = score >= 7 && issues.length === 0;

    return {
        score: Math.max(0, Math.min(10, score)),
        passed,
        issues,
        suggestions,
    };
}
