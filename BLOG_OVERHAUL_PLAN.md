# Blog Overhaul — Full Brief & Approved Plan
**Owner:** Shabih Haider  
**Goal:** Build a loyal audience of AI-curious professionals → market apps → attract sponsors  
**Status:** APPROVED TO IMPLEMENT

### Revision Log
| Version | Date | Changes |
|---|---|---|
| v1.0 | Initial | Original plan |
| v1.1 | Updated | 5 technical fixes applied after developer review (see below) |

**v1.1 Fixes Applied:**
1. **Rubric math fixed** — was 110 points, now correctly totals 100 (Word count: 15→10, No UI artifacts: 15→10)
2. **Token limit risk fixed** — `maxOutputTokens` changed from 1500 → 2048 (safe buffer); word enforcement moved entirely to system prompt + quality checker
3. **Single-pass JSON** — metadata and body now generated in one API call, not two (Step 6 rewritten)
4. **Sentence count → word targets** — structure rules now use word count targets (e.g. "~50 words") instead of exact sentence counts to avoid robotic phrasing
5. **H2 question rule softened** — "whenever relevant" added so pricing questions are skipped for obviously enterprise tools

---


## The Big Picture (Why This Matters)

This blog is not just a blog. It's a **long-term distribution channel**.

Every post should:
1. Rank on Google for a real search people type
2. Build trust with readers who come back
3. Naturally lead readers toward your apps or sponsored products
4. Be shareable on LinkedIn, Twitter, Reddit without feeling like spam

The developer's plan covers the technical fixes well. This brief adds the **audience-building and monetization layer** on top of it.

---

## Approved Changes (All 9 Steps — Go Ahead)

The developer's 9-step implementation plan is approved with the following additions and clarifications below.

---

## Step-by-Step Implementation (Detailed)

---

### Step 1 — Rewrite System Prompt (Persona & Audience)

**Files:** `site.ts`

The new persona is: *"a sharp, friendly AI insider who recommends tools like a trusted colleague — not a salesperson, not a developer."*

The system prompt must include:

```
You are Shabih Haider, founder and app developer at shabih.tech.

YOUR MISSION: Help everyday people — freelancers, business owners, agency operators,
students, and creators — discover and use AI tools that save them real time and money.

NEVER write for developers. NEVER assume technical knowledge.
ALWAYS write as if you're texting a smart friend a recommendation.

CONTENT RULES:
- One specific tool or workflow per post. No listicles.
- Show the reader exactly how to use it in plain English.
- Every post answers: "Who is this for?" and "What does it replace?"
- 500–700 words. Hard limit. Every word must earn its place.
- No code blocks. No jargon. No passive voice.
- Write in first person where it adds authenticity.
- Include 1 external link to the tool's official site.
- Include 1 internal link to a related post or shabih.tech.
- End with one punchy takeaway sentence.

BANNED PHRASES (never use these):
- "In today's rapidly evolving landscape..."
- "Artificial intelligence is transforming..."
- "It goes without saying..."
- "Game-changer" / "Revolutionary" / "Cutting-edge"
- Any opener that doesn't hook in the first 8 words

SEO RULES:
- Title: tool name + outcome, under 55 characters, no clickbait
- First paragraph: mention the tool name naturally in sentence 1 or 2
- H2 headings: whenever relevant, phrase them as questions people actually Google
  ("Is [Tool] free?", "How does [Tool] work?", "Who should use [Tool]?") — skip pricing questions if the tool is clearly enterprise-tier
- Meta description: one compelling sentence under 155 characters

STRUCTURE (strict — do not deviate):
1. Hook (~30 words max) — name the exact problem this solves
2. What is [Tool]? (~50 words) — what it does, who built it, free/paid
3. How to use it (4–6 numbered steps, plain English, no code)
4. Who benefits most (3 bullet points: Personal / Business / Agency)
5. The honest catch (~30 words — one real limitation)
6. Bottom line (~20 words + 1 internal link to shabih.tech or related post)
```

---

### Step 2 — Topic Discovery Overhaul

**Files:** `topic-discovery.ts`

Change the search intent completely. The AI should look for:

- Newly launched or updated AI tools (last 30 days preferred)
- AI workflows trending on Reddit r/ChatGPT, r/productivity, Twitter/X
- "Tool A vs Tool B" comparisons with high search volume
- Use-case driven topics: "AI for lawyers", "AI for real estate agents", "AI for video editors"
- Practical how-to angles on existing popular tools (ChatGPT, Claude, Notion AI, etc.)

**Discovery prompt should include:**
```
Search for: newly launched AI tools, AI productivity workflows trending this week,
AI tools for business owners, AI tools for freelancers, Claude AI new features,
ChatGPT tips, Gemini updates, AI tools for content creators, AI automation for agencies.

Return the top 5 most actionable, practical, specific topics suitable for a
500-700 word practical guide aimed at non-developers.
```

---

### Step 3 — Fix Fallback Topics (Critical)

**Files:** `topic-discovery.ts`

