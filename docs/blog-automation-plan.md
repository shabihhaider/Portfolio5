# Blog Automation Plan (GitHub Actions + Prisma + Admin UI)

> **Last updated**: 2026-02-17
> **Status**: Implementation in progress

---

## Goals
- Automate 3 posts/week with $0 infra (GitHub Actions cron + Gemini free tier).
- Keep content in Prisma DB (PostgreSQL); approvals/edits via existing admin UI.
- Provide clear reject/regenerate path; nothing publishes without human approval.

---

## High-Level Flow

```
┌─────────────────┐    ┌──────────────┐    ┌───────────────┐    ┌────────────────┐
│ GitHub Actions   │───▸│ POST /api/   │───▸│ Gemini API    │───▸│ Save draft     │
│ cron (3×/week)   │    │ generate     │    │ (free tier)   │    │ to Prisma DB   │
└─────────────────┘    └──────────────┘    └───────────────┘    └───────┬────────┘
                                                                        │
                                                                        ▼
┌─────────────────┐    ┌──────────────┐    ┌───────────────┐    ┌────────────────┐
│ GitHub Actions   │───▸│ GET /api/    │◂───│ Admin UI      │◂───│ Email/GitHub   │
│ cron (hourly)    │    │ cron/publish │    │ approve/reject│    │ notification   │
└─────────────────┘    └──────────────┘    └───────────────┘    └────────────────┘
```

1. **Generate** (cron, 3×/week): GitHub Action calls deployed `POST /api/generate` endpoint.
2. **Notify**: Action creates a GitHub issue with preview link (free, no extra infra).
3. **Review in Admin**: You open admin dashboard, preview the draft, then approve/reject/edit/regenerate.
4. **Publish** (cron, hourly/daily): GitHub Action calls deployed `GET /api/cron/publish` to flip approved+scheduled posts to published.

---

## Architecture Decisions

### Why call API endpoints (not run scripts directly)?
- GitHub Actions does NOT need `DATABASE_URL` — only needs `SITE_URL` + `CRON_SECRET` + `ADMIN_TOKEN`.
- No DB credentials leaked to GitHub; the deployed app handles DB access.
- Reuses existing authenticated API routes.

### Why Gemini instead of Groq?
- User requirement: $0 cost. Gemini has a generous free tier.
- The existing Groq integration will be replaced with a Gemini provider module.
- Same interface (`generateBlogPost`, `generatePostMetadata`) — only the backend changes.

---

## Data Model (Prisma Schema)

### Existing `Post` fields (confirmed, no rename needed):
- `id`, `slug`, `title`, `content`, `excerpt`, `coverImage`
- `author`, `status`, `publishedAt`, `scheduledFor`
- `metaDescription`, `metaKeywords`, `ogImage`
- `tags`, `category`
- `views`, `likes`, `readingTime`, `ctaClicks`
- `generatedBy`, `humanEdited`, `qualityScore`
- `createdAt`, `updatedAt`

### Status values (UPDATED):
- `draft` — AI-generated, awaiting human review
- `approved` — Human approved, waiting for `scheduledFor` date
- `scheduled` — Legacy alias; treated same as `approved` by publisher
- `published` — Live on the blog
- `rejected` — Human rejected; can regenerate

### No schema migration needed — `status` is a `String` field, not an enum.

---

## Changes Required

### 1. AI Provider: Groq → Gemini
- **File**: `src/lib/ai/groq.ts` → rename to `src/lib/ai/gemini.ts`
- Replace `groq-sdk` with `@google/generative-ai` (free, official SDK)
- Keep same exported functions: `generateBlogPost()`, `generatePostMetadata()`, `generateSlug()`
- Use model: `gemini-2.0-flash` (free tier, fast, good quality)
- Add retries with exponential backoff for rate limits
- Update all imports across codebase

