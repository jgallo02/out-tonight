import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMatches, useRemoveMatch } from '../hooks/useMatches'
import PageShell from '../components/layout/PageShell'
import { resolveImage } from '../lib/images'

// ── Palette (Sapphire & Ruby) ─────────────────────────────────────────────
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

const CATEGORY_GRADIENTS = {
  'Food':          'linear-gradient(135deg, #2a1408 0%, #1a0c06 100%)',
  'Nightlife':     'linear-gradient(135deg, #28142a 0%, #160a18 100%)',
  'Culture':       'linear-gradient(135deg, #0e1018 0%, #080a10 100%)',
  'Adventure':     'linear-gradient(135deg, #0e1c0e 0%, #081008 100%)',
  'Outdoors':      'linear-gradient(135deg, #0e1c18 0%, #081210 100%)',
  'Wellness':      'linear-gradient(135deg, #12181a 0%, #0c1214 100%)',
  'Entertainment': 'linear-gradient(135deg, #1a1408 0%, #120e06 100%)',
  'Hidden Gem':    'linear-gradient(135deg, #1a1404 0%, #120e02 100%)',
}

const SKY_PATH = 'M -16 0 L -16 -10 L -14 -10 L -14 -16 L -12 -16 L -12 -20 L -11 -23 L -10 -20 L -10 -16 L -8 -16 L -8 -10 L -6 -10 L -6 0 L -4 0 L -4 -14 L -3 -14 L -3 -16 L -1 -19 L 1 -16 L 1 -14 L 2 -14 L 2 0 L 5 0 L 5 -8 L 14 -8 L 14 -11 L 16 -11 L 16 0 L 0 14 Z'

function MarkSmall() {
  return (
    <svg width="14" height="14" viewBox="-22 -26 44 44" style={{ display: 'block' }}>
      <path d={SKY_PATH} fill="none" stroke={C.wine} strokeWidth={1.5} strokeLinejoin="miter" strokeLinecap="square" vectorEffect="non-scaling-stroke"/>
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="16" viewBox="0 0 20 18" fill="none">
      <path
        d="M10 16.5 C 3.5 12.5, 1.5 9, 3 6.5 C 4.5 4.5, 7.5 4, 10 7 C 12.5 4, 15.5 4.5, 17 6.5 C 18.5 9, 16.5 12.5, 10 16.5 Z"
        stroke={C.red}
        strokeWidth="1.5"
        fill={filled ? C.red : 'none'}
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDown({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <path d="M3 5 L7 9 L11 5" stroke={C.inkDim} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MatchRow({ idea, index, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const gradient = CATEGORY_GRADIENTS[idea.category] || CATEGORY_GRADIENTS['Culture']

  useEffect(() => {
    resolveImage(idea.venue_name ?? null, '', idea.image_search_query ?? '')
      .then(url => { if (url) setImageUrl(url) })
  }, [idea.venue_name, idea.image_search_query])

  const headerBg = imageUrl
    ? `linear-gradient(to bottom, rgba(8,12,32,0.25) 0%, rgba(8,12,32,0.72) 100%), url(${imageUrl})`
    : gradient

  async function handleRemove(e) {
    e.stopPropagation()
    setRemoving(true)
    await onRemove(idea.id)
    // Component unmounts when removed from list — no need to reset
  }

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${C.red}`,
      overflow: 'hidden',
      background: C.surface,
      opacity: removing ? 0.5 : 1,
      transition: 'opacity 200ms ease',
    }}>
      {/* Header strip */}
      <div
        style={{
          background: headerBg,
          backgroundSize: imageUrl ? 'cover' : undefined,
          backgroundPosition: imageUrl ? 'center' : undefined,
          padding: '18px 18px 16px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          transition: 'background 0.4s ease',
        }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Top row: index + category + unsave button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: '"DM Mono", monospace', fontSize: 8.5,
              letterSpacing: '0.28em', color: 'rgba(239,229,210,0.5)',
              textTransform: 'uppercase',
            }}>{String(index + 1).padStart(2, '0')}</span>
            <span style={{
              fontFamily: '"DM Mono", monospace', fontSize: 8.5,
              letterSpacing: '0.22em', color: 'rgba(239,229,210,0.7)',
              textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: 999,
              border: '1px solid rgba(239,229,210,0.25)',
            }}>{idea.category}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleRemove}
              disabled={removing}
              style={{
                background: 'rgba(200,36,58,0.18)',
                border: `1px solid ${C.red}`,
                borderRadius: 999, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: removing ? 'not-allowed' : 'pointer',
              }}
            >
              <HeartIcon filled={true} />
            </button>
            <ChevronDown open={expanded} />
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          margin: 0, fontSize: 22, fontWeight: 500, lineHeight: 1.1,
          letterSpacing: '-0.02em',
          fontFamily: '"Playfair Display", Georgia, serif',
          color: '#f6ece4',
        }}>{idea.title}</h2>

        {/* Tagline */}
        <p style={{
          margin: 0, fontSize: 12.5, lineHeight: 1.45,
          fontFamily: '"DM Sans", sans-serif',
          color: 'rgba(246,236,217,0.72)',
        }}>{idea.tagline}</p>

        {/* Bottom row: price + duration + vibe tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {idea.vibe_tags?.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 10, color: 'rgba(246,236,217,0.65)',
                padding: '2px 8px', borderRadius: 999,
                border: '1px solid rgba(246,236,217,0.18)',
              }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, marginLeft: 8 }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: C.red }}>{idea.price_range}</span>
            {idea.duration_estimate && (
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, color: 'rgba(246,236,217,0.45)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{idea.duration_estimate}</span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{
            margin: 0, fontSize: 12.5, lineHeight: 1.6,
            fontFamily: '"DM Sans", sans-serif', color: C.inkDim,
          }}>{idea.description}</p>

          {idea.why_tonight && (
            <div style={{
              background: 'rgba(200,36,58,0.08)',
              borderLeft: `2px solid ${C.red}`,
              padding: '10px 12px', borderRadius: '0 8px 8px 0',
            }}>
              <span style={{
                display: 'block', fontFamily: '"DM Mono", monospace',
                fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
                color: C.red, marginBottom: 5,
              }}>Why tonight</span>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic', fontSize: 12.5, lineHeight: 1.45, color: C.ink,
              }}>{idea.why_tonight}</span>
            </div>
          )}

          {idea.logistics && (
            <div style={{
              background: 'rgba(239,229,210,0.04)',
              border: `1px solid ${C.inkHair}`,
              borderRadius: 8, padding: '10px 12px',
            }}>
              <span style={{
                display: 'block', fontFamily: '"DM Mono", monospace',
                fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
                color: C.inkDim, marginBottom: 5,
              }}>Getting there</span>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 11.5, lineHeight: 1.55, color: C.inkDim,
              }}>{idea.logistics}</span>
            </div>
          )}

          {idea.estimated_cost_per_person && (
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: C.inkFaint }}>
              ~${idea.estimated_cost_per_person}/person
            </span>
          )}

          {/* Learn more link */}
          {(idea.website_url || idea.venue_name) && (
            <a
              href={idea.website_url || `https://www.google.com/search?q=${encodeURIComponent(idea.venue_name)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: '"DM Mono", monospace', fontSize: 9,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: C.red, textDecoration: 'none',
              }}
            >
              Learn more →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ onDiscover }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 32px', gap: 20, textAlign: 'center',
    }}>
      {/* Heart outline */}
      <svg width="52" height="46" viewBox="0 0 20 18" fill="none">
        <path
          d="M10 16.5 C 3.5 12.5, 1.5 9, 3 6.5 C 4.5 4.5, 7.5 4, 10 7 C 12.5 4, 15.5 4.5, 17 6.5 C 18.5 9, 16.5 12.5, 10 16.5 Z"
          stroke="rgba(200,36,58,0.4)"
          strokeWidth="0.8"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <p style={{
          margin: 0, fontSize: 20, fontWeight: 500, lineHeight: 1.2,
          fontFamily: '"Playfair Display", Georgia, serif',
          color: C.ink,
        }}>
          Nothing saved <span style={{ fontStyle: 'italic', color: C.wine }}>yet.</span>
        </p>
        <p style={{
          margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.55,
          fontFamily: '"DM Sans", sans-serif', color: C.inkDim,
        }}>
          Heart ideas on the results screen to save them here.
        </p>
      </div>
      <button
        onClick={onDiscover}
        style={{
          marginTop: 8, padding: '13px 28px', borderRadius: 999, border: 'none',
          background: C.red, color: C.ink,
          fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(200,36,58,0.28)',
        }}
      >
        Discover tonight →
      </button>
    </div>
  )
}