Replace the broken `"Latest Trends in ${focusAreas[0]}"` fallback with a **curated evergreen list**. These are always relevant and always searchable:

```javascript
const EVERGREEN_FALLBACK_TOPICS = [
  "How to Use Claude AI to Write Better Emails in Minutes",
  "Perplexity AI vs Google: Which One Should You Actually Use?",
  "How to Automate Your Weekly Report With ChatGPT",
  "Notion AI: Is the $10/Month Upgrade Actually Worth It?",
  "How Freelancers Are Using AI to Win More Clients",
  "The 3 AI Tools Every Small Business Owner Should Know",
  "How to Use Gemini Inside Google Docs (Step by Step)",
  "ChatGPT for Customer Support: Setup Guide for Small Teams",
  "How to Research Any Topic in Under 5 Minutes With AI",
  "Otter.ai: Never Take Meeting Notes Manually Again"
];
```

Pick randomly from this list when discovery fails — never generate a generic title.

---

### Step 4 — Enforce Word Limits (Hard Ceiling)

**Files:** `gemini.ts`, `quality-check.ts`, `site.ts`

> ⚠️ **Important:** Do NOT use `maxOutputTokens` as the word count enforcer. Setting it too low (e.g. 1500) risks the API guillotining the article mid-sentence or cutting off the JSON wrapper, producing broken output. Instead, set a safe buffer and rely on the system prompt + quality checker to enforce length.

| Setting | Current | Fix |
|---|---|---|
| `maxOutputTokens` | 4000 | **2048** (safe buffer, not a word enforcer) |
| Quality check max | Not enforced | Reject if > 850 words |
| Generation prompt | Mentions word count | Add "500–700 words. Do not exceed 700." |
| Word enforcement | Token cutoff | System prompt + quality checker only |

Add to quality check:
```
- Word count between 450 and 850 → PASS
- Word count under 450 → REJECT (too thin, regenerate)
- Word count over 850 → REJECT (too long, regenerate with stricter prompt)
```

---

### Step 5 — SEO & Backlinks (Built Into Every Post)

**Files:** `validate-post.ts`, generation prompt

Every published post **must automatically include**:

#### Internal Links (Your Distribution)
- Link 1: `shabih.tech` — your portfolio/apps homepage
- Link 2 (optional): A previous blog post on a related topic
- Anchor text should be natural, not "click here"

#### External Links (Authority & Trust)
- Link 1: The official website of the tool being reviewed
- Link 2 (optional): A credible source like Product Hunt, TechCrunch, or the tool's docs

#### SEO Metadata Validator
Before approving a post for publishing, auto-check:
- [ ] Title is under 55 characters
- [ ] Title contains the tool name
- [ ] Meta description is under 155 characters and doesn't start with the title
- [ ] At least 1 internal link present
- [ ] At least 1 external link present
- [ ] H2 headings exist (minimum 2)
- [ ] No banned phrases detected
- [ ] Word count between 450–850

---

### Step 6 — Single-Pass JSON Output (Metadata + Body Together)

**Files:** `gemini.ts`

> ⚠️ **Do NOT make two separate API calls** — one for body, one for metadata. This doubles cost, doubles latency, and risks the AI losing context/tone between calls. Generate everything in a single structured JSON response instead.

The generation prompt should instruct the AI to return this exact JSON shape:

```json
{
  "seo_title": "Perplexity AI: Research Done in 2 Minutes",
  "meta_description": "Perplexity AI gives you sourced answers in seconds. Here's how to set it up and who should use it.",
  "slug": "perplexity-ai-research-done-in-2-minutes",
  "tags": ["perplexity ai review", "ai research tool", "perplexity vs google", "ai productivity", "perplexity ai free"],
  "post_body": "# Perplexity AI: Research Done in 2 Minutes\n\n[full post content here in markdown]"
}
```

Rules for the metadata fields:
- `seo_title`: under 55 chars, includes tool name, states the outcome — no "ultimate", "complete", "everything you need"
- `meta_description`: under 155 chars, one compelling sentence, includes tool name, does NOT start with the title
- `slug`: lowercase, hyphens only, under 60 chars
- `tags`: 5 tags, specific not generic ("perplexity ai review" not "AI tools")

The developer should add a JSON parse validation step — if the response is not valid JSON, auto-reject and regenerate rather than publishing broken content.

---

### Step 7 — Admin Settings Cleanup

**Files:** `site.ts`, `api/admin/settings`

#### Focus Areas — Replace With:
```
AI Tools | Productivity | Business Automation | Content Creation |
ChatGPT Tips | Claude AI | Gemini | Freelancer Workflows |
Agency Tools | AI for Small Business
```
Remove: `Antigravity`, `Tech Trends` (too vague), any dev-only topics

#### New Admin Controls to Add:
| Control | Purpose |
|---|---|
| Target Audience | Dropdown: Personal / Business / Agency / Mixed |
| CTA Link | Text field: URL to your app or portfolio |
| CTA Text | Text field: e.g. "Try my AI scheduling app" |
| Sponsor Slot | Toggle + text field for future sponsored mentions |
| Internal Link | Always point to this URL in every post |