### 2. PostsDB Updates
- **File**: `src/lib/db/posts.ts`
- `publishScheduledPosts()`: query `status IN ('approved', 'scheduled') AND scheduledFor <= now`
- Add `getApprovedPosts()`, `getRejectedPosts()` helpers
- Add `approve(slug)`, `reject(slug)` convenience methods

### 3. Fix `scripts/publish-scheduled.ts`
- **Bug**: checks `MONGODB_URI` but app uses PostgreSQL. Fix to check `DATABASE_URL`.

### 4. API Routes (new, slug-based)
- `POST /api/posts/[slug]/approve` → sets `status='approved'`, optionally sets `scheduledFor`
- `POST /api/posts/[slug]/reject` → sets `status='rejected'`
- `POST /api/posts/[slug]/regenerate` → generates a new draft for same topic, rejects old one
- All routes require admin authentication.

### 5. Admin UI Updates
- **File**: `src/components/admin/PostsList.tsx`
- Add **APPROVE** button (for drafts) — calls approve endpoint
- Add **REJECT** button (for drafts) — calls reject endpoint
- Add **REGENERATE** button (for rejected/drafts) — calls regenerate endpoint
- Color-code: draft=yellow, approved=blue, scheduled=purple, published=green, rejected=red

### 6. Update `scripts/generate-blog-post.ts`
- Switch from Groq to Gemini import
- Accept `--topic`, `--status`, `--scheduledFor` flags
- Respect `SiteSettings` (tone, word count, topics, includeCode)
- Fix: check `DATABASE_URL` not `MONGODB_URI`

### 7. Update `src/app/api/generate/route.ts`
- Switch from Groq to Gemini import
- Respect `SiteSettings` from DB (read settings, pass tone/wordCount/etc. to generator)

### 8. GitHub Actions Workflows
- **`.github/workflows/generate.yml`** — cron Mon/Wed/Fri
  - Calls `POST {SITE_URL}/api/generate` with `ADMIN_TOKEN` header
  - On success: creates GitHub issue with title + preview link
  - On failure: creates GitHub issue with error details
  - Secrets needed: `SITE_URL`, `ADMIN_TOKEN`
- **`.github/workflows/publish.yml`** — cron every 6 hours
  - Calls `GET {SITE_URL}/api/cron/publish` with `CRON_SECRET` header
  - Secrets needed: `SITE_URL`, `CRON_SECRET`

---

## GitHub Secrets Required
| Secret | Purpose | Example |
|--------|---------|---------|
| `SITE_URL` | Your deployed app URL | `https://portfolio5-olive.vercel.app` |
| `ADMIN_TOKEN` | JWT or API key for admin auth | (generate one) |
| `CRON_SECRET` | Auth for cron publish endpoint | (already exists in app) |

**NOT needed in GitHub**: `DATABASE_URL`, `GEMINI_API_KEY` — these stay in Vercel env only.

---

## Safety & Quality
- Quality check runs before saving (existing `checkContentQuality()`)
- Only `approved`/`scheduled` posts can be published
- `draft` and `rejected` are never auto-published
- Admin can always edit content before approving
- Retries with backoff on Gemini rate limits (max 3 attempts)

---

## Failure Handling
| Scenario | What happens |
|----------|-------------|
| Gemini rate-limited | Retry 3× with backoff; if all fail, GitHub issue with error |
| Low quality score | Post saved as `draft` but flagged; admin decides |
| You dislike a draft | Reject in admin → Regenerate → new draft created |
| Generation crashes | GitHub Action fails; issue created with logs |
| Publish cron fails | Posts stay `approved`; next cron run picks them up |

---

## Implementation Order
1. ✅ Plan document (this file)
2. Switch AI provider (Groq → Gemini)
3. Update PostsDB with new status methods
4. Fix `publish-scheduled.ts` MONGODB_URI bug
5. Add approve/reject/regenerate API routes
6. Update admin UI (PostsList buttons)
7. Update generate script + API route for Gemini
8. Create GitHub Actions workflows
9. Test end-to-end
