# DeckPage — Design Spec
Date: 2026-05-24

## Overview
Build the full DeckPage swipe experience: card stack orchestration, Tinder-style swipe physics via the existing IdeaCard component, fire-and-forget Supabase persistence on each swipe, and an end-of-deck "That's a wrap" screen.

---

## Architecture

**Approach:** Option A — DeckPage owns all deck logic. `IdeaCard.jsx` is used untouched. DeckPage provides its own action buttons styled in Sapphire & Ruby.

**Data source:** `location.state.ideas` — the 10-idea array passed from InputPage via `navigate('/deck', { state: { ideas, city, time } })`.

**Guard:** If `location.state` is missing or empty, immediately `navigate('/input', { replace: true })`.

**State owned by DeckPage:**
- `currentIndex` — which card is active (0–9)
- `savedCount` — right-swipe count this session
- `isDone` — true after the 10th card is swiped

**Session:** Fetched once on mount via `supabase.auth.getSession()`, stored in a ref. Used for `user_id` in swipe inserts. No re-renders triggered.

---

## Data Flow

```
InputPage
  → navigate('/deck', { state: { ideas, city, time } })

DeckPage (mounts)
  → reads location.state.ideas (10 items)
  → reads location.state.city + location.state.time for top bar context pill
  → fetches session once (ref, not state)

User swipes / taps action button
  → handleSwipe(direction)
      → fire-and-forget: supabase.from('swipes').insert({ user_id, idea_id, direction, idea_data })
      → if direction === 'right': savedCount++
      → currentIndex++
      → if currentIndex >= 10: isDone = true

isDone = true
  → show EndOfDeckScreen
  → "View matches" → navigate('/matches')
  → "Shuffle a fresh deck" → navigate('/input')
```

---

## DeckPage Layout

**Route:** `/deck`
**Shell:** `<PageShell hideNav>` — BottomNav hidden, task-focused
**Palette:** Sapphire & Ruby (page `#0c1538`, surface `#16204a`, ink `#efe5d2`, red `#c8243a`, wine `#e8a832`)

### Top bar
- Left: back chevron + "Back" → `navigate('/input')`
- Center: Mark icon (gold) + "Out Tonight" wordmark (Playfair Display)
- Right: context pill — city + time (e.g. "Nassau County · Evening"), DM Mono 9px, ink-dim, pulled from `location.state`

### Card stack
- Container: `position: relative`, width 312px, height 440px, centered
- Renders cards at indices `currentIndex`, `currentIndex+1`, `currentIndex+2` (clamped to array length)
- Peek cards (indices +1, +2): `<IdeaCard isActive={false} stackOffset={1|2} />`
- Active card (index 0): `<IdeaCard isActive={true} onSwipe={handleSwipe} />`
- Cards rendered back-to-front (index+2 first, then index+1, then active on top)

### Action buttons (DeckPage-owned, Sapphire & Ruby)
- Centered row, 28px gap, `marginTop: 22px`
- **Pass (×):** 58px circle, `background: #16204a`, `border: 1px solid rgba(239,229,210,0.14)`, ink-dim × icon
- **Like (♥):** 58px circle, `background: #16204a`, `border: 1px solid #c8243a`, ruby heart icon
- Both call `handleSwipe('left')` / `handleSwipe('right')`

---

## Swipe Persistence

On each `handleSwipe(direction)` call:

```js
// fire-and-forget — do not await
supabase.from('swipes').insert({
  user_id: sessionRef.current.user.id,
  idea_id: ideas[currentIndex].id,
  direction,           // 'left' | 'right'
  idea_data: ideas[currentIndex],
})
```

- RLS on the `swipes` table handles authorization
- No optimistic UI, no error recovery — silent failure is acceptable for MVP
- Supabase JS sends the `Authorization` header automatically from the active session

---

## IdeaCard Props (for reference)

| Prop | Value |
|---|---|
| `idea` | `ideas[currentIndex]` |
| `imageUrl` | `null` (images are a future session) |
| `currentNum` | `currentIndex + 1` |
| `total` | `ideas.length` (10) |
| `onSwipe` | `handleSwipe` (active card only) |
| `isActive` | `true` for front card, `false` for peek cards |
| `stackOffset` | `0` for active, `1` for second, `2` for third |

---

## End-of-Deck Screen

Shown when `isDone === true`. Replaces the card stack entirely.

**Layout (centered column, padding 0 32px, gap 28px, text-align center):**

1. **Mark icon** — gold stroke, ~42px, centered
2. **Eyebrow:** "That's a wrap" — DM Mono, uppercase, 9px, letterspacing 0.32em, ruby `#c8243a`
3. **Headline:** Playfair Display 34px, weight 500:
   - "Ten ideas," in ink `#efe5d2`
   - italic gold `#e8a832` — "{savedCount} kept."
4. **Hairline rule** — 80px wide, `rgba(239,229,210,0.14)`, centered
5. **Body copy:** "Your saved ideas are waiting in Matches. Pick one and make a plan, or shuffle a fresh deck." — DM Sans 13px, ink-dim, maxWidth 270px
6. **Saved count card** — `background: #16204a`, `border: 1px solid rgba(239,229,210,0.14)`, `borderRadius: 14`, `padding: 14px 24px`:
   - Large italic serif `#c8243a` — savedCount (44px)
   - Right column: "Saved tonight" (DM Mono 8.5px, ink-dim) + "of 10 ideas seen" (DM Sans 11.5px, ink-soft)
7. **"View matches" CTA** — full ruby pill → `navigate('/matches')`
8. **"Shuffle a fresh deck" ghost CTA** — hairline border pill, ink text → `navigate('/input')`

---

## Files

| File | Action | Responsibility |
|---|---|---|
| `src/pages/DeckPage.jsx` | Replace | Full deck orchestration + end-of-deck screen |
| `src/pages/InputPage.jsx` | Modify | Update navigate call to pass `city` and `time` alongside `ideas` |

`IdeaCard.jsx` and both hooks are untouched.

### InputPage navigate change
```js
// Before
navigate('/deck', { state: { ideas } })

// After
navigate('/deck', { state: { ideas, city: city.trim(), time } })
```

---

## Out of Scope (this session)
- Image resolution (Google Places / Unsplash) — `imageUrl` stays `null`
- MatchesPage implementation — `/matches` remains a stub
- Error handling for failed swipe writes — silent failure acceptable for MVP
