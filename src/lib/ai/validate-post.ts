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

// Patterns that indicate broken code blocks
const BROKEN_CODE_PATTERNS = [
    /^Copy\s*$/m,                   // Bare "Copy" on its own line
    /```\s*\n\s*```/,               // Empty or double fence
    /```[^`\n]{100,}/,              // Absurdly long language tag (garbage)
];

/**
 * Validate a post's content + metadata before publishing.
 */
export function validatePost(
    content: string,
    metadata: { title: string; excerpt?: string },
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
    if (metadata.title && metadata.title.length > 70) {
        issues.push({
            rule: 'title-too-long',
            message: `Title exceeds 70 chars (${metadata.title.length})`,
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

    // ── Body length ───────────────────────────────────────
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    if (wordCount < 300) {
        issues.push({
            rule: 'body-too-short',
            message: `Body is only ${wordCount} words (min 300)`,
            severity: 'error',
        });
    }

    // ── Conclusion / closing paragraph ────────────────────
    const lines = content.split('\n').filter(l => l.trim());
    const lastLines = lines.slice(-6).join(' ').toLowerCase();
    const hasConclusion =
        lastLines.includes('takeaway') ||
        lastLines.includes('wrap up') ||
        lastLines.includes('wrapping up') ||
        lastLines.includes('conclusion') ||
        lastLines.includes('final thought') ||
        lastLines.includes('next step') ||
        lastLines.includes('try it') ||
        lastLines.includes('give it a shot') ||
        lastLines.includes('start with') ||
        lastLines.includes('action item') ||
        lastLines.includes('go build') ||
        lastLines.includes('get started') ||
        lastLines.includes('what will you') ||
        lastLines.includes('your turn');
    if (!hasConclusion) {
        issues.push({
            rule: 'no-conclusion',
            message: 'Post has no clear conclusion or closing call-to-action',
            severity: 'warning',
        });
    }

    // ── Actionable tip check ──────────────────────────────
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
        lower.includes('clone') ||
        (lower.includes('```') && (lower.includes('const ') || lower.includes('function ') || lower.includes('import ')));
    if (!hasActionable) {
        issues.push({
            rule: 'no-actionable-tip',
            message: 'Post has no actionable tip, tutorial step, or usable code example',
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

    // ── Headers structure ─────────────────────────────────
    const h2Count = (content.match(/^## /gm) || []).length;
    if (h2Count < 2) {
        issues.push({
            rule: 'too-few-sections',
            message: `Only ${h2Count} section headers — post needs more structure`,
            severity: 'warning',
        });
    }

    // ── Result ────────────────────────────────────────────
    const hasErrors = issues.some(i => i.severity === 'error');
    return {
        passed: !hasErrors,
        issues,
    };
}
