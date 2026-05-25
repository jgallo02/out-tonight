# InputPage + Generate Ideas — Design Spec
Date: 2026-05-24

## Overview
Build the InputPage form, a Supabase `swipes` table, and a `generate-ideas` edge function that calls Claude with web_search to produce 10 date-night ideas. On submit, ideas are passed to DeckPage via React Router state.

---

## InputPage UI

**Route:** `/input`
**Shell:** `<PageShell hideNav>` — BottomNav is hidden; this is a task-focused form, not a tab root  
**Reference:** `project/screens-onboarding-input.jsx` → `InputFormScreen`  
**Palette:** Sapphire & Ruby (page `#0c1538`, ink `#efe5d2`, red `#c8243a`, wine/gold `#e8a832`)

### Layout
- Top bar: back chevron (left), wordmark centered (Mark + "Out Tonight"), spacer (right)
- Serif headline: `Where are we` + italic gold `going?` — no "Tonight's brief" eyebrow label
- Scrollable form fields below headline
- Fixed "Find ideas" CTA pinned to bottom

### Form Fields

| Field | Component | Default | Notes |
|---|---|---|---|
| City | Text input with pin icon | empty | Required — CTA disabled until filled |
| Date | Native date input | today | Formatted display: `Thu · May 24` |
| Time | 4-option pill select | Evening | Morning / Afternoon / Evening / Late Night |
| Group size | Stepper (− / n / +) | 2 | Range 1–8 |
| Vibe chips | Multi-select wrapping pills | none | Romantic, Adventurous, Chill, Social, Cultural, Foodie, Active, Surprise me |
| Budget | Single-select 4-pill row | $$ | $ / $$ / $$$ / $$$$ |

### CTA States
- **Disabled:** city empty — muted styling, no click
- **Idle:** full ruby red pill, "Find ideas →" 
- **Loading:** spinner + "Finding ideas…", non-interactive
- **Error:** red error message below CTA, button re-enabled

### Form State
All fields in local `useState`. No persistence — form resets each session.

### On Submit
1. Query Supabase for current user's last 20 right-swipes and 20 left-swipes
2. Extract `vibe_tags` from each into `liked_tags` / `passed_tags` arrays
3. Call `supabase.functions.invoke('generate-ideas', { body: { city, date, time, group_size, vibes, budget, liked_tags, passed_tags } })`
4. On success: `navigate('/deck', { state: { ideas } })`
5. On error: show inline error message, re-enable button

---

## Database

### `swipes` table
```sql
create table swipes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  idea_id    text not null,
  direction  text not null check (direction in ('left', 'right')),
  idea_data  jsonb not null,
  swiped_at  timestamptz default now() not null
);

-- RLS
alter table swipes enable row level security;

create policy "users manage own swipes"
  on swipes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for history queries
create index swipes_user_direction on swipes (user_id, direction, swiped_at desc);
```

---

## Edge Function: `generate-ideas`

**Location:** `supabase/functions/generate-ideas/index.ts`  
**Runtime:** Deno (Supabase standard)  
**Model:** `claude-sonnet-4-20250514` with `web_search` tool  
**Auth:** Validates Supabase JWT from `Authorization` header — rejects anonymous calls

### Request body
```ts
{
  city: string
  date: string          // ISO: "2026-05-24"
  time: string          // "Morning" | "Afternoon" | "Evening" | "Late Night"
  group_size: number
  vibes: string[]
  budget: string        // "$" | "$$" | "$$$" | "$$$$"
  liked_tags: string[]  // from last 20 right-swipes
  passed_tags: string[] // from last 20 left-swipes
}
```

### Response
Array of 10 idea objects matching the schema in CLAUDE.md:
```ts
{ id, title, tagline, category, vibe_tags, price_range, estimated_cost_per_person,
  duration_estimate, food_included, description, why_tonight, logistics,
  venue_name, image_search_query }[]
```

### Prompt strategy
- System: act as a local expert for `city`, today is `date`, time is `time`
- User: group of `group_size`, vibes: `vibes`, budget: `budget`
- Personalization: avoid themes from `passed_tags`, lean toward `liked_tags`
- Use `web_search` to verify real venues, current hours, and booking availability
- Return raw JSON array only — no preamble, no markdown fences

### Environment variable
`ANTHROPIC_API_KEY` — set via `supabase secrets set ANTHROPIC_API_KEY=sk-...`

---

## Data Flow
```
InputPage (form state)
  → query swipes table (liked/passed tags)
  → supabase.functions.invoke('generate-ideas')
      → validate JWT
      → call Claude API (web_search)
      → return 10-idea array
  → navigate('/deck', { state: { ideas } })
DeckPage reads location.state.ideas
```

---

## Out of Scope (this session)
- Image resolution (Google Places / Unsplash) — images.js is a future session
- DeckPage swipe implementation — stub only for now
- Matches persistence — future session
