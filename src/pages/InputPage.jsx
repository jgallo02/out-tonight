import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSwipeHistory } from '../hooks/useSwipeHistory'
import { useIdeaGeneration } from '../hooks/useIdeaGeneration'
import TopBarAvatar from '../components/ui/TopBarAvatar'

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

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11 4 L6 9 L11 14" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const SKY_PATH = 'M -16 0 L -16 -10 L -14 -10 L -14 -16 L -12 -16 L -12 -20 L -11 -23 L -10 -20 L -10 -16 L -8 -16 L -8 -10 L -6 -10 L -6 0 L -4 0 L -4 -14 L -3 -14 L -3 -16 L -1 -19 L 1 -16 L 1 -14 L 2 -14 L 2 0 L 5 0 L 5 -8 L 14 -8 L 14 -11 L 16 -11 L 16 0 L 0 14 Z'

function MarkSmall() {
  return (
    <svg width="14" height="14" viewBox="-22 -26 44 44" style={{ display: 'block' }}>
      <path d={SKY_PATH} fill="none" stroke={C.wine} strokeWidth={1.5} strokeLinejoin="miter" strokeLinecap="square" vectorEffect="non-scaling-stroke"/>
    </svg>
  )
}

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
  const [locating, setLocating] = useState(false)

  async function useCurrentLocation() {
    if (!navigator.geolocation || locating) return
    setLocating(true)
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      )
      const { latitude, longitude } = pos.coords
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      const addr = data.address ?? {}
      const cityName = addr.city || addr.town || addr.village || addr.county || ''
      const region = addr.country_code === 'us'
        ? (addr.state ? `, ${addr.state.replace(/^(\w{2,})$/, s => s.length === 2 ? s : s)}` : '')
        : (addr.country ? `, ${addr.country}` : '')
      if (cityName) setCity(`${cityName}${region}`)
    } catch {
      // permission denied or timeout — silently ignore
    } finally {
      setLocating(false)
    }
  }

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
      navigate('/deck', { state: {
        ideas,
        params: {
          city: city.trim(), date, time,
          group_size: groupSize, vibes, budget,
          liked_tags: history?.liked_tags ?? [],
          passed_tags: history?.passed_tags ?? [],
        },
      } })
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
        <TopBarAvatar />
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Headline */}
        <h1 style={{ margin: 0, fontFamily: '"Playfair Display", Georgia, serif', fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, color: C.ink }}>
          Where are we <span style={{ fontStyle: 'italic', color: C.wine }}>going?</span>
        </h1>

        {/* First-run hint — only shown when user has no swipe history */}
        {history && history.liked_tags.length === 0 && history.passed_tags.length === 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(239,229,210,0.05)',
            border: `1px solid ${C.inkHair}`,
          }}>
            {[
              { n: '01', label: 'Set your vibe' },
              { n: '02', label: 'Get 10 ideas' },
              { n: '03', label: 'Save the best' },
            ].map(({ n, label }, i, arr) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
                  <span style={{
                    fontFamily: '"DM Mono", monospace', fontSize: 8,
                    letterSpacing: '0.26em', color: C.wine,
                  }}>{n}</span>
                  <span style={{
                    fontFamily: '"DM Sans", sans-serif', fontSize: 10,
                    color: C.inkDim, textAlign: 'center', lineHeight: 1.3,
                  }}>{label}</span>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: C.inkHair, fontSize: 10, flexShrink: 0 }}>›</span>
                )}
              </div>
            ))}
          </div>
        )}

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
          <button
            onClick={useCurrentLocation}
            disabled={locating}
            title="Use current location"
            style={{
              background: 'none', border: 'none', padding: '0 2px',
              cursor: locating ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            {locating ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="7" cy="7" r="5.5" stroke={C.red} strokeWidth="1.5" strokeDasharray="20 15" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke={C.inkDim} strokeWidth="1.3"/>
                <line x1="8" y1="1" x2="8" y2="4" stroke={C.inkDim} strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="8" y1="12" x2="8" y2="15" stroke={C.inkDim} strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="1" y1="8" x2="4" y2="8" stroke={C.inkDim} strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="12" y1="8" x2="15" y2="8" stroke={C.inkDim} strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            )}
          </button>
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
