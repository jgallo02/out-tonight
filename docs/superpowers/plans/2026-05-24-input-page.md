# InputPage + Idea Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the InputPage form, a `swipes` table, and a Supabase Edge Function that calls Claude with web_search to generate 10 date-night ideas, then navigates to DeckPage via React Router state.

**Architecture:** Form state lives in local `useState`. On submit, the app queries the user's swipe history from Supabase, calls the `generate-ideas` edge function (which calls Claude server-side), and passes the returned ideas to DeckPage via `navigate('/deck', { state: { ideas } })`.

**Tech Stack:** React 19, Vite, Tailwind (Sapphire & Ruby palette), Supabase JS v2, TanStack Query v5, Supabase Edge Functions (Deno), Anthropic SDK, React Router v7

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/main.jsx` | Modify | Add QueryClientProvider wrapper |
| `supabase/functions/generate-ideas/index.ts` | Create | Edge function: validate JWT, call Claude, return 10 ideas |
| `src/hooks/useSwipeHistory.js` | Create | TanStack Query hook — fetch last 20 right/left swipes, extract vibe tags |
| `src/hooks/useIdeaGeneration.js` | Create | TanStack mutation — invoke generate-ideas edge function |
| `src/pages/InputPage.jsx` | Replace | Full form UI: city, date, time, group size, vibes, budget + submit logic |
| `src/pages/DeckPage.jsx` | Modify | Read `location.state.ideas`, show idea count as proof |

---

## Task 1: Add QueryClientProvider

**Files:**
- Modify: `src/main.jsx`

- [ ] **Replace `src/main.jsx` with:**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
```

- [ ] **Verify dev server still loads** — open `http://localhost:5174`, confirm LoginPage renders with no console errors.

---

## Task 2: Create the `swipes` table in Supabase

**Where:** Supabase Dashboard → SQL Editor → New query

- [ ] **Run this SQL in the Supabase dashboard SQL editor:**

```sql
create table swipes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  idea_id    text not null,
  direction  text not null check (direction in ('left', 'right')),
  idea_data  jsonb not null,
  swiped_at  timestamptz default now() not null
);

alter table swipes enable row level security;

create policy "users manage own swipes"
  on swipes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index swipes_user_direction
  on swipes (user_id, direction, swiped_at desc);
```

- [ ] **Confirm** — in the Supabase Table Editor, the `swipes` table appears with the correct columns.

---

## Task 3: Scaffold the edge function

**Files:**
- Create: `supabase/functions/generate-ideas/index.ts`

- [ ] **Install Supabase CLI if not already installed:**

```bash
brew install supabase/tap/supabase
```

- [ ] **From the `out-tonight/` directory, initialize and link:**

```bash
supabase init
supabase link --project-ref hzzkxwboobnhxgkeamts
```

When prompted for the database password, enter it from your Supabase dashboard → Settings → Database.

- [ ] **Create the function directory and file:**

```bash
mkdir -p supabase/functions/generate-ideas
touch supabase/functions/generate-ideas/index.ts
```

---

## Task 4: Implement the edge function

**Files:**
- Modify: `supabase/functions/generate-ideas/index.ts`

