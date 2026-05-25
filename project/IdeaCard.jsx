/**
 * IdeaCard.jsx — Out Tonight swipe card component
 *
 * Built from: out-tonight/project/screens-cards.jsx (design prototype)
 * Palette:    Cream & Cinema (screen-shell.jsx + palettes.jsx)
 *
 * Production location: src/components/cards/IdeaCard.jsx
 *
 * Props:
 *   idea         {object}       Full idea object from the Claude API response
 *   imageUrl     {string|null}  Resolved URL from images.js, or null → category gradient fallback
 *   currentNum   {number}       Card position shown in progress pill (e.g. 3)
 *   total        {number}       Total cards in deck (e.g. 10)
 *   onSwipe      {function}     Called with 'left' | 'right' when card is committed
 *   isActive     {boolean}      True for the front (interactive) card
 *   stackOffset  {number}       0=front, 1=second behind, 2=third behind (peek cards)
 *
 * Dependencies: framer-motion, react
 * Fonts needed: Playfair Display (ital), DM Sans, DM Mono (via Google Fonts in index.html)
 */

import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

// ─── Color tokens (Cream & Cinema palette) ──────────────────────────────────
// These match the values in CLAUDE.md and tailwind.config.js exactly.
const C = {
  page:      '#f6ecd9',
  pageWarm:  '#f2e4d0',
  pageSoft:  '#edddd0',
  ink:       '#1a0a08',
  inkSoft:   '#4a2a22',
  inkDim:    'rgba(26,10,8,0.55)',
  inkFaint:  'rgba(26,10,8,0.32)',
  inkHair:   'rgba(26,10,8,0.12)',
  inkMist:   'rgba(26,10,8,0.06)',
  red:       '#c8362b',
  wine:      '#6b1820',
  wineSoft:  'rgba(107,24,32,0.08)',
}

// ─── Category gradient fallbacks (used when imageUrl is null) ────────────────
// These are dark atmospheric gradients — cards always read dark against the cream page.
const CATEGORY_GRADIENTS = {
  'Food':          'linear-gradient(155deg, #2a1408 0%, #120806 55%, #060403 100%)',
  'Nightlife':     'linear-gradient(155deg, #28142a 0%, #120814 55%, #060308 100%)',
  'Culture':       'linear-gradient(165deg, #0e1018 0%, #14161c 50%, #08080a 100%)',
  'Adventure':     'linear-gradient(155deg, #0e1c0e 0%, #081408 55%, #030803 100%)',
  'Outdoors':      'linear-gradient(155deg, #0e1c18 0%, #081410 55%, #030806 100%)',
  'Wellness':      'linear-gradient(165deg, #12181a 0%, #0c1214 50%, #040608 100%)',
  'Entertainment': 'linear-gradient(155deg, #1a1408 0%, #120e06 55%, #060503 100%)',
  'Hidden Gem':    'linear-gradient(155deg, #1a1404 0%, #120e02 55%, #060501 100%)',
}

// ─── Shared SVG icons ────────────────────────────────────────────────────────

function FlipIcon({ size = 10, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2.5 4 A 4 3 0 0 1 9.5 4" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M9.5 4 L 9.5 1.5 M 9.5 4 L 11.5 3" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M9.5 8 A 4 3 0 0 1 2.5 8" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M2.5 8 L 2.5 10.5 M 2.5 8 L 0.5 9" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Progress pill ────────────────────────────────────────────────────────────

function ProgressPill({ currentNum, total, variant = 'photo' }) {
  const isPaper = variant === 'paper'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 999,
      background: isPaper ? C.inkMist : 'rgba(0,0,0,0.45)',
      backdropFilter: isPaper ? 'none' : 'blur(8px)',
      WebkitBackdropFilter: isPaper ? 'none' : 'blur(8px)',
      border: `1px solid ${isPaper ? C.inkHair : 'rgba(246,236,217,0.12)'}`,
    }}>
      <span style={{
        fontFamily: 'DM Mono, monospace',
        textTransform: 'uppercase',
        fontSize: 8.5,
        letterSpacing: '0.28em',
        color: isPaper ? C.inkDim : 'rgba(246,236,217,0.65)',
      }}>{currentNum} / {total}</span>
    </div>
  )
}