#### Fix Existing Broken Controls:
- "Include Code Examples" toggle → rename to "Include Step-by-Step Setup" — actually enforced in prompt
- Word count min/max → tied directly to `maxOutputTokens` so they're actually respected

---

### Step 8 — App Promo System (Future-Proofing for Marketing)

**Files:** `site.ts`, generation prompt

Add an `appPromos` config in admin settings. Structure:

```json
{
  "appPromos": [
    {
      "name": "YourAppName",
      "url": "https://yourapp.shabih.tech",
      "oneLiner": "An AI-powered scheduling tool for freelancers",
      "relevantTopics": ["productivity", "freelancer", "scheduling", "time management"]
    }
  ]
}
```

The generation prompt will receive the most relevant app from this list based on the post topic. The AI will include **one natural, non-salesy mention** — like how a newsletter author mentions their product in context.

Example of a good app mention:
> *"If you're already using AI for your schedule, you might want to check out [AppName] — I built it specifically for freelancers who manage multiple clients."*

This is not an ad. It's a recommendation. That distinction matters for reader trust.

---

### Step 9 — Sponsor Slot Architecture (For Future Revenue)

Plan this now, implement later. Every post template should have a **reserved sponsor slot** that:

- Appears after point 3 (middle of post — highest visibility)
- Is toggled off by default
- When toggled on, inserts: `[SPONSOR]` block with custom text and link
- Labeled honestly as "Sponsored" to maintain reader trust

This makes it trivially easy to add a sponsor to any post without touching code.

---

## Content Calendar Strategy

Don't just publish randomly. Use this posting rhythm for growth:

| Week | Post Type | Goal |
|---|---|---|
| Week 1 | New AI tool review | Capture new tool search traffic |
| Week 2 | Workflow guide ("How I use X for Y") | Pinterest/Reddit shareable |
| Week 3 | Comparison ("Tool A vs Tool B") | High-intent, buying-stage traffic |
| Week 4 | Use-case post ("AI for [profession]") | Niche audience capture |

The automation doesn't need to follow this rigidly — but topic discovery should be tuned to find **all four types** over time.

---

## Quality Score Rubric (Update the Existing 9/10 Scorer)

The current scorer is clearly broken if a post about "AI Trends 2024" is getting 9/10. Replace with:

| Check | Points |
|---|---|
| Title contains specific tool or topic name | 10 |
| Hook doesn't use a banned phrase | 10 |
| Word count 450–850 | **10** |
| Contains 4+ numbered steps | 15 |
| Contains "Who benefits" section | 10 |
| Contains "The catch" / honest limitation | 10 |
| Internal link present | 10 |
| External link to tool present | 10 |
| Meta description under 155 chars | 5 |
| No UI artifacts or junk content | **10** |
| **Total** | **100** |

Only auto-publish if score ≥ 80. Between 60–79: flag for human review. Below 60: auto-reject and regenerate.

---

## What Good Output Looks Like

**Before (current):** "AI Trends 2024: What's Next in Artificial Intelligence?" — 2,000+ words, developer-focused, no conclusion, UI junk at the bottom, score: meaningless 9/10

**After (target):**

```
Title: "Otter.ai: Never Take Meeting Notes Again (Free)"
Word count: 580 words
Structure: Hook → What is it → 5-step setup → Who benefits → The catch → Bottom line
Internal link: shabih.tech
External link: otter.ai
Meta: "Otter.ai records, transcribes, and summarizes your meetings automatically. Here's how to set it up in 5 minutes."
Score: 88/100 → Auto-published
```

---

## Summary — What Changes, What Stays

| | Keep | Change |
|---|---|---|
| **Stack** | ✅ Same DB, same pipeline | — |
| **Admin UI** | ✅ Same structure | Add new controls (Step 7) |
| **Generation** | — | New system prompt, new persona, new structure |
| **Topic discovery** | — | New search intent, new fallback list |
| **Word limits** | — | Enforced at token level |
| **Quality scorer** | — | Full rubric replacement |
| **SEO** | — | Built into every post automatically |
| **Backlinks** | — | Mandatory, validated before publish |
| **App promos** | — | New config system (Step 8) |
| **Sponsor slots** | — | Reserved in template, toggled off for now |

---

## Files to Change (Developer Checklist)

- [ ] `site.ts` — system prompt, app promo config, admin defaults
- [ ] `topic-discovery.ts` — new search intent, evergreen fallback list
- [ ] `gemini.ts` — set maxOutputTokens to **2048**, switch to single-pass structured JSON output
- [ ] `quality-check.ts` — new 100-point rubric, hard word ceiling
- [ ] `validate-post.ts` — backlink validator, SEO metadata checker
- [ ] `api/admin/settings` — new controls (audience, CTA, sponsor slot)
- [ ] Admin UI — rename "Include Code Examples" → "Include Setup Steps", add new fields

---

*Review this, approve each section, then the developer can implement in order. Steps 1–5 are the highest priority — get those live first.*