# Sanity CMS Guide — StartupKaro Articles

This guide covers everything you need to manage article content via Sanity Studio and preview it before publishing.

---

## Overview

The Articles section of StartupKaro (`/article`, `/article/[slug]`) is fully powered by Sanity Content Lake. Editors create and manage **Articles**, **Authors**, and **Categories** through the embedded Studio. The frontend fetches content via GROQ queries and supports live draft previewing.

**Studio URL (local):** `http://localhost:3000/studio`

**Content model:**
- `Article` — blog post with Portable Text body, cover image, author, categories, SEO
- `Author` — reusable author profile (name, designation, avatar, bio)
- `Category` — editor-controlled category with custom icon and accent color

---

## Environment Setup

Add the following to your `.env.local` file:

```env
# Public — safe to expose to the browser
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Server-only — never expose to the browser
SANITY_API_TOKEN=your_read_token_here
SANITY_PREVIEW_SECRET=any_random_secret_string
SANITY_REVALIDATE_SECRET=another_random_secret_for_webhooks
```

Where to find each:
- **Project ID / Dataset** — [sanity.io/manage](https://sanity.io/manage) → your project → API tab
- **API Token** — sanity.io/manage → API → Tokens → create a token with **Viewer** role (or higher)
- **SANITY_PREVIEW_SECRET / SANITY_REVALIDATE_SECRET** — generate any random strings (e.g. `openssl rand -hex 32`)

---

## Running Studio Locally

1. Copy `.env.local` with all six variables above
2. Run `npm run dev`
3. Open `http://localhost:3000/studio`
4. Log in with your Sanity account (must have been invited to the project in sanity.io/manage)

---

## Content Model Reference

### Article fields

| Field | Required | Notes |
|---|---|---|
| Title | Yes | |
| Slug | Yes | Auto-generated from title; click "Generate" |
| Summary | Yes | Max 220 chars; shown on cards and in search results |
| Cover Image + Alt | Yes | Main article thumbnail |
| Body | — | Portable Text editor; see block types below |
| Author | Yes | Reference to an Author document |
| Categories | Yes | At least 1; filtering uses category slugs |
| Published Date | Yes | Controls ordering and visibility |
| Last Updated Date | — | Optional; shown in SEO metadata |
| Read Time (minutes) | — | Optional; auto-calculated from body if blank |
| Related Articles | — | Up to 3 manual picks; remaining slots auto-filled by shared category |
| SEO group | — | Title, description, keywords, OG image |

### Author fields

| Field | Required | Notes |
|---|---|---|
| Name | Yes | |
| Designation / Role | Yes | e.g. "Chartered Accountant", "Legal Expert" |
| Profile Photo | — | Shown in article hero and bio card |
| Bio | — | Shown at the bottom of article detail pages |

### Category fields

| Field | Required | Notes |
|---|---|---|
| Title | Yes | Display name |
| Slug | Yes | URL-safe identifier used in `?category=<slug>` filter |
| Description | — | Internal note for editors |
| Icon | — | Select from the preset list |
| Accent Color | — | Hex code (e.g. `#FF9933`); used for badges |

---

## Editorial Workflow

### Creating content (recommended order)

1. **Create Authors** first — go to Studio → Author → Add
2. **Create Categories** — go to Studio → Category → Add; set title, slug, icon, color
3. **Create Articles** — go to Studio → Article → Add; fill all required fields

### Writing body content

The article body is a **Portable Text** editor. Available block types:

| Block | How to insert | Notes |
|---|---|---|
| Paragraph / Heading / Quote | Via the toolbar or `/` menu | h2, h3, blockquote supported |
| Bullet / Numbered list | Via toolbar | |
| Image | "+" → Image | Upload an image; fill in Alt text (required) |
| Pull Quote | "+" → Pull Quote | Styled differently from blockquote; has citation field |
| Instagram Reel | "+" → Instagram Reel | Paste the reel URL (e.g. `https://www.instagram.com/reel/...`) |
| YouTube Video | "+" → YouTube Video | Paste the video URL (e.g. `https://youtube.com/watch?v=...`) |

### Filling the SEO group

Click the **SEO** tab in the article editor. Recommended:
- **SEO Title** — overrides `<title>` tag; keep under 70 chars
- **SEO Description** — shown in Google snippets; keep under 180 chars
- **Keywords** — add relevant terms as tags
- **OG Image** — image shown when shared on social; 1200×630px recommended

### Publishing vs. drafts

Sanity Studio saves documents as drafts by default. To make an article visible on the site:
- Click **Publish** in the top-right of the article editor
- The site will reflect the change on the next page request (or within seconds if a webhook is configured)

---

## Preview Mode — Seeing Unpublished Drafts

Preview mode lets you view a draft article on the live frontend before publishing.

### Enable preview for an article

1. Open the article in Studio
2. Click **"Open preview"** (top-right, next to Publish)
3. Your browser opens `/article/<slug>` showing the **draft version** of the article
4. The orange "Draft Mode" banner confirms you're in preview mode

What's happening under the hood: the "Open preview" link calls `/api/draft-mode/enable?secret=...&slug=<slug>`, which sets a Next.js draft mode cookie and redirects you to the article page. The page then fetches draft content directly from Sanity.

### Disable preview mode

**Option 1 — Direct URL:** Visit `/api/draft-mode/disable` in the same browser tab. You'll be redirected to `/`.

**Option 2 — Browser cookies:** Clear site cookies for `localhost:3000` (or your domain) in browser DevTools → Application → Cookies → Delete all.

**Verify it's off:** Refresh `/article` — if you see only published content (no "Draft Mode" banner), preview mode is disabled.

---

## Publishing Flow & Cache

When you publish or update an article in Studio:

- **Without webhook** — the site serves stale content until Next.js ISR revalidates (a few minutes, or on next page request depending on config)
- **With webhook** — changes appear within seconds (see webhook setup below)

---

## Webhook Setup (Production — One-Time)

Webhooks trigger instant cache revalidation when content changes in Sanity.

1. Go to [sanity.io/manage](https://sanity.io/manage) → your project → API → Webhooks
2. Click **Add webhook**
3. Set:
   - **URL:** `https://your-domain.com/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["article", "author", "category"]`
   - **Secret:** value of your `SANITY_REVALIDATE_SECRET` env var
4. Save

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Studio shows "No project found" | Check `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly in `.env.local` |
| "Open preview" redirects but shows published content | Verify `SANITY_API_TOKEN` is set and has at minimum **Viewer** role |
| "Open preview" returns 401 / Unauthorized | `SANITY_PREVIEW_SECRET` in Studio config must match the env var |
| Images not loading (`cdn.sanity.io` blocked) | Check `next.config.ts` has `images.remotePatterns` for `cdn.sanity.io` |
| Category filter returns no results | Category slugs are case-sensitive — check the slug field in Studio matches what's in the URL |
| Article doesn't appear on list page | Verify **Published Date** is filled and the article is **Published** (not draft) |
| Stale content after publishing | Set up the revalidation webhook; or restart the dev server locally |

---

## Further Reading

- [Sanity Portable Text docs](https://www.sanity.io/docs/presenting-block-text)
- [GROQ query language](https://www.sanity.io/docs/groq)
- [Sanity Studio configuration](https://www.sanity.io/docs/configuration)
- [next-sanity v12 README](https://github.com/sanity-io/next-sanity)
