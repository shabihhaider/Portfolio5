/**
 * ═══════════════════════════════════════════════════════════
 *  PRE-PUBLISH VALIDATOR — checks every post before saving
 * ═══════════════════════════════════════════════════════════
 *
 *  Runs AFTER sanitization and BEFORE the DB insert.
 *  Returns a list of issues; if any are `severity: 'error'`
 *  the pipeline should reject the post and regenerate.
 */

export interface ValidationIssue {
    rule: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationResult {
    passed: boolean;
    issues: ValidationIssue[];
}

// Strings that should NEVER appear in a published post body
const UI_STRINGS = [
    'Copy to clipboard',
    'Copied!',
    'Sign in',
    'Sign up',
    'Log in',
    'Subscribe now',
    'Loading...',
    'Page not found',
    '404',
    'Accept cookies',
    'Manage preferences',
    'Suggested follow-ups',
    'Sources 1',
    'Sources 2',
    'Read more...',
    'Continue reading',
];

// Banned phrases per the plan
const BANNED_PHRASES = [
    'in today\'s rapidly evolving',
    'artificial intelligence is transforming',
    'it goes without saying',
    'game-changer',
    'revolutionary',
    'cutting-edge',
    'in today\'s digital world',
    'in the ever-changing',
    'without further ado',
    'buckle up',
];

// Patterns that indicate broken code blocks
const BROKEN_CODE_PATTERNS = [
    /^Copy\s*$/m,
    /```\s*\n\s*```/,
    /```[^`\n]{100,}/,
];

/**
 * Validate a post's content + metadata before publishing.
 */
export function validatePost(
    content: string,
    metadata: { title: string; excerpt?: string; metaDescription?: string },
): ValidationResult {
    const issues: ValidationIssue[] = [];

    // ── Title checks ──────────────────────────────────────
    if (!metadata.title || metadata.title.trim().length < 10) {
        issues.push({
            rule: 'title-incomplete',
            message: `Title too short or missing: "${metadata.title}"`,
            severity: 'error',
        });
    }
    if (metadata.title && metadata.title.length > 55) {
        issues.push({
            rule: 'title-too-long',
            message: `Title exceeds 55 chars (${metadata.title.length}) — bad for SEO`,
            severity: 'warning',
        });
    }
    // Title ends mid-word or with ellipsis (truncated)
    if (metadata.title && /(\.\.\.|…|[a-z])$/.test(metadata.title.trim())) {
        issues.push({
            rule: 'title-truncated',
            message: 'Title appears truncated (ends with "..." or mid-word)',
            severity: 'error',
        });
    }

    // ── Meta description checks ───────────────────────────
    if (metadata.metaDescription) {
        if (metadata.metaDescription.length > 155) {
            issues.push({
                rule: 'meta-too-long',
                message: `Meta description is ${metadata.metaDescription.length} chars (max 155)`,
                severity: 'warning',
            });
        }
        if (metadata.title && metadata.metaDescription.startsWith(metadata.title)) {
            issues.push({
                rule: 'meta-starts-with-title',
                message: 'Meta description should not start with the title',
                severity: 'warning',
            });
        }
    }

    // ── Body length ───────────────────────────────────────
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    if (wordCount < 300) {
        issues.push({
            rule: 'body-too-short',
            message: `Body is only ${wordCount} words (min 300)`,
            severity: 'error',
        });
    }
    if (wordCount > 900) {
        issues.push({
            rule: 'body-too-long',
            message: `Body is ${wordCount} words (max ~850) — overly verbose`,
            severity: 'warning',
        });
    }

    // ── Internal link check (REQUIRED) ────────────────────
    const hasInternalLink =
        content.includes('shabih.tech') ||
        content.includes('shabih-haider') ||
        /\[.*?\]\(\/.*?\)/.test(content);

    if (!hasInternalLink) {
        issues.push({
            rule: 'no-internal-link',
            message: 'No internal link to shabih.tech — required for SEO distribution',
            severity: 'warning',
        });
    }

    // ── External link check (REQUIRED) ────────────────────
    const externalLinks = content.match(/\[.*?\]\(https?:\/\/(?!.*shabih).*?\)/g) || [];
    if (externalLinks.length === 0) {
        issues.push({
            rule: 'no-external-link',
            message: 'No external link to tool/source — required for authority',
            severity: 'warning',
        });
    }

    // ── Banned phrases check ──────────────────────────────
    const lower = content.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
        if (lower.includes(phrase.toLowerCase())) {
            issues.push({
                rule: 'banned-phrase',
                message: `Banned phrase detected: "${phrase}"`,
                severity: 'error',
            });
            break; // one is enough
        }
    }

    // ── Conclusion / closing paragraph ────────────────────
    const lines = content.split('\n').filter(l => l.trim());
    const lastLines = lines.slice(-6).join(' ').toLowerCase();
    const hasConclusion =
        lastLines.includes('bottom line') ||
        lastLines.includes('takeaway') ||
        lastLines.includes('wrap up') ||
        lastLines.includes('wrapping up') ||
        lastLines.includes('conclusion') ||
        lastLines.includes('final thought') ||
        lastLines.includes('next step') ||
        lastLines.includes('try it') ||
        lastLines.includes('give it a shot') ||
        lastLines.includes('start with') ||
        lastLines.includes('get started') ||
        lastLines.includes('what will you') ||
        lastLines.includes('your turn') ||
        lastLines.includes('shabih.tech');
    if (!hasConclusion) {
        issues.push({
            rule: 'no-conclusion',
            message: 'Post has no clear conclusion or bottom line',
            severity: 'warning',
        });
    }

    // ── H2 headings structure ─────────────────────────────
    const h2Count = (content.match(/^## /gm) || []).length;
    if (h2Count < 2) {
        issues.push({
            rule: 'too-few-sections',
            message: `Only ${h2Count} section headers — post needs more structure`,
            severity: 'warning',
        });
    }

    // ── UI artifact strings ───────────────────────────────
    for (const uiStr of UI_STRINGS) {
        if (content.includes(uiStr)) {
            issues.push({
                rule: 'ui-artifact',
                message: `UI artifact found in body: "${uiStr}"`,
                severity: 'error',
            });
        }
    }

    // ── Broken code blocks ────────────────────────────────
    for (const pattern of BROKEN_CODE_PATTERNS) {
        if (pattern.test(content)) {
            issues.push({
                rule: 'broken-code-block',
                message: `Code block issue detected: ${pattern.source}`,
                severity: 'error',
            });
        }
    }

    // ── Unmatched fences ──────────────────────────────────
    const fenceCount = (content.match(/^```/gm) || []).length;
    if (fenceCount % 2 !== 0) {
        issues.push({
            rule: 'unmatched-fence',
            message: `Odd number of code fences (${fenceCount}) — unclosed code block`,
            severity: 'error',
        });
    }

    // ── Result ────────────────────────────────────────────
    const hasErrors = issues.some(i => i.severity === 'error');
    return {
        passed: !hasErrors,
        issues,
    };
}
