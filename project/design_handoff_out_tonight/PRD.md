# Product Requirements Document
## Out Tonight
**Version:** 1.0 — Lovable Build Brief  
**Date:** May 2026  
**Status:** Ready for Development

---

## 1. Product Overview

### 1.1 Purpose
A mobile-first web app that surfaces unique, timely date night ideas — not dinner-and-a-movie defaults, but genuinely interesting, memorable experiences. Ideas are personalized to the user's vibe, budget, group size, location, and time — and get smarter with every swipe.

### 1.2 Core Experience Loop
User inputs preferences → AI generates 10 tailored idea cards → User swipes right (save) or left (pass) or taps to flip for details → Saved matches persist to a personal list → Future sessions learn from past swipe behavior.

### 1.3 Target User
Couples or small groups looking for experiences beyond the usual. People who want to be surprised and delighted, not handed a Yelp list.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend Framework | React (Lovable-generated) |
| Auth | Google OAuth (via Supabase Auth) |
| Database | Supabase (PostgreSQL) |
| AI / Idea Generation | Anthropic Claude API (claude-sonnet-4-20250514) with web search tool enabled |
| Deployment | Lovable / Vercel |
| Styling | Tailwind CSS |

---

## 3. Authentication

### 3.1 Google Sign-In
- Users must sign in with Google to use the app
- Auth handled via Supabase Auth with Google OAuth provider
- On first sign-in, a user profile record is created in Supabase
- Session persists across visits (no re-login unless explicitly signed out)
- Unauthenticated users see a branded splash/landing screen with a "Sign in with Google" CTA

### 3.2 User Profile (Supabase: `profiles` table)
```
id (uuid, FK to auth.users)
email
display_name
avatar_url
created_at
```

---

## 4. User Input Flow

### 4.1 Input Screen
Displayed after login on first visit and on each new search. Clean, mobile-optimized form with the following fields:

| Field | Type | Notes |
|---|---|---|
| City | Text input with autocomplete | e.g. "New York, NY" |
| Date | Date picker | Defaults to today |
| Time of day | Select | Morning / Afternoon / Evening / Late Night |
| Number of people | Stepper (1–10+) | Defaults to 2 |
| Vibe / Type of night | Multi-select chips | Options: Romantic, Adventurous, Relaxed, Formal, Casual, Quirky, Cultural, Active, Cozy, Spontaneous |
| Budget (per person) | Range slider | $25 – $500+, shown as "Under $X per person" |
| Food included? | Toggle | Yes / No |
| Dietary restrictions | Multi-select (shown if food = Yes) | Vegetarian, Vegan, Gluten-Free, Kosher, Halal, Nut Allergy, No restrictions |
| Anything you've loved before? | Optional free text | e.g. "We did sumo wrestling last month and loved it" |

### 4.2 Behavior
- "Find Ideas" button triggers AI search
- Loading state: animated card deck building (skeleton shimmer + copy like "Searching for something worth remembering...")
- Inputs are saved to Supabase per user session so they persist if the user refreshes

---

## 5. AI Idea Generation

### 5.1 API Configuration
- Model: `claude-sonnet-4-20250514`
- Tools: `web_search` enabled (to surface real, timely local events)
- Max tokens: 4000
- Returns exactly 10 idea objects as structured JSON

### 5.2 Prompt Strategy
The system prompt instructs Claude to:
- Act as a hyper-local date night curator who knows about hidden gems and upcoming events
- Avoid obvious/generic suggestions (no "grab dinner", no mainstream chains, no "visit a museum" without specificity)
- Factor in: city, date, time of day, group size, vibe, budget, dietary needs, and the user's free-text input
- Reference real venues, real events, or real neighborhoods where possible (using web search)
- Weight suggestions toward experiences that are time-sensitive or seasonally relevant
- If the user has past swipe history, incorporate it: avoid anything similar to left-swipes, lean into patterns from right-swipes

### 5.3 Personalization Layer
Before each AI call, the app queries Supabase for:
- The user's last 20 right-swipes (liked ideas)
- The user's last 20 left-swipes (passed ideas)
- Tags/themes extracted from those swipes

This history is appended to the AI prompt as:
```
User has previously liked: [list of titles/tags]
User has previously passed on: [list of titles/tags]
Weight results accordingly. Do not repeat ideas they have seen before.
```

### 5.4 JSON Response Schema
Each of the 10 ideas must conform to:
```json
{
  "id": "unique_string",
  "title": "Short punchy name",
  "tagline": "One-sentence hook (max 12 words)",
  "category": "one of: Food, Culture, Adventure, Nightlife, Wellness, Entertainment, Outdoors, Hidden Gem",
  "vibe_tags": ["array", "of", "2-4", "tags"],
  "price_range": "$" | "$$" | "$$$" | "$$$$",
  "estimated_cost_per_person": 45,
  "duration_estimate": "2–3 hours",
  "food_included": true,
  "description": "2–3 sentence description. Specific. Evocative. Not generic.",
  "why_tonight": "1 sentence on why this is great for THIS date/time/season.",
  "logistics": "Address or neighborhood, any booking notes, best arrival time.",
  "image_search_query": "Descriptive string for an image API call"
}
```