- [ ] **Write the full edge function:**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function buildPrompt(params: {
  city: string
  date: string
  time: string
  group_size: number
  vibes: string[]
  budget: string
  liked_tags: string[]
  passed_tags: string[]
}) {
  const { city, date, time, group_size, vibes, budget, liked_tags, passed_tags } = params
  const vibeStr = vibes.length ? vibes.join(', ') : 'open to anything'
  const likedStr = liked_tags.length ? liked_tags.join(', ') : 'none yet'
  const passedStr = passed_tags.length ? passed_tags.join(', ') : 'none'

  return `You are a local date-night expert for ${city}. Today is ${date}, the outing is ${time}.

Use web_search to find real, currently operating venues and events in ${city}.

GROUP SIZE: ${group_size} people
VIBE: ${vibeStr}
BUDGET: ${budget}  ($ = under $30/person · $$ = $30–60 · $$$ = $60–100 · $$$$ = $100+)
THEMES TO LEAN INTO: ${likedStr}
THEMES TO AVOID: ${passedStr}

Generate exactly 10 unique date-night ideas. Verify venues are real and currently open via web search.

Return ONLY a valid JSON array of exactly 10 objects. No preamble. No markdown fences. Raw JSON only.

Each object must match this schema exactly:
{
  "id": "unique_string_no_spaces",
  "title": "Short punchy name, max 5 words",
  "tagline": "One-sentence hook, max 12 words",
  "category": "Food | Culture | Adventure | Nightlife | Wellness | Entertainment | Outdoors | Hidden Gem",
  "vibe_tags": ["2 to 4 lowercase tags"],
  "price_range": "$ | $$ | $$$ | $$$$",
  "estimated_cost_per_person": 45,
  "duration_estimate": "2–3 hours",
  "food_included": true,
  "description": "2–3 sentences. Specific venue details. Evocative. Not generic.",
  "why_tonight": "1 sentence on why this is perfect for this specific date and time.",
  "logistics": "Address or neighborhood. Booking notes. Best arrival time.",
  "venue_name": "Exact venue name for lookup, or null if not a fixed venue",
  "image_search_query": "4–6 word atmospheric Unsplash search query"
}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Missing authorization' }, 401)

  // Validate JWT
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return json({ error: 'Unauthorized' }, 401)

  let body: {
    city: string
    date: string
    time: string
    group_size: number
    vibes: string[]
    budget: string
    liked_tags: string[]
    passed_tags: string[]
  }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '' })

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: buildPrompt(body) }],
    })

    // Extract the text block — may come after tool_use blocks
    const textBlock = message.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return json({ error: 'No text in Claude response' }, 500)
    }

    const raw = textBlock.text
    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']') + 1
    if (start === -1 || end === 0) return json({ error: 'No JSON array in response' }, 500)

    const ideas = JSON.parse(raw.slice(start, end))
    return json(ideas)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return json({ error: msg }, 500)
  }
})
```

---

## Task 5: Set the Anthropic API key and deploy

- [ ] **Set the secret** (replace `sk-ant-...` with your real key):

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] **Deploy the function:**

```bash
supabase functions deploy generate-ideas
```

Expected output ends with: `Deployed Functions generate-ideas`

- [ ] **Confirm in Supabase dashboard** — Edge Functions → `generate-ideas` appears with a green status.

---

## Task 6: Create `useSwipeHistory` hook

**Files:**
- Create: `src/hooks/useSwipeHistory.js`

- [ ] **Write the hook:**

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useSwipeHistory() {
  return useQuery({
    queryKey: ['swipe-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { liked_tags: [], passed_tags: [] }

      const [{ data: right }, { data: left }] = await Promise.all([
        supabase
          .from('swipes')
          .select('idea_data')
          .eq('user_id', user.id)
          .eq('direction', 'right')
          .order('swiped_at', { ascending: false })
          .limit(20),
        supabase
          .from('swipes')
          .select('idea_data')
          .eq('user_id', user.id)
          .eq('direction', 'left')
          .order('swiped_at', { ascending: false })
          .limit(20),
      ])

      const dedup = (arr) => [...new Set(arr)]

      const liked_tags = dedup((right ?? []).flatMap((s) => s.idea_data?.vibe_tags ?? []))
      const passed_tags = dedup((left ?? []).flatMap((s) => s.idea_data?.vibe_tags ?? []))

      return { liked_tags, passed_tags }
    },
    staleTime: 30_000,
  })
}
```

---

## Task 7: Create `useIdeaGeneration` hook

**Files:**
- Create: `src/hooks/useIdeaGeneration.js`

- [ ] **Write the hook:**

```javascript
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useIdeaGeneration() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.functions.invoke('generate-ideas', {
        body: payload,
      })
      if (error) throw new Error(error.message)
      if (!Array.isArray(data)) throw new Error('Unexpected response format')
      return data
    },
  })
}
```

---

## Task 8: Build InputPage

**Files:**
- Replace: `src/pages/InputPage.jsx`

- [ ] **Write the full InputPage:**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSwipeHistory } from '../hooks/useSwipeHistory'
import { useIdeaGeneration } from '../hooks/useIdeaGeneration'

// ── Palette (Sapphire & Ruby) ──────────────────────────────────────────────
const C = {
  page:     '#0c1538',
  surface:  '#16204a',
  ink:      '#efe5d2',
  inkDim:   'rgba(239,229,210,0.62)',
  inkFaint: 'rgba(239,229,210,0.32)',
  inkHair:  'rgba(239,229,210,0.14)',
  red:      '#c8243a',
  wine:     '#e8a832',
}

// ── Chevron icon ──────────────────────────────────────────────────────────
function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11 4 L6 9 L11 14" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── SkyHeart mark (small) ─────────────────────────────────────────────────
const SKY_PATH = 'M -16 0 L -16 -10 L -14 -10 L -14 -16 L -12 -16 L -12 -20 L -11 -23 L -10 -20 L -10 -16 L -8 -16 L -8 -10 L -6 -10 L -6 0 L -4 0 L -4 -14 L -3 -14 L -3 -16 L -1 -19 L 1 -16 L 1 -14 L 2 -14 L 2 0 L 5 0 L 5 -8 L 14 -8 L 14 -11 L 16 -11 L 16 0 L 0 14 Z'

function MarkSmall() {
  return (
    <svg width="14" height="14" viewBox="-22 -26 44 44" style={{ display: 'block' }}>
      <path d={SKY_PATH} fill="none" stroke={C.wine} strokeWidth={1.5} strokeLinejoin="miter" strokeLinecap="square" vectorEffect="non-scaling-stroke"/>
    </svg>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <span style={{
        fontFamily: '"DM Mono", monospace', textTransform: 'uppercase',
        fontSize: 9, letterSpacing: '0.26em', color: C.inkDim,
      }}>{label}</span>
      <div style={{
        background: C.surface, border: `1px solid ${C.inkHair}`,
        borderRadius: 14, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {children}
      </div>
    </div>
  )
}

const VIBES = ['Romantic', 'Adventurous', 'Chill', 'Social', 'Cultural', 'Foodie', 'Active', 'Surprise me']
const BUDGETS = ['$', '$$', '$$$', '$$$$']
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Late Night']

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export default function InputPage() {
  const navigate = useNavigate()
  const { data: history } = useSwipeHistory()
  const { mutateAsync: generateIdeas, isPending, error: genError } = useIdeaGeneration()

  const [city, setCity] = useState('')
  const [date, setDate] = useState(todayISO())
  const [time, setTime] = useState('Evening')
  const [groupSize, setGroupSize] = useState(2)
  const [vibes, setVibes] = useState([])
  const [budget, setBudget] = useState('$$')

  function toggleVibe(v) {
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  async function handleSubmit() {
    if (!city.trim() || isPending) return
    try {
      const ideas = await generateIdeas({
        city: city.trim(),
        date,
        time,
        group_size: groupSize,
        vibes,
        budget,
        liked_tags: history?.liked_tags ?? [],
        passed_tags: history?.passed_tags ?? [],
      })
      navigate('/deck', { state: { ideas } })
    } catch {
      // error shown via genError
    }
  }

  const canSubmit = city.trim().length > 0 && !isPending

  return (
    <div style={{ minHeight: '100dvh', background: C.page, display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '48px 22px 18px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
          <ChevronLeft />
          <span style={{ fontFamily: '"DM Mono", monospace', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.26em', color: C.inkDim }}>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MarkSmall />
          <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 13, fontWeight: 500, color: C.ink }}>
            Out <span style={{ fontStyle: 'italic', color: C.wine }}>Tonight</span>
          </span>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Headline */}
        <h1 style={{ margin: 0, fontFamily: '"Playfair Display", Georgia, serif', fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, color: C.ink }}>
          Where are we <span style={{ fontStyle: 'italic', color: C.wine }}>going?</span>
        </h1>

        {/* City */}
        <Field label="City">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" stroke={C.inkDim} strokeWidth="1.2" fill="none"/>
            <circle cx="7" cy="5" r="1.5" stroke={C.inkDim} strokeWidth="1.2" fill="none"/>
          </svg>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Brooklyn, NY"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: '"DM Sans", sans-serif', fontSize: 15, color: C.ink,
            }}
          />
        </Field>

        {/* Date + Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.ink,
                colorScheme: 'dark',
              }}
            />
          </Field>
          <Field label="Time">
            <select
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.ink,
                colorScheme: 'dark', cursor: 'pointer',
              }}
            >
              {TIMES.map(t => <option key={t} value={t} style={{ background: C.surface }}>{t}</option>)}
            </select>
          </Field>
        </div>

        {/* Group size */}
        <Field label="Who's coming">
          <span style={{ flex: 1, fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: C.ink }}>
            {groupSize} {groupSize === 1 ? 'person' : 'people'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {[['−', () => setGroupSize(n => Math.max(1, n - 1))], ['+', () => setGroupSize(n => Math.min(8, n + 1))]].map(([sym, fn]) => (
              <button key={sym} onClick={fn} style={{
                width: 28, height: 28, borderRadius: 999, background: C.page,
                border: `1px solid ${C.inkHair}`, color: C.ink, cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{sym}</button>
            ))}
          </div>
        </Field>

        {/* Vibe chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.26em', color: C.inkDim }}>Tonight's vibe</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {VIBES.map(v => {
              const selected = vibes.includes(v)
              return (
                <button key={v} onClick={() => toggleVibe(v)} style={{
                  padding: '8px 14px', borderRadius: 999,
                  border: selected ? `1px solid transparent` : `1px solid ${C.inkHair}`,
                  background: selected ? C.red : 'transparent',
                  color: selected ? C.ink : C.inkDim,
                  fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: selected ? 600 : 500,
                  cursor: 'pointer', letterSpacing: '0.01em',
                }}>{v}</button>
              )
            })}
          </div>
        </div>

        {/* Budget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.26em', color: C.inkDim }}>Budget</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {BUDGETS.map(b => {
              const selected = budget === b
              return (
                <button key={b} onClick={() => setBudget(b)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 999,
                  border: selected ? `1px solid transparent` : `1px solid ${C.inkHair}`,
                  background: selected ? C.red : 'transparent',
                  color: selected ? C.ink : C.inkDim,
                  fontFamily: '"DM Mono", monospace', fontSize: 12, fontWeight: selected ? 600 : 400,
                  cursor: 'pointer', letterSpacing: '0.04em',
                }}>{b}</button>
              )
            })}
          </div>
        </div>

      </div>

      {/* Sticky CTA */}
      <div style={{ padding: '12px 22px 40px', background: C.page }}>
        {genError && (
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: C.red, marginBottom: 10, textAlign: 'center' }}>
            {genError.message}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%', padding: '15px 22px', borderRadius: 999, border: 'none',
            background: canSubmit ? C.red : 'rgba(200,36,58,0.35)',
            color: canSubmit ? C.ink : C.inkFaint,
            fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: canSubmit ? '0 6px 18px rgba(200,36,58,0.28)' : 'none',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          {isPending ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 15" strokeLinecap="round"/>
              </svg>
              Finding ideas…
            </>
          ) : 'Find ideas →'}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

    </div>
  )
}
```

