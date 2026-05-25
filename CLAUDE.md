# Out Tonight — Claude Code Context

## What this is
A mobile-first React web app that surfaces unique date night ideas via AI.
Core experience: user inputs preferences → Claude API generates 10 ideas → Tinder-style swipe deck → saved matches.

## Tech stack
- React + Vite
- Tailwind CSS (custom design system — see tokens below)
- Supabase (auth + database)
- Google OAuth via Supabase Auth
- Anthropic Claude API (claude-sonnet-4-20250514) with web_search tool
- Framer Motion for animations
- React Router v6
- TanStack Query for data fetching

## Design system
DO NOT deviate from these values. The visual language is "Cream & Cinema" — warm paper page, near-black ink, cinema red as primary accent, deep wine for italic/emphasis. Card fronts are always dark (full-bleed photo or dark gradient), framed by the cream page chrome.

### Color tokens
```
Page (bg):          #f6ecd9   ← warm cream paper — the app background
Page warm:          #f2e4d0   ← card backs, input surfaces, bottom nav
Page soft:          #edddd0   ← peek cards behind the active card
Ink:                #1a0a08   ← near-black — primary text
Ink soft:           #4a2a22   ← secondary text
Ink dim:            rgba(26,10,8,0.55)
Ink faint:          rgba(26,10,8,0.32)
Ink hair:           rgba(26,10,8,0.12)  ← borders / dividers
Red (primary):      #c8362b   ← cinema red — CTAs, active nav, like overlay, badges
Red deep:           #a02420
Wine (italic):      #6b1820   ← italic emphasis on titles, secondary accent
Wine soft:          rgba(107,24,32,0.08)  ← "Why tonight" callout bg
Like overlay:       rgba(200,54,43,0.35) radial-gradient tint
Pass overlay:       rgba(107,24,32,0.40) radial-gradient tint
```

### Typography
```
Serif (headings / card titles):  Playfair Display — italic weight for emphasis and wine-colored portions
Sans (body / UI):                 DM Sans
Mono (labels / badges / caps):    DM Mono — uppercase, letterspacing 0.22–0.32em
```
Load from Google Fonts: Playfair Display (ital,wght@0,400;0,500;0,700;1,400;1,500;1,600), DM Sans (wght@300;400;500;600), DM Mono (wght@400;500)

### Geometry
```
Card radius:         22px
Button / input radii: 8–14px
Pill (badges, CTAs): 999px
Max content width:   430px, centered
```

### Motion
```
Card flip:    rotateY(180deg), perspective 1000px, 400ms ease
Swipe commit: translate off-screen 600px, 300ms ease-out
Spring-back:  framer-motion spring, stiffness 400 damping 30
Overlay:      opacity 0 → 0.9 proportional to drag distance
Stack advance: scale 0.96→1.00, 250ms ease
```

## File structure
```
src/
  components/
    cards/          ← IdeaCard.jsx  (the swipe card — DO NOT modify swipe physics or flip animation)
    ui/             ← Badge.jsx, Pill.jsx, Button.jsx, Toggle.jsx
    layout/         ← BottomNav.jsx, PageShell.jsx
  pages/
    LoginPage.jsx
    InputPage.jsx
    DeckPage.jsx
    MatchesPage.jsx
    ProfilePage.jsx
    AuthCallbackPage.jsx
  hooks/
    useSwipeHistory.js    ← queries Supabase for past swipes
    useIdeaGeneration.js  ← calls the edge function, returns 10 ideas
    useMatches.js         ← manages matches CRUD
  lib/
    supabase.js           ← Supabase client
    anthropic.js          ← (thin wrapper — actual Claude call is in edge function)
    images.js             ← hybrid image resolver (Google Places → Unsplash → gradient)
  App.jsx
  main.jsx
```

