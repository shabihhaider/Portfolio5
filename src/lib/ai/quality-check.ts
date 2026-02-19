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

    // Code block language tags
    const fencesWithoutLang = (content.match(/^```\s*$/gm) || []).length;
    if (fencesWithoutLang > 0) {
        suggestions.push(`${fencesWithoutLang} code fence(s) missing language tags`);
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
    const validSentences = sentences.filter(s => s.trim().length > 10);
    const uniqueSentences = new Set(validSentences.map(s => s.trim().toLowerCase()));

    if (validSentences.length > 0) {
        const duplicateRatio = 1 - (uniqueSentences.size / validSentences.length);
        if (duplicateRatio > 0.1) {
            issues.push('High duplicate content detected');
            score -= 2;
        }
    }

    // Generic intro check
    const intro = content.slice(0, 300).toLowerCase();
    const fillerPhrases = [
        'in today\'s digital world',
        'in the rapidly evolving',
        'in today\'s rapidly',
        'in the ever-changing',
        'without further ado',
        'buckle up',
        'fasten your seatbelt',
        'are you ready?',
    ];
    for (const phrase of fillerPhrases) {
        if (intro.includes(phrase)) {
            issues.push(`Generic/AI filler phrase in intro: "${phrase}"`);
            score -= 1;
            break; // only penalize once
        }
    }

    // UI artifact check
    const uiArtifacts = ['Copy to clipboard', 'Copied!', 'Loading...', 'Page not found', 'Accept cookies'];
    for (const artifact of uiArtifacts) {
        if (content.includes(artifact)) {
            issues.push(`UI artifact in body: "${artifact}"`);
            score -= 2;
        }
    }

    // Actionable content check
    const lower = content.toLowerCase();
    const hasActionable =
        lower.includes('step 1') ||
        lower.includes('here\'s how') ||
        lower.includes('how to') ||
        lower.includes('try this') ||
        lower.includes('you can') ||
        lower.includes('run this') ||
        lower.includes('install') ||
        lower.includes('npm ') ||
        lower.includes('npx ') ||
        (lower.includes('```') && (lower.includes('const ') || lower.includes('function ')));
    if (!hasActionable) {
        suggestions.push('Post lacks actionable steps or usable code');
        score -= 1;
    }

    // CTA check
    const hasCTA = lower.includes('try') ||
        lower.includes('build') ||
        lower.includes('share') ||
        lower.includes('get started') ||
        lower.includes('next step') ||
        lower.includes('subscribe');
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