- [ ] **Hard refresh the browser** — navigate to `http://localhost:5174`, sign in, confirm the InputPage renders with the form fields.

- [ ] **Verify city validation** — "Find ideas" button should be muted when city is empty, ruby red when city has text.

---

## Task 9: Update DeckPage stub

**Files:**
- Modify: `src/pages/DeckPage.jsx`

- [ ] **Replace with a stub that reads the ideas from router state:**

```jsx
import { useLocation } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'

export default function DeckPage() {
  const { state } = useLocation()
  const ideas = state?.ideas ?? []

  return (
    <PageShell>
      <div style={{ padding: 32, color: '#efe5d2', fontFamily: '"DM Mono", monospace', fontSize: 12 }}>
        <p style={{ marginBottom: 16, color: '#e8a832' }}>DECK — {ideas.length} ideas received</p>
        {ideas.map((idea, i) => (
          <p key={idea.id} style={{ marginBottom: 6, opacity: 0.7 }}>
            {i + 1}. {idea.title} — {idea.category}
          </p>
        ))}
      </div>
    </PageShell>
  )
}
```

---

## Task 10: End-to-end test

- [ ] **Sign in** at `http://localhost:5174`
- [ ] **Fill in the form** — city: "Brooklyn, NY", Evening, 2 people, Romantic + Foodie, $$
- [ ] **Tap "Find ideas →"** — button changes to "Finding ideas…" spinner
- [ ] **Confirm DeckPage loads** — should show "DECK — 10 ideas received" with titles listed
- [ ] **If edge function fails**, check the Supabase dashboard → Edge Functions → `generate-ideas` → Logs for the error detail