## Design reference files
The folder `out-tonight/project/` contains the full design prototype (JSX + HTML). When building any screen, cross-reference these files first:
- `screens-cards.jsx`           → card front, card back, swipe overlays, action buttons
- `screens-onboarding-input.jsx` → input/preferences form
- `screens-matches-profile.jsx`  → matches list and profile screen
- `screen-shell.jsx`            → BottomNav, MobileFrame, UI primitives (CategoryBadge, VibeChip, RedCTA, GhostCTA, FieldRow)
- `palettes.jsx`                → all color palettes (use the Cream & Cinema values in this CLAUDE.md)

Match the visual output of the prototypes. The prototype files use plain JS and CSS vars — your job is to re-create them in React with the real data layer.

## Critical behaviors

1. **Claude API must NEVER be called client-side.** Use a Supabase Edge Function as the proxy. The edge function receives session inputs + swipe history and returns the 10-idea JSON array. The client never sees the API key.

2. **IdeaCard.jsx swipe physics** — preserve exactly:
   - Drag threshold to commit: 100px offset OR velocity > 500px/s
   - Spring-back if not committed (framer-motion spring, stiffness 400 damping 30)
   - Overlay opacity proportional to drag progress (0 → 0.9)
   - Flip disabled while dragging; dragging disabled when flipped to back

3. **Every swipe writes immediately** to Supabase `swipes` table before the next card animates in.

4. **Before each AI call**, query the last 20 right-swipes and 20 left-swipes for the current user and inject into the prompt as liked_tags / passed_tags.

5. **Image resolution** — three-tier fallback in `images.js`:
   - FIRST: Google Places Photos API using `venue_name + city` (real venue photo)
   - SECOND: Unsplash API using `image_search_query` (atmospheric fallback)
   - THIRD: CSS category gradient if both fail (return null — IdeaCard handles the gradient)

## Claude API response schema
The edge function returns exactly this shape:
```json
[
  {
    "id": "unique_string",
    "title": "Short punchy name",
    "tagline": "One-sentence hook, max 12 words",
    "category": "Food | Culture | Adventure | Nightlife | Wellness | Entertainment | Outdoors | Hidden Gem",
    "vibe_tags": ["2 to 4 tags"],
    "price_range": "$ | $$ | $$$ | $$$$",
    "estimated_cost_per_person": 45,
    "duration_estimate": "2–3 hours",
    "food_included": true,
    "description": "2–3 sentences. Specific. Evocative. Not generic.",
    "why_tonight": "1 sentence on why this is great for THIS date, time, and season.",
    "logistics": "Address or neighborhood, booking notes, best arrival time.",
    "venue_name": "Exact venue name for Google Places lookup, or null if not a fixed venue",
    "image_search_query": "4–6 word Unsplash fallback search query"
  }
]
```

## Known constraints
- Mobile-first. Max content width 430px, centered.
- No localStorage or sessionStorage — all state in Supabase or React state.
- Framer Motion for card swipe animations; CSS transition for flip (not Framer Motion).
- TanStack Query for all Supabase reads.
- Tailwind utility classes everywhere EXCEPT IdeaCard.jsx, where swipe physics require dynamic inline styles.
- The card prototype uses CSS variables (`var(--red)`, `var(--ink)`, etc.) — in the React app, use the hex values from this file's color tokens section or the Tailwind config below.

## Tailwind config (`tailwind.config.js`)
```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page:    '#f6ecd9',
        surface: '#f2e4d0',
        soft:    '#edddd0',
        ink:     '#1a0a08',
        red:     '#c8362b',
        wine:    '#6b1820',
        muted:   'rgba(26,10,8,0.55)',
        border:  'rgba(26,10,8,0.12)',
        like:    '#c8362b',
        pass:    '#6b1820',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

## Environment variables (`.env.local`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_PLACES_API_KEY=
VITE_UNSPLASH_ACCESS_KEY=
```
Note: The Anthropic API key lives ONLY in Supabase secrets (`ANTHROPIC_API_KEY`). It is never exposed to the client.