export default function MatchesPage() {
  const navigate = useNavigate()
  const { data: rows = [], isLoading, error } = useMatches()
  const removeMatch = useRemoveMatch()

  // Extract idea_data from each row
  const matches = rows.map(r => r.idea_data).filter(Boolean)

  return (
    <PageShell>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '48px 22px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MarkSmall />
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 13, fontWeight: 500, color: C.ink }}>
              Out <span style={{ fontStyle: 'italic', color: C.wine }}>Tonight</span>
            </span>
          </div>
          {matches.length > 0 && (
            <span style={{
              fontFamily: '"DM Mono", monospace', fontSize: 9,
              letterSpacing: '0.22em', color: C.inkFaint,
              textTransform: 'uppercase',
            }}>
              {matches.length} saved
            </span>
          )}
        </div>

        {/* Headline */}
        <div style={{ padding: '0 22px 16px' }}>
          <h1 style={{
            margin: 0, fontSize: 26, fontWeight: 500, lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontFamily: '"Playfair Display", Georgia, serif', color: C.ink,
          }}>
            Your <span style={{ fontStyle: 'italic', color: C.wine }}>saved</span> ideas
          </h1>
          {matches.length > 0 && (
            <p style={{
              margin: '6px 0 0', fontSize: 12, fontFamily: '"DM Mono", monospace',
              textTransform: 'uppercase', letterSpacing: '0.22em', color: C.inkFaint,
            }}>Tap to expand · Heart to remove</p>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="7" cy="7" r="5.5" stroke={C.inkFaint} strokeWidth="1.5" strokeDasharray="20 15" strokeLinecap="round"/>
            </svg>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ padding: '0 22px', color: C.red, fontFamily: '"DM Sans", sans-serif', fontSize: 12 }}>
            {error.message}
          </div>
        ) : matches.length === 0 ? (
          <EmptyState onDiscover={() => navigate('/input')} />
        ) : (
          <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map((row, i) => (
              <MatchRow
                key={row.id}
                idea={row.idea_data}
                index={i}
                onRemove={removeMatch}
              />
            ))}
            <div style={{ height: 16 }} />
          </div>
        )}

      </div>
    </PageShell>
  )
}