// ─── Card front (dark, full-bleed photo) ─────────────────────────────────────

function CardFront({ idea, imageUrl, overlay, currentNum, total }) {
  const bgStyle = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: CATEGORY_GRADIENTS[idea.category] || CATEGORY_GRADIENTS['Food'] }

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      borderRadius: 22, overflow: 'hidden',
      boxShadow: '0 22px 50px rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.22)',
    }}>
      {/* Background image or category gradient */}
      <div style={{ position: 'absolute', inset: 0, ...bgStyle }}/>

      {/* Text-legibility gradient overlay (from dark top + heavy dark bottom) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 48%, rgba(20,8,4,0.96) 100%)',
      }}/>

      {/* Progress pill — top left */}
      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <ProgressPill currentNum={currentNum} total={total} variant="photo" />
      </div>

      {/* Bottom content section */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '0 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* Category badge */}
        <div>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center',
            padding: '4px 9px', borderRadius: 999,
            border: '1px solid rgba(239,229,210,0.4)',
            color: 'rgba(239,229,210,0.85)',
            fontSize: 9, letterSpacing: '0.22em', lineHeight: 1,
          }}>{idea.category}</span>
        </div>

        {/* Title — serif, cream */}
        <h2 style={{
          margin: 0, fontSize: 32, fontWeight: 500, lineHeight: 1.02, letterSpacing: '-0.02em',
          fontFamily: 'Playfair Display, Georgia, serif',
          color: '#f6ece4',
        }}>{idea.title}</h2>

        {/* Tagline */}
        <p style={{
          margin: 0, fontSize: 13, lineHeight: 1.45,
          fontFamily: 'DM Sans, sans-serif',
          color: 'rgba(246,236,217,0.78)',
        }}>{idea.tagline}</p>

        {/* Vibe tags */}
        {idea.vibe_tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            {idea.vibe_tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'DM Sans, sans-serif',
                padding: '4px 10px', borderRadius: 999,
                border: '1px solid rgba(246,236,217,0.25)',
                fontSize: 10.5, color: 'rgba(246,236,217,0.78)',
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Hairline divider */}
        <div style={{ height: 1, background: 'rgba(246,236,217,0.14)', margin: '8px 0 4px' }}/>

        {/* Price + duration row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 12, color: C.red, letterSpacing: '0.04em',
            }}>{idea.price_range}</span>
            {idea.estimated_cost_per_person && (
              <span style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 11, color: 'rgba(246,236,217,0.55)',
              }}>~${idea.estimated_cost_per_person}/person</span>
            )}
          </div>
          {idea.duration_estimate && (
            <span style={{
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              fontSize: 9, letterSpacing: '0.24em', color: 'rgba(246,236,217,0.6)',
            }}>{idea.duration_estimate}</span>
          )}
        </div>

        {/* Tap-to-flip hint */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4,
        }}>
          <FlipIcon size={10} color="rgba(246,236,217,0.4)" />
          <span style={{
            fontFamily: 'DM Mono, monospace', textTransform: 'uppercase',
            fontSize: 8, letterSpacing: '0.32em', color: 'rgba(246,236,217,0.4)',
          }}>Tap to flip</span>
        </div>
      </div>

      {/* Swipe overlay injected here (like/pass) */}
      {overlay}
    </div>
  )
}

// ─── Card back (cream paper — the "magazine spread" flip) ────────────────────

