# Out Tonight — Product & Build Documentation
**Last updated:** May 2026  
**Production URL:** https://out-tonight-beta.vercel.app  
**Repository:** https://github.com/jgallo02/out-tonight  
**Owner:** Joe Gallo

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Architecture](#4-architecture)
5. [File Structure](#5-file-structure)
6. [Page-by-Page Breakdown](#6-page-by-page-breakdown)
7. [Hooks & Utilities](#7-hooks--utilities)
8. [Edge Function](#8-edge-function)
9. [Database Schema](#9-database-schema)
10. [Environment Variables & Secrets](#10-environment-variables--secrets)
11. [Deployment](#11-deployment)
12. [Known Constraints & Rules](#12-known-constraints--rules)
13. [AI Response Schema](#13-ai-response-schema)
14. [Preferences System](#14-preferences-system)
15. [Build History](#15-build-history)

---

## 1. Product Overview

Out Tonight is a mobile-first progressive web app that generates personalized date night ideas using the Claude AI API. The core loop:

1. **Input** — User sets city, date, time of day, group size, vibe, and budget
2. **Generate** — Claude API returns 10 specific, real-venue ideas tailored to the inputs
3. **Browse** — Results appear as an expandable list; each card shows description, "why tonight", logistics, cost
4. **Save** — Heart icon saves ideas to the user's Matches list (persisted to Supabase)
5. **Refine** — Saved/passed history feeds back into the next generation call, so results improve over time
6. **Preferences** — Per-user dietary, travel, transport, accessibility, activity, and noise preferences persist and auto-inject into every future prompt

**Target use:** A couple or group deciding where to go out, who wants curated suggestions beyond a Yelp search.

---

## 2. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Frontend framework | React | 19.x | No class components |
| Build tool | Vite | 8.x | `npm run dev` on port 5173 |
| CSS | Tailwind CSS | 3.x | Custom tokens; also inline styles for dynamic values |
| Routing | React Router DOM | 7.x | `BrowserRouter` with `ProtectedRoute` wrapper |
| Server state | TanStack Query | 5.x | All Supabase reads go through this |
| Auth | Supabase Auth | 2.x | Google OAuth provider |
| Database | Supabase (Postgres) | — | One table: `swipes` |
| Edge function | Supabase Edge Functions | Deno | `generate-ideas` — proxies Claude API calls |
| AI model | Anthropic Claude | `claude-sonnet-4-5` | 8192 max tokens, JSON-only response |
| Animation | Framer Motion | 12.x | Available but not actively used post-swipe-deck removal |
| Deployment | Vercel | — | Auto-deploys on push to `main` |

---

## 3. Design System

**Palette name:** Sapphire & Ruby

### Color Tokens

```
page:      #0c1538   ← velvet sapphire — app background
surface:   #16204a   ← surfaces, cards, bottom nav
soft:      #1f2a5c   ← tertiary surfaces
ink:       #efe5d2   ← pearl — primary text
inkDim:    rgba(239,229,210,0.62)   ← secondary text
inkFaint:  rgba(239,229,210,0.32)   ← tertiary / disabled text
inkHair:   rgba(239,229,210,0.14)   ← borders, dividers
red:       #c8243a   ← ruby red — CTAs, active states, hearts, borders
wine:      #e8a832   ← gold — italic emphasis, logo highlight, active indicator
```

### Typography

| Role | Font | Usage |
|---|---|---|
| Headings / titles | Playfair Display | Serif; italic + wine for emphasis |
| Body / UI | DM Sans | All labels, body copy, buttons |
| Labels / caps | DM Mono | Uppercase, `letterSpacing: '0.22–0.32em'`, badges |

Loaded via Google Fonts in `index.html`.

### Geometry
- Max content width: **430px**, centered
- Card border-radius: **16px**
- CTA / pill border-radius: **999px**
- Input surface border-radius: **14px**

### Category Gradients (fallback when no image)
```
Food:          linear-gradient(135deg, #2a1408, #1a0c06)
Nightlife:     linear-gradient(135deg, #28142a, #160a18)
Culture:       linear-gradient(135deg, #0e1018, #080a10)
Adventure:     linear-gradient(135deg, #0e1c0e, #081008)
Outdoors:      linear-gradient(135deg, #0e1c18, #081210)
Wellness:      linear-gradient(135deg, #12181a, #0c1214)
Entertainment: linear-gradient(135deg, #1a1408, #120e06)
Hidden Gem:    linear-gradient(135deg, #1a1404, #120e02)
```

---

## 4. Architecture

```
Browser (React SPA)
  │
  ├── Google OAuth → Supabase Auth → /auth/callback → /input
  │
  ├── InputPage gathers: city, date, time, group_size, vibes, budget
  │     └── reads userPrefs from Supabase user_metadata
  │
  ├── POST to Supabase Edge Function: generate-ideas
  │     ├── Validates JWT
  │     ├── Builds prompt (inputs + swipe history + preferences)
  │     ├── Calls Anthropic Claude API (server-side only)
  │     └── Returns JSON array of 10 ideas
  │
  ├── DeckPage renders expandable list
  │     ├── Heart → writes to Supabase `swipes` table (direction: 'right')
  │     ├── View more → calls edge function again with `exclude` list
  │     └── resolveImage() tries images (currently dormant — no API keys)
  │
  ├── MatchesPage reads `swipes` table (direction: 'right') via useMatches
  │     └── Heart tap → removes from swipes (inserts direction: 'left' OR deletes)
  │
  └── ProfilePage
        ├── User stats (saved/passed/explored counts + taste tag cloud)
        └── Preferences UI → saves to Supabase user_metadata
```

**Critical security rule:** The `ANTHROPIC_API_KEY` lives **only** in Supabase Edge Function secrets. It is never exposed to the client. All Claude API calls are proxied through the edge function, which validates the user's JWT before calling Claude.

---

## 5. File Structure

```
out-tonight/
├── index.html                        # Google Fonts, SPA entry
├── vite.config.js                    # PostCSS + Tailwind inline
├── tailwind.config.js                # Custom Sapphire & Ruby tokens
├── vercel.json                       # SPA catch-all rewrite
├── .env.local                        # Client env vars (Supabase URL + anon key)
├── package.json
│
├── src/
│   ├── main.jsx                      # React root, imports index.css
│   ├── App.jsx                       # Router + ProtectedRoute
│   ├── index.css                     # @tailwind directives + global reset
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx             # Splash + Google sign-in
│   │   ├── AuthCallbackPage.jsx      # OAuth callback handler
│   │   ├── InputPage.jsx             # Form: city/date/time/size/vibe/budget
│   │   ├── DeckPage.jsx              # Results list with expandable rows
│   │   ├── MatchesPage.jsx           # Saved ideas list
│   │   └── ProfilePage.jsx           # User card, stats, taste profile, preferences
│   │
│   ├── components/
│   │   ├── cards/
│   │   │   └── IdeaCard.jsx          # (Legacy card component — not used in list view)
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx         # Three-tab nav (Discover, Matches, Profile)
│   │   │   └── PageShell.jsx         # Wrapper with BottomNav
│   │   └── ui/
│   │       └── TopBarAvatar.jsx      # 32px avatar chip → /profile
│   │
│   ├── hooks/
│   │   ├── useIdeaGeneration.js      # TanStack mutation → edge function POST
│   │   ├── useSwipeHistory.js        # Reads last 20 liked + 20 passed tags
│   │   ├── useMatches.js             # Reads right-swipes; useRemoveMatch mutation
│   │   └── useUserPreferences.js     # Load/save preferences via user_metadata
│   │
│   └── lib/
│       ├── supabase.js               # Supabase client (VITE_SUPABASE_URL + ANON_KEY)
│       ├── share.js                  # Web Share API + clipboard fallback
│       └── images.js                 # Three-tier image resolver (DORMANT — no API keys)
│
└── supabase/
    └── functions/
        └── generate-ideas/
            └── index.ts              # Deno edge function — the Claude proxy
```

---

## 6. Page-by-Page Breakdown

### LoginPage (`/`)
- Full-screen sapphire background
- Out Tonight wordmark with gold italic "Tonight"
- SkyHeart SVG logo mark
- Tagline: "Tonight, make it worth remembering."
- Single CTA: "Continue with Google" → `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Redirect URI: `window.location.origin + '/auth/callback'`
- If user already has a session when hitting `/`, they are **not** redirected — they must tap the button. (The `AuthCallbackPage` is what redirects authenticated returning users.)

### AuthCallbackPage (`/auth/callback`)
- On mount: calls `supabase.auth.getSession()` — Supabase v2 auto-exchanges the PKCE code
- Session found → `navigate('/input')`, replace history
- No session / error → `navigate('/')`, replace history
- Renders: centered sapphire screen, "Signing you in…" in DM Mono

### InputPage (`/input`) — Protected
- **Fields:** City (text + geolocation button), Date (date picker), Time (Morning / Afternoon / Evening / Late Night), Group size (1–8 stepper), Tonight's vibe (multi-select chips: Romantic, Adventurous, Chill, Social, Cultural, Foodie, Active, Surprise me), Budget ($ / $$ / $$$ / $$$$)
- **Geolocation:** Browser `navigator.geolocation` → OpenStreetMap Nominatim reverse geocode → populates city field. Timeout 8s, silent failure.
- **First-run hint:** If user has zero swipe history, shows a 3-step mini-guide ("Set your vibe → Get 10 ideas → Save the best")
- **Submit:** Calls `useIdeaGeneration` mutation with all fields + `preferences` loaded from `user_metadata`. Navigates to `/deck` with `{ ideas, params }` in location state.
- **Top bar:** Back chevron (left), wordmark (center), `TopBarAvatar` (right)

### DeckPage (`/deck`) — Protected
- Receives `state.ideas` (array of 10) and `state.params` (original request payload) from navigation
- If no ideas in state → redirects to `/input`
- **IdeaRow** component: expandable card, ruby border
  - Collapsed: numbered index, category badge, title, tagline, vibe tags, price range, duration, heart button, chevron
  - Expanded: description, "Why tonight" callout (ruby left border), logistics block, cost per person, "Learn more →" link, "Share ↑" button
  - Image: `resolveImage()` call loads ambient photo into card header background (dormant if no API keys set — falls back to category gradient)
- **Heart toggle:** Optimistic local state (`savedIds` Set) + immediate Supabase write to `swipes` table. Toggling again removes (writes `direction: 'left'`).
- **View more (+10):** Calls edge function again with `exclude` array of all shown idea titles. Appends new ideas to the list.
- **Bottom bar:** View more (ghost red), View matches (solid red, shows count), New search (ghost)

### MatchesPage (`/matches`) — Protected
- Reads from `swipes` table via `useMatches` hook (TanStack Query, stale 30s)
- Same `MatchRow` card pattern as DeckPage
- Heart tap in MatchRow calls `useRemoveMatch` → deletes or overwrites the swipe row
- **Empty state:** Heart outline icon + "Nothing saved yet." + "Discover tonight →" CTA
- Uses `PageShell` (includes `BottomNav`)

### ProfilePage (`/profile`) — Protected
- **User card:** Avatar (Google photo or initials fallback), name, email, "Since [month year]"
- **Stats:** Saved / Passed / Explored count tiles, pulled from `swipes` table
- **Taste profile:** Top 8 vibe tags from right-swipe `idea_data`, sorted by frequency
- **Preferences:** 6 sections, auto-save on each chip tap with "Saving…" indicator
- Uses `PageShell` (includes `BottomNav`)

---

## 7. Hooks & Utilities

### `useIdeaGeneration.js`
TanStack `useMutation`. POSTs to Supabase edge function `generate-ideas` with JWT in Authorization header. Returns the parsed idea array on success.

### `useSwipeHistory.js`
TanStack `useQuery`. Fetches last 20 right-swipes and last 20 left-swipes for the current user. Extracts `vibe_tags` arrays and flattens into `liked_tags` and `passed_tags` for injection into the next generation prompt.

### `useMatches.js`
- `useMatches()` — TanStack `useQuery`, reads all `direction: 'right'` rows for current user, `staleTime: 30_000`
- `useRemoveMatch()` — Returns an async function that deletes a swipe row by idea_id

### `useUserPreferences.js`
Loads preferences from `user.user_metadata.preferences` on mount. Provides:
- `preferences` — current object (null while loading)
- `saving` — boolean
- `updatePref(key, value)` — sets a single scalar preference
- `toggleArrayPref(key, item)` — adds/removes from an array preference
- Auto-saves via `supabase.auth.updateUser({ data: { preferences } })` on every change
- **Backward compatibility:** coerces legacy string values for `travel_radius` and `transportation` to arrays on load

### `share.js`
`shareIdea(idea, city?)` — attempts `navigator.share` (native sheet on mobile); falls back to `navigator.clipboard.writeText`. Returns `'shared' | 'copied' | 'error'`. Formats a multi-line text block with title, tagline, description, why tonight, logistics, and a learn-more URL.

### `images.js` *(dormant)*
`resolveImage(venueName, city, imageSearchQuery)` — three-tier resolver:
1. Google Places Photos API (requires `VITE_GOOGLE_PLACES_API_KEY`)
2. Unsplash API (requires `VITE_UNSPLASH_ACCESS_KEY`)
3. Returns `null` → caller falls back to category gradient

Both API keys are currently blank in `.env.local`. The function is called in DeckPage and MatchesPage — when keys are absent it silently returns null and the gradient renders instead.

---

## 8. Edge Function

**File:** `supabase/functions/generate-ideas/index.ts`  
**Runtime:** Deno (TypeScript, strict)  
**Deploy command:** `npx supabase functions deploy generate-ideas`

### What it does
1. Validates the `Authorization: Bearer <JWT>` header via Supabase client
2. Parses the JSON body
3. Calls `buildPrompt()` to construct the Claude system prompt
4. Calls `anthropic.messages.create()` with `claude-sonnet-4-5`, `max_tokens: 8192`
5. Extracts the JSON array from the response text (using `indexOf('[')` / `lastIndexOf(']')` — tolerates any preamble)
6. Returns the parsed array

### Request body shape
```typescript
{
  city: string
  date: string            // ISO: "2026-05-25"
  time: string            // "Morning" | "Afternoon" | "Evening" | "Late Night"
  group_size: number
  vibes: string[]
  budget: string          // "$" | "$$" | "$$$" | "$$$$"
  liked_tags: string[]    // from useSwipeHistory — right-swipe vibe_tags
  passed_tags: string[]   // from useSwipeHistory — left-swipe vibe_tags
  exclude?: string[]      // idea titles already shown (View more dedup)
  preferences?: {
    dietary?: string[]        // multi-select
    travel_radius?: string[]  // multi-select
    transportation?: string[] // multi-select
    accessibility?: string[]  // multi-select
    activity_level?: string   // "any" | "low" | "moderate" | "active"
    noise_preference?: string // "any" | "quiet" | "lively"
  }
}
```

### Prompt structure
The prompt is built as a single user message telling Claude it's a local date-night expert. It injects all inputs, then appends preferences as discrete constraint lines only when non-default values are set (e.g., `DIETARY RESTRICTIONS: Vegan, Gluten-free — only suggest food options that accommodate this`). The prompt requests exactly 10 JSON objects with no preamble, no markdown.

### Secrets required
- `ANTHROPIC_API_KEY` — set in Supabase project secrets (not in any file)
- `SUPABASE_URL` — auto-injected by Supabase runtime
- `SUPABASE_ANON_KEY` — auto-injected by Supabase runtime

---

## 13. AI Response Schema

Each idea object returned by the edge function:

```json
{
  "id": "unique_string_no_spaces",
  "title": "Short punchy name (max 5 words)",
  "tagline": "One-sentence hook (max 12 words)",
  "category": "Food | Culture | Adventure | Nightlife | Wellness | Entertainment | Outdoors | Hidden Gem",
  "vibe_tags": ["2 to 4 lowercase tags"],
  "price_range": "$ | $$ | $$$ | $$$$",
  "estimated_cost_per_person": 45,
  "duration_estimate": "2–3 hours",
  "food_included": true,
  "description": "2–3 sentences. Specific venue details. Evocative. Not generic.",
  "why_tonight": "1 sentence on why perfect for this specific date and time.",
  "logistics": "Address or neighborhood. Booking notes. Best arrival time.",
  "venue_name": "Exact venue name for lookup, or null",
  "website_url": "https://... or null",
  "image_search_query": "4–6 word atmospheric Unsplash search query"
}
```

---

## 9. Database Schema

**Project:** Supabase (Postgres)  
**One table: `swipes`**

```sql
create table swipes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  idea_id     text not null,
  direction   text not null check (direction in ('left', 'right')),
  idea_data   jsonb,              -- full idea object (for Matches display without re-fetching)
  created_at  timestamptz default now()
);

-- RLS: users can only read/write their own rows
alter table swipes enable row level security;
create policy "Users own their swipes"
  on swipes for all using (auth.uid() = user_id);
```

**User preferences** are stored in `auth.users.raw_user_meta_data` via `supabase.auth.updateUser({ data: { preferences: {...} } })`. No separate table.

---

## 10. Environment Variables & Secrets

### Client (`.env.local`) — safe to commit structure, not values
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GOOGLE_PLACES_API_KEY=        ← blank / dormant
VITE_UNSPLASH_ACCESS_KEY=          ← blank / dormant
```

### Edge function secrets (Supabase dashboard → Project Settings → Edge Functions → Secrets)
```
ANTHROPIC_API_KEY=sk-ant-...       ← NEVER put this in any file
```

### Vercel environment variables
Vercel must also have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set under Project Settings → Environment Variables (for production builds).

### Supabase Auth redirect URLs
`https://out-tonight-beta.vercel.app` must be listed in Supabase → Authentication → URL Configuration → Redirect URLs.

---

## 11. Deployment

### Frontend — Vercel
- Repo: `https://github.com/jgallo02/out-tonight`
- Branch: `main` → auto-deploys on push
- Build command: `npm run build` (Vite)
- Output directory: `dist`
- `vercel.json` rewrites all routes to `/index.html` (SPA routing)
- Production URL: `https://out-tonight-beta.vercel.app`

### Edge function — Supabase
- Deploy manually from the project directory:
  ```bash
  npx supabase functions deploy generate-ideas
  ```
- Vercel deploys do **not** deploy edge functions — these are separate steps.

### Dev workflow
```bash
# Terminal 1 — client
cd out-tonight
npm run dev          # http://localhost:5173

# To deploy edge function changes:
npx supabase functions deploy generate-ideas
```

---

## 12. Known Constraints & Rules

1. **Never call Claude client-side.** All AI calls go through the edge function. The client never has access to `ANTHROPIC_API_KEY`.

2. **No localStorage or sessionStorage.** All state is in Supabase (DB or user_metadata) or React state passed via router location state.

3. **Images are dormant.** `resolveImage()` always returns null until `VITE_GOOGLE_PLACES_API_KEY` and `VITE_UNSPLASH_ACCESS_KEY` are set. Cards fall back to category gradients gracefully.

4. **Swipe table is append-only by design.** Both saves and unsaves write rows. `useMatches` reads the latest-written row per idea_id. `useRemoveMatch` deletes the row outright.

5. **Edge function is strict TypeScript (Deno).** Types in `buildPrompt` params and the body type in `serve()` must match exactly — the TypeScript compiler rejects structural mismatches at invocation time.

6. **Preferences default values are neutral.** A user with all defaults set gets no preference constraints injected into the prompt (the prompt builder skips neutral values like empty arrays and `'any'`).

7. **`exclude` deduplication is title-based.** "View more" sends the titles of all already-shown ideas in the `exclude` array; Claude is instructed not to repeat them.

---

## 14. Preferences System

Stored in `supabase.auth.users.raw_user_meta_data.preferences`. Loaded and saved by `useUserPreferences.js`.

### Schema
```typescript
{
  dietary:          string[]   // multi — ["Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher", "No shellfish", "Nut-free"]
  travel_radius:    string[]   // multi — ["walkable", "nearby", "citywide", "anywhere"]
  transportation:   string[]   // multi — ["walking", "transit", "driving"]
  accessibility:    string[]   // multi — ["Wheelchair accessible", "Step-free", "Elevator required", "Seated only"]
  activity_level:   string     // single — "any" | "low" | "moderate" | "active"
  noise_preference: string     // single — "any" | "quiet" | "lively"
}
```

### Prompt injection rules
| Field | Injected when | Example prompt line |
|---|---|---|
| `dietary` | Array non-empty | `DIETARY RESTRICTIONS: Vegan, Gluten-free — only suggest food options that accommodate this` |
| `travel_radius` | Array non-empty | `TRAVEL RADIUS: walkable (under 1 mile) or nearby (under 5 miles)` |
| `transportation` | Array non-empty | `TRANSPORTATION: walking or transit — prioritize options accessible by these modes` |
| `accessibility` | Array non-empty | `ACCESSIBILITY: Wheelchair accessible — only suggest venues that meet these requirements` |
| `activity_level` | Not `'any'` | `ACTIVITY LEVEL: low-key & seated` |
| `noise_preference` | Not `'any'` | `ATMOSPHERE: quiet & intimate atmosphere` |

### Backward compatibility
Legacy users who had `travel_radius: 'citywide'` (string) or `transportation: 'any'` (string) stored before the multi-select migration are coerced to arrays on load:
- `'citywide'` → `[]` (neutral, skipped)
- `'any'` → `[]` (neutral, skipped)
- Any other string → `[thatString]`

---

## 15. Build History

Chronological record of every feature built, in order.

### Foundation
- Initialized Vite + React project
- Configured Tailwind CSS v3 with Sapphire & Ruby custom tokens
- Set up Google Fonts (Playfair Display, DM Sans, DM Mono) in `index.html`
- Created `src/lib/supabase.js` client
- Created `.env.local` with placeholder values

### Auth
- Built `LoginPage.jsx` — full-screen splash with Google OAuth CTA
- Built `AuthCallbackPage.jsx` — PKCE session exchange, redirect to `/input`
- Configured `ProtectedRoute` in `App.jsx` — wraps all routes except `/` and `/auth/callback`
- Added `https://out-tonight-beta.vercel.app` to Supabase Auth redirect URL allowlist

### Layout
- Built `BottomNav.jsx` — three tabs (Discover/Matches/Profile), SVG icons, ruby active state
- Built `PageShell.jsx` — max-width wrapper + BottomNav
- Built `TopBarAvatar.jsx` — 32px circle showing Google avatar or initials, taps to `/profile`

### Input form
- Built `InputPage.jsx` with all form fields
- Vibe multi-select chips, budget single-select, group size stepper
- Date picker with default = today, time dropdown

### AI generation
- Built Supabase Edge Function `generate-ideas/index.ts` in Deno TypeScript
- Prompt engineering: city/date/time/group/vibe/budget + liked_tags/passed_tags
- Model: `claude-sonnet-4-5`, 8192 max tokens
- JSON extraction with `indexOf`/`lastIndexOf` (tolerates any preamble)
- Built `useIdeaGeneration.js` hook (TanStack mutation)
- Built `useSwipeHistory.js` hook — reads last 20 right + 20 left swipes for prompt injection

### Results list
- Originally built as a Framer Motion swipe card deck; replaced with expandable list view after persistent React StrictMode desync bugs on card 2
- Built `DeckPage.jsx` with `IdeaRow` component
- Expandable detail panel: description, "Why tonight" callout, logistics, cost, links
- Ruby card borders
- Heart-to-save with optimistic local state + Supabase `swipes` write

### Saved matches
- Built `MatchesPage.jsx` with `MatchRow` (same pattern as IdeaRow)
- Built `useMatches.js` and `useRemoveMatch` — reads/deletes from `swipes` table
- Empty state with CTA back to input

### Profile page
- Built `ProfilePage.jsx` — user card (avatar, name, email, member since)
- Stats tiles: Saved / Passed / Explored (reads `swipes` table)
- Taste profile: top 8 vibe tags from right-swipes, sorted by frequency
- Preferences UI — 6 sections, auto-save on each tap

### Learn more links
- Each expanded card: `website_url` if Claude returned one, otherwise Google Search fallback
- Made unconditional (works for activities without a fixed venue)

### Share feature
- Built `src/lib/share.js` — Web Share API + clipboard fallback
- "Share ↑" button in DeckPage and MatchesPage expanded panels

### Geolocation
- "Use current location" icon button in city field
- Browser Geolocation API → OpenStreetMap Nominatim reverse geocode
- Spinner during lookup, silent failure on deny/timeout

### View more deduplication
- "View more (+10)" calls edge function with `exclude` array of all shown titles
- Edge function injects `ALREADY SHOWN — do not repeat these: ...` into prompt
- Fixed null-guard bug where `params` was null after a page reload

### First-run onboarding hint
- Three-step guide ("Set your vibe → Get 10 ideas → Save the best") shown only when user has zero swipe history

### Images (dormant)
- Built `src/lib/images.js` with three-tier resolver (Google Places → Unsplash → null)
- DeckPage and MatchesPage call `resolveImage()` and use returned URL as card header background
- Both API keys left blank — resolves to null → category gradient renders

### Deployment
- Initialized git repo, pushed to GitHub (`jgallo02/out-tonight`)
- Deployed to Vercel; set env vars; added `vercel.json` SPA rewrite
- Added production URL to Supabase Auth redirect allowlist
- Production: `https://out-tonight-beta.vercel.app`

### User preferences
- Built `useUserPreferences.js` — loads/saves to `user_metadata.preferences`
- Added preferences UI to ProfilePage (6 sections, PrefChip components)
- Updated InputPage to load preferences and pass to edge function
- Updated edge function to accept and inject preferences into prompt
- Fixed TypeScript type mismatch: `Record<string, unknown>` → typed preferences interface

### Multi-select for travel radius & transportation
- Changed `travel_radius` and `transportation` from single-select strings to multi-select string arrays
- Updated ProfilePage chips to use `toggleArrayPref` + `.includes()` check
- Updated edge function types and prompt builder to handle arrays (`join(' or ')`)
- Added backward-compat coercion in `useUserPreferences.js` for legacy string values