---

## 6. Card Swipe Interface

### 6.1 Card Stack
- 10 cards displayed as a visual stack (cards 2–4 peeking behind the front card)
- Front card is the active interaction target
- Progress indicator: "3 of 10" shown subtly at top

### 6.2 Card Front (Default State)
- Full-bleed background image (fetched via Unsplash API using `image_search_query`)
- Gradient overlay (bottom-up, dark to transparent) for text legibility
- Bottom section:
  - Category badge (pill label)
  - Title (large, bold)
  - Tagline
  - Vibe tags (small pills)
  - Price range + estimated cost per person
  - Duration estimate
  - "Tap to flip" affordance (subtle icon)

### 6.3 Card Back (Flipped State)
- Tap anywhere on front triggers 3D flip animation (CSS transform)
- Back shows:
  - Full description
  - "Why tonight" callout (highlighted, distinct style)
  - Logistics / booking info
  - Tap again to flip back

### 6.4 Swipe Mechanics
- Swipe right → Save to Matches (green overlay + ❤️ animation)
- Swipe left → Pass (red overlay + ✕ animation)
- Button alternatives below card: ✕ and ❤️ tap targets for non-swipe users
- After all 10 cards: "That's a wrap" screen with count of matches and CTA to view matches or search again

### 6.5 Swipe Data Stored (Supabase: `swipes` table)
```
id
user_id
idea_id
idea_title
idea_json (full JSON blob)
direction ('right' | 'left')
session_city
session_date
vibe_tags
created_at
```

---

## 7. Matches Screen

### 7.1 Access
- Bottom nav icon (heart) or from end-of-deck screen
- Displays all right-swiped ideas, newest first

### 7.2 Match Card (List View)
- Thumbnail image (left)
- Title, tagline, category badge, cost estimate, date saved
- Tap to expand full detail view (same content as card back)

### 7.3 Actions on Match
- Remove from matches (with confirmation)
- Share (native share sheet with title + tagline)
- (Future: Book / external link)

---

## 8. Navigation

Bottom tab bar (mobile-first):
| Tab | Icon | Screen |
|---|---|---|
| Discover | Compass | Input form / card deck |
| Matches | Heart | Saved matches list |
| Profile | Person | Account info, sign out |

---

## 9. Profile Screen

- Google avatar + display name
- Stats: Total swipes, Total matches, Cities explored
- Sign out button
- (Future: notification preferences, feedback)

---

## 10. Database Schema (Supabase)

### `profiles`
| Column | Type |
|---|---|
| id | uuid (PK, FK auth.users) |
| email | text |
| display_name | text |
| avatar_url | text |
| created_at | timestamp |

### `sessions`
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid (FK profiles) |
| city | text |
| session_date | date |
| time_of_day | text |
| group_size | int |
| vibe_tags | text[] |
| budget_per_person | int |
| food_included | bool |
| dietary_restrictions | text[] |
| free_text_input | text |
| created_at | timestamp |

### `swipes`
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid (FK profiles) |
| session_id | uuid (FK sessions) |
| idea_id | text |
| idea_title | text |
| idea_json | jsonb |
| direction | text ('right' or 'left') |
| vibe_tags | text[] |
| created_at | timestamp |

---

## 11. Design Direction

### 11.1 Aesthetic
- **Mobile-first**, card-forward UI
- **Warm, editorial feel** — think a stylish city magazine crossed with a dating app
- Dark backgrounds with rich, warm accent colors (deep plum, amber, cream)
- Full-bleed photography as primary visual element
- Typography: editorial serif for titles, clean sans for body
- Generous use of blur/frosted glass effects for overlays

### 11.2 Motion
- Card flip: smooth 3D CSS transform (0.4s)
- Swipe: spring physics on drag, snap back if not committed
- Like/pass overlays: fast fade in with scale (0.15s)
- Stack: subtle stagger/parallax as cards advance

### 11.3 Empty States
- No matches yet: "Nothing saved yet. Start swiping."
- No results returned: "Claude came up empty. Try a different vibe or city."

---

## 12. Error Handling

| Scenario | Behavior |
|---|---|
| AI API failure | Show retry screen: "Something went sideways. Try again." |
| No internet | Offline banner |
| Image load failure | Fallback gradient background using category color |
| Auth failure | Redirect to login with error message |

---

## 13. Out of Scope (v1)

- Push notifications
- Social / sharing between users
- External booking/reservation integration
- Native iOS/Android app
- Offline mode
- Admin dashboard

---

## 14. Success Metrics (Post-Launch)

- Sessions per user per month
- Average swipes per session
- Match rate (right swipes / total swipes)
- Return visit rate (did they come back?)
- Cities covered

---

## 15. Open Questions for Naming

Possible directions to explore before naming:
- **Experience-forward**: something that evokes "the good stuff" / discovery
- **Playful/couples-coded**: warm, inviting, a little cheeky
- **Location-agnostic**: works in any city, not NYC-specific
- **Short, memorable, one word or two**: domain-friendly

Placeholder: `NightFind` / `FlickDate` / `Unplan` — to be decided before branding pass.

---

*End of PRD v1.0*
