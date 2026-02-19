/**
 * ═══════════════════════════════════════════════════════════
 *  CONTENT SANITIZER — strips scraped / AI artifacts
 * ═══════════════════════════════════════════════════════════
 *
 *  Runs BEFORE the post is saved to the database. Handles:
 *  • Extension-panel UI leftovers ("Copy", nav breadcrumbs…)
 *  • Improperly embedded code blocks (nested fences, "Copy" labels)
 *  • import/export statements the AI might leave in
 *  • Custom JSX tags (<Callout> etc.) that would crash MDX
 *  • Leading/trailing wrappers (```mdx …```)
 */

// ── UI / scraped artifact patterns ────────────────────────
const UI_ARTIFACT_PATTERNS = [
    // "Copy" / "Copied!" buttons that leak into code blocks
    /^Copy\s*$/gm,
    /^Copied!?\s*$/gm,
    // Navigation breadcrumbs / sidebar items
    /^(Home|Docs|API Reference|Getting Started)\s*[›>→/]\s*.+$/gm,
    // Extension panel headers (e.g. "Sources 12 Suggested follow-ups")
    /^Sources?\s*\d+\s*$/gm,
    /^Suggested follow-ups?\s*$/gm,
    // Cookie / consent banners
    /^(Accept|Reject|Manage)\s*(all\s*)?(cookies|preferences)?\.?\s*$/gim,
    // Share / social buttons text
    /^(Share|Tweet|Post)\s*(on|to)?\s*(Twitter|X|LinkedIn|Facebook)?\.?\s*$/gim,
    // "Read more" / "Continue reading" footers
    /^(Read more|Continue reading|See also|Related posts?)\.?\s*$/gim,
    // Generic "Sign up" / "Subscribe" banners embedded in content
    /^Sign up (for|to) .{0,80}$/gim,
    // Table-of-contents link artifacts "1. 2. 3." at the top
    /^\d+\.\s*$/gm,
    // Stray HTML comments
    /<!--[\s\S]*?-->/g,
    // Empty links
    /\[]\(.*?\)/g,
];

// ── Known "filler" phrases to strip ────────────────────────
const FILLER_PHRASES = [
    /In today['']s rapidly evolving (digital |tech )?landscape[,.]?/gi,
    /In the ever-changing world of/gi,
    /In today['']s digital world[,.]?/gi,
    /Without further ado[,.]?/gi,
    /Let['']s dive (right )?in[.!]?/gi,
    /Buckle up[,.]?/gi,
    /Are you ready\??/gi,
    /Fasten your seatbelts?[,.]?/gi,
];

/**
 * Fix improperly formatted code blocks.
 *  – Adds missing language tags where possible
 *  – Removes "Copy" labels inside fences
 *  – Collapses double-fenced blocks (```\n```ts → ```ts)
 */
function fixCodeBlocks(content: string): string {
    let out = content;

    // Remove "Copy" on the line right after an opening fence
    out = out.replace(/^(```\w*)\n\s*Copy\s*$/gm, '$1');

    // Remove "Copy" on the line right before a closing fence
    out = out.replace(/^\s*Copy\s*\n(```\s*$)/gm, '$1');

    // Collapse doubled fences:  ```\n```ts  →  ```ts
    out = out.replace(/```\s*\n\s*```(\w+)/g, '```$1');

    // If a fence has no language but content looks like JS/TS, guess
    out = out.replace(/```\n((?:import |export |const |let |function |async |interface |type ))/g, '```typescript\n$1');
    out = out.replace(/```\n((?:def |class |from |import ))/g, '```python\n$1');
    out = out.replace(/```\n((?:<[a-zA-Z]|<!DOCTYPE))/g, '```html\n$1');
    out = out.replace(/```\n((?:\{|\[)\s*\n\s*")/g, '```json\n$1');
    out = out.replace(/```\n((?:SELECT |INSERT |CREATE |ALTER ))/gi, '```sql\n$1');
    out = out.replace(/```\n((?:\$\s|npm |yarn |pnpm |npx |brew |apt |curl ))/g, '```bash\n$1');

    return out;
}

/**
 * Strip custom JSX tags the AI might emit.
 * If a tag wraps content, convert its children to a blockquote.
 */
function stripCustomJSX(content: string): string {
    let out = content;

    // Self-closing: <Component /> → remove
    out = out.replace(/<[A-Z]\w*\b[^>]*\/>/g, '');

    // Block tags: <Component>…</Component> → blockquote children
    // Repeat to handle nested cases
    for (let i = 0; i < 3; i++) {
        out = out.replace(
            /<([A-Z]\w*)\b[^>]*>([\s\S]*?)<\/\1>/g,
            (_m, _tag, inner) =>
                inner
                    .trim()
                    .split('\n')
                    .map((l: string) => `> ${l}`)
                    .join('\n'),
        );
    }

    return out;
}

/**
 * Master sanitiser — call on **raw AI output** before saving.
 */
export function sanitizeContent(raw: string): string {
    let c = raw;

    // ── 1. Strip wrapper fences ───────────────────────────
    c = c.replace(/^```(?:mdx|markdown|md)?\s*\n?/i, '');
    c = c.replace(/\n?```\s*$/i, '');

    // ── 2. Strip import / export statements ───────────────
    c = c.replace(/^import\s+.*?;\s*$/gm, '');
    c = c.replace(/^export\s+(default\s+)?.*?;\s*$/gm, '');

    // ── 3. Remove UI artifacts ────────────────────────────
    for (const pattern of UI_ARTIFACT_PATTERNS) {
        c = c.replace(pattern, '');
    }

    // ── 4. Strip filler phrases ───────────────────────────
    for (const pattern of FILLER_PHRASES) {
        c = c.replace(pattern, '');
    }

    // ── 5. Fix code blocks ────────────────────────────────
    c = fixCodeBlocks(c);

    // ── 6. Strip custom JSX ───────────────────────────────
    c = stripCustomJSX(c);

    // ── 7. Collapse excessive blank lines (max 2) ─────────
    c = c.replace(/\n{4,}/g, '\n\n\n');

    // ── 8. Trim ───────────────────────────────────────────
    c = c.trim();

    return c;
}