function CardBack({ idea, currentNum, total }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      borderRadius: 22, overflow: 'hidden',
      background: C.pageWarm,
      boxShadow: '0 22px 50px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.12)',
    }}>
      {/* Paper grain texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        mixBlendMode: 'multiply', pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/><feColorMatrix values=%220 0 0 0 0.1  0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0.6 0%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/></svg>")',
      }}/>

      {/* Wine hairline rule at top */}
      <div style={{
        position: 'absolute', top: 0, left: '18%', right: '18%', height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${C.wine} 50%, transparent 100%)`,
        opacity: 0.5,
      }}/>

      {/* Progress pill — top left */}
      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <ProgressPill currentNum={currentNum} total={total} variant="paper" />
      </div>

      {/* Main content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '52px 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 14,
        overflow: 'hidden',
      }}>
        {/* Category label */}
        <span style={{
          fontFamily: 'DM Mono, monospace', textTransform: 'uppercase',
          fontSize: 9, letterSpacing: '0.3em', color: C.red,
        }}>{idea.category}</span>

        {/* Title */}
        <h2 style={{
          margin: 0, fontSize: 22, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.015em',
          fontFamily: 'Playfair Display, Georgia, serif',
          color: C.ink,
        }}>{idea.title}</h2>

        {/* Description */}
        <p style={{
          margin: 0, fontSize: 12.5, lineHeight: 1.55,
          fontFamily: 'DM Sans, sans-serif',
          color: C.inkSoft,
        }}>{idea.description}</p>

        {/* "Why tonight" callout block */}
        <div style={{
          marginTop: 4,
          background: C.wineSoft,
          borderLeft: `3px solid ${C.red}`,
          padding: '10px 14px',
          borderRadius: '0 8px 8px 0',
        }}>
          <span style={{
            display: 'block',
            fontFamily: 'DM Mono, monospace', textTransform: 'uppercase',
            fontSize: 8.5, letterSpacing: '0.3em', color: C.red,
          }}>Why tonight</span>
          <div style={{
            fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic',
            color: C.ink, fontSize: 13.5, lineHeight: 1.4, marginTop: 6,
          }}>{idea.why_tonight}</div>
        </div>

        {/* Logistics / getting there block */}
        <div style={{
          background: C.inkMist,
          border: `1px solid ${C.inkHair}`,
          borderRadius: 8,
          padding: '10px 14px',
        }}>
          <span style={{
            display: 'block',
            fontFamily: 'DM Mono, monospace', textTransform: 'uppercase',
            fontSize: 8.5, letterSpacing: '0.3em', color: C.inkDim,
          }}>Getting there</span>
          <div style={{
            fontFamily: 'DM Sans, sans-serif',
            color: C.inkSoft, fontSize: 11.5, lineHeight: 1.55, marginTop: 6,
          }}>{idea.logistics}</div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Tap-to-flip-back hint */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
        }}>
          <FlipIcon size={10} color={C.inkFaint} />
          <span style={{
            fontFamily: 'DM Mono, monospace', textTransform: 'uppercase',
            fontSize: 8, letterSpacing: '0.32em', color: C.inkFaint,
          }}>Tap to flip back</span>
        </div>
      </div>
    </div>
  )
}

// ─── Swipe overlay (shown during drag) ───────────────────────────────────────
// Appears proportionally as the user drags. Red tint + italic stamp label.

function SwipeOverlay({ direction, opacity }) {
  const isLike = direction === 'right'
  const cfg = isLike
    ? { tint: 'rgba(200,54,43,0.35)', glow: 'rgba(200,54,43,0.5)', color: '#ffc6b8', label: 'Saved' }
    : { tint: 'rgba(107,24,32,0.4)',  glow: 'rgba(107,24,32,0.5)',  color: '#f6cab8', label: 'Pass'  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at center, ${cfg.tint} 0%, transparent 72%)`,
      opacity,
      pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: 'Playfair Display, Georgia, serif',
        fontStyle: 'italic',
        color: cfg.color,
        fontSize: 70, fontWeight: 500, letterSpacing: '0.04em',
        textShadow: `0 0 40px ${cfg.glow}`,
        transform: isLike ? 'rotate(-14deg)' : 'rotate(10deg)',
        border: `2px solid ${cfg.color}`,
        padding: '6px 30px',
        borderRadius: 8,
      }}>{cfg.label}</div>
    </div>
  )
}

// ─── Action buttons (below the card stack) ────────────────────────────────────
// Pass (✕) and Like (♥) buttons. Exported separately for use in DeckPage.jsx.

export function CardActionButtons({ onPass, onLike }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28,
      marginTop: 22,
    }}>
      {/* Pass button */}
      <button
        onClick={onPass}
        style={{
          width: 58, height: 58, borderRadius: 999,
          background: C.pageWarm,
          border: `1px solid ${C.inkHair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.inkDim, cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(26,10,8,0.08)',
          WebkitAppearance: 'none',
        }}
        aria-label="Pass"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Like button */}
      <button
        onClick={onLike}
        style={{
          width: 58, height: 58, borderRadius: 999,
          background: C.pageWarm,
          border: `1px solid ${C.red}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.red, cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(200,54,43,0.12)',
          WebkitAppearance: 'none',
        }}
        aria-label="Save to matches"
      >
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
          <path
            d="M10 16.5 C 3.5 12.5, 1.5 9, 3 6.5 C 4.5 4.5, 7.5 4, 10 7 C 12.5 4, 15.5 4.5, 17 6.5 C 18.5 9, 16.5 12.5, 10 16.5 Z"
            stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

