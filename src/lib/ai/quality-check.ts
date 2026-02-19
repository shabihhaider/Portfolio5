/**
 * ═══════════════════════════════════════════════════════════
 *  QUALITY CHECK — 100-point rubric for blog posts
 * ═══════════════════════════════════════════════════════════
 *
 *  Scores every post against a strict rubric designed for
 *  non-developer AI tool reviews (500-700 word guides).
 *
 *  ≥80 → Auto-publish
 *  60-79 → Flag for human review
 *  <60 → Auto-reject and regenerate
 */

export interface QualityCheck {
    score: number; // 0-100
    passed: boolean;
    autoPublish: boolean;
    issues: string[];
    suggestions: string[];
    breakdown: Record<string, number>;
}

// Banned phrases that should never appear
const BANNED_PHRASES = [
    'in today\'s rapidly evolving',
    'in the rapidly evolving',
    'artificial intelligence is transforming',
    'it goes without saying',
    'game-changer',
    'revolutionary',
    'cutting-edge',
    'in today\'s digital world',
    'in the ever-changing',
    'without further ado',
    'buckle up',
    'fasten your seatbelt',
    'are you ready?',
    'in today\'s world',
    'in this article',
    'in this blog post',
];

// UI artifacts that should never appear
const UI_ARTIFACTS = [
    'Copy to clipboard',
    'Copied!',
    'Sign in',
    'Sign up',
    'Loading...',
    'Page not found',
    '404',
    'Accept cookies',
    'Manage preferences',
    'Sources 1',
    'Sources 2',
    'Suggested follow-ups',
    'Read more...',
    'Continue reading',
];

export function checkContentQuality(content: string, _minWords?: number): QualityCheck {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const breakdown: Record<string, number> = {};
    let totalScore = 0;

    const lower = content.toLowerCase();
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    // ── 1. Title contains specific tool or topic name (10 pts) ──
    const firstLine = content.split('\n').find(l => l.trim())?.trim() || '';
    const hasSpecificTitle = firstLine.startsWith('#') &&
        !firstLine.toLowerCase().includes('trends') &&
        !firstLine.toLowerCase().includes('overview') &&
        !firstLine.toLowerCase().includes('everything you need') &&
        firstLine.length > 10 &&
        firstLine.length < 80;

    if (hasSpecificTitle) {
        breakdown['title_specific'] = 10;
        totalScore += 10;
    } else {
        breakdown['title_specific'] = 0;
        issues.push(`Title is too generic or missing: "${firstLine.slice(0, 60)}"`);
    }

    // ── 2. Hook doesn't use a banned phrase (10 pts) ──
    const intro = lower.slice(0, 400);
    let hookClean = true;
    for (const phrase of BANNED_PHRASES) {
        if (intro.includes(phrase.toLowerCase())) {
            hookClean = false;
            issues.push(`Banned phrase in intro: "${phrase}"`);
            break;
        }
    }
    breakdown['hook_clean'] = hookClean ? 10 : 0;
    totalScore += breakdown['hook_clean'];

    // ── 3. Word count 450-850 (10 pts) ──
    if (wordCount >= 450 && wordCount <= 850) {
        breakdown['word_count'] = 10;
        totalScore += 10;
    } else if (wordCount < 450) {
        breakdown['word_count'] = 0;
        issues.push(`Too short: ${wordCount} words (need 450-850)`);
    } else {
        breakdown['word_count'] = 0;
        issues.push(`Too long: ${wordCount} words (need 450-850)`);
    }

    // ── 4. Contains 4+ numbered steps (15 pts) ──
    const numberedSteps = (content.match(/^\d+\.\s+\S/gm) || []).length;
    if (numberedSteps >= 4) {
        breakdown['numbered_steps'] = 15;
        totalScore += 15;
    } else if (numberedSteps >= 2) {
        breakdown['numbered_steps'] = 8;
        totalScore += 8;
        suggestions.push(`Only ${numberedSteps} numbered steps (need 4+)`);
    } else {
        breakdown['numbered_steps'] = 0;
        issues.push('No numbered steps found — post needs a how-to section');
    }

    // ── 5. Contains "Who benefits" section (10 pts) ──
    const hasBenefits =
        lower.includes('who benefits') ||
        lower.includes('who should use') ||
        lower.includes('who is this for') ||
        lower.includes('best for') ||
        lower.includes('ideal for') ||
        lower.includes('perfect for') ||
        (lower.includes('personal') && lower.includes('business')) ||
        (lower.includes('freelancer') && lower.includes('business'));

    if (hasBenefits) {
        breakdown['who_benefits'] = 10;
        totalScore += 10;
    } else {
        breakdown['who_benefits'] = 0;
        suggestions.push('Missing "Who benefits" section');
    }

    // ── 6. Contains honest catch/limitation (10 pts) ──
    const hasCatch =
        lower.includes('the catch') ||
        lower.includes('the honest catch') ||
        lower.includes('limitation') ||
        lower.includes('downside') ||
        lower.includes('drawback') ||
        lower.includes('the one thing') ||
        lower.includes('not perfect') ||
        lower.includes('worth noting') ||
        lower.includes('keep in mind') ||
        lower.includes('one caveat');

    if (hasCatch) {
        breakdown['honest_catch'] = 10;
        totalScore += 10;
    } else {
        breakdown['honest_catch'] = 0;
        suggestions.push('Missing honest limitation/catch section');
    }

    // ── 7. Internal link present (10 pts) ──
    const hasInternalLink =
        content.includes('shabih.tech') ||
        content.includes('shabih-haider') ||
        /\[.*?\]\(\/.*?\)/.test(content);

    if (hasInternalLink) {
        breakdown['internal_link'] = 10;
        totalScore += 10;
    } else {
        breakdown['internal_link'] = 0;
        issues.push('No internal link to shabih.tech found');
    }

    // ── 8. External link to tool present (10 pts) ──
    const externalLinks = content.match(/\[.*?\]\(https?:\/\/(?!.*shabih).*?\)/g) || [];
    if (externalLinks.length > 0) {
        breakdown['external_link'] = 10;
        totalScore += 10;
    } else {
        breakdown['external_link'] = 0;
        issues.push('No external link to tool/source found');
    }

    // ── 9. Meta description check / good structure (5 pts) ──
    const hasGoodStructure =
        (content.match(/^## /gm) || []).length >= 2 &&
        firstLine.startsWith('#');

    if (hasGoodStructure) {
        breakdown['meta_structure'] = 5;
        totalScore += 5;
    } else {
        breakdown['meta_structure'] = 0;
        suggestions.push('Post needs at least 2 H2 headings for good structure');
    }

    // ── 10. No UI artifacts or junk content (10 pts) ──
    let hasArtifacts = false;
    for (const artifact of UI_ARTIFACTS) {
        if (content.includes(artifact)) {
            hasArtifacts = true;
            issues.push(`UI artifact: "${artifact}"`);
        }
    }

    breakdown['no_artifacts'] = hasArtifacts ? 0 : 10;
    totalScore += breakdown['no_artifacts'];

    // ── Determine pass/fail ──
    const autoPublish = totalScore >= 80;
    const passed = totalScore >= 60;

    return {
        score: Math.max(0, Math.min(100, totalScore)),
        passed,
        autoPublish,
        issues,
        suggestions,
        breakdown,
    };
}