// ─── Main IdeaCard component ──────────────────────────────────────────────────

export default function IdeaCard({
  idea,
  imageUrl = null,
  currentNum = 1,
  total = 10,
  onSwipe,
  isActive = true,
  stackOffset = 0,
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(null)   // null | 'left' | 'right'
  const [overlayOpacity, setOverlayOpacity] = useState(0)
  const controls = useAnimation()

  // ── Peek cards (non-active) ──────────────────────────────────────────────
  // Shown behind the front card to create a visual stack.
  if (!isActive) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 22,
        background: C.pageSoft,
        border: `1px solid ${C.inkHair}`,
        opacity: 0.7 - stackOffset * 0.2,
        transform: `scale(${1 - stackOffset * 0.04}) translateY(${stackOffset * 8}px)`,
        transformOrigin: 'top center',
        boxShadow: '0 8px 20px rgba(26,10,8,0.08)',
        pointerEvents: 'none',
      }}/>
    )
  }

  // ── Swipe physics ────────────────────────────────────────────────────────
  const SWIPE_THRESHOLD = 100   // px of offset to commit swipe
  const VELOCITY_THRESHOLD = 500 // px/s to commit swipe regardless of offset

  const handleDrag = (_, info) => {
    const { x } = info.offset
    if (Math.abs(x) < 5) return
    const dir = x > 0 ? 'right' : 'left'
    const progress = Math.min(Math.abs(x) / SWIPE_THRESHOLD, 1)
    setSwipeDirection(progress > 0.15 ? dir : null)
    setOverlayOpacity(progress * 0.9)
  }

  const handleDragEnd = async (_, info) => {
    const { x: offsetX } = info.offset
    const { x: velocityX } = info.velocity
    const committed = Math.abs(offsetX) > SWIPE_THRESHOLD || Math.abs(velocityX) > VELOCITY_THRESHOLD

    if (committed) {
      const dir = offsetX > 0 || velocityX > 0 ? 'right' : 'left'
      // Fly off screen
      await controls.start({
        x: dir === 'right' ? 600 : -600,
        rotate: dir === 'right' ? 20 : -20,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      })
      onSwipe?.(dir)
    } else {
      // Spring back to center
      setSwipeDirection(null)
      setOverlayOpacity(0)
      controls.start({
        x: 0, rotate: 0,
        transition: { type: 'spring', stiffness: 400, damping: 30 },
      })
    }
  }

  // ── Tap to flip ─────────────────────────────────────────────────────────
  // Only triggers if the user wasn't dragging meaningfully.
  const handleClick = (e) => {
    // Suppress flip if this click followed a drag
    if (Math.abs(e.movementX) > 3 || Math.abs(e.movementY) > 3) return
    setIsFlipped(f => !f)
  }

  const overlay = swipeDirection
    ? <SwipeOverlay direction={swipeDirection} opacity={overlayOpacity} />
    : null

  return (
    <motion.div
      drag={isFlipped ? false : 'x'}     // disable drag when reading card back
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      onClick={handleClick}
      style={{
        position: 'absolute', inset: 0,
        cursor: isFlipped ? 'pointer' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/*
        CSS flip container. The inner transform is separate from the Framer Motion
        translate (swipe) on the outer element so they compose independently.
        CLAUDE.md constraint: use CSS transition for flip, NOT Framer Motion.
      */}
      <div style={{
        width: '100%', height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 400ms ease',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        perspective: 1000,
      }}>
        {/* Front face */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}>
          <CardFront
            idea={idea}
            imageUrl={imageUrl}
            overlay={overlay}
            currentNum={currentNum}
            total={total}
          />
        </div>

        {/* Back face — rotated 180° so it appears when the parent flips */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}>
          <CardBack idea={idea} currentNum={currentNum} total={total} />
        </div>
      </div>
    </motion.div>
  )
}
