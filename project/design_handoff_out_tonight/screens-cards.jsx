// screens-cards.jsx — Swipe deck screens under the Cream & Cinema palette.
//
// Visual logic: the page is paper cream, the deck card is full-bleed dark
// photography (per the PRD). The flip turns the card to the cream paper
// side — like turning a magazine page over to the layout copy.

const JAZZ = {
  category: 'Nightlife',
  title: ['Jazz Supper at', 'Mezzrow'],
  tagline: "The city's most intimate jazz room — 40 seats only.",
  tags: ['Romantic', 'Formal', 'Cultural'],
  price: '$$$',
  costPer: '~$110 / person',
  duration: '3 hrs',
  scene: 'jazz',
  description: 'A walk-down basement on West 10th where the piano is six feet from your table. Two sets a night, no talking during music. Dinner is short and serious — supper-club style — with the kitchen sending out small warm plates between sets.',
  why: 'A Thursday quartet you only catch this season — Sullivan Fortner is sitting in.',
  logistics: '163 W 10th St, West Village · Reserve via Bandsintown for the 9:30 set · Doors at 9:00',
};

// ── Card front — dark, full-bleed photo with cream typography ──
function SwipeCardFront({ data = JAZZ, overlay = null }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 24px 60px rgba(26,10,8,0.32), 0 4px 14px rgba(26,10,8,0.18)',
    }}>
      <PhotoBG scene={data.scene}>
        <div className="mono uppercase" style={{
          position: 'absolute', top: 16, right: 16,
          fontSize: 7.5, letterSpacing: '0.3em', color: 'rgba(246,236,217,0.55)',
        }}>
          Photo · Mezzrow
        </div>
      </PhotoBG>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 48%, rgba(20,8,4,0.96) 100%)',
      }}/>

      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <CardProgress idx={2} total={10} />
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '0 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div>
          <PhotoCategoryBadge>{data.category}</PhotoCategoryBadge>
        </div>
        <h2 className="serif" style={{
          margin: 0, fontSize: 32, fontWeight: 500, lineHeight: 1.02, letterSpacing: '-0.02em',
          color: 'var(--page)',
        }}>
          {data.title[0]} <span className="italic" style={{ color: 'var(--wine)' }}>{data.title[1]}</span>
        </h2>
        <p className="sans" style={{
          margin: 0, fontSize: 13, lineHeight: 1.45,
          color: 'rgba(246,236,217,0.78)',
        }}>{data.tagline}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
          {data.tags.map(t => (
            <span key={t} className="sans" style={{
              padding: '4px 10px', borderRadius: 999,
              border: '1px solid rgba(246,236,217,0.25)',
              fontSize: 10.5, color: 'rgba(246,236,217,0.78)',
            }}>{t}</span>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(246,236,217,0.14)', margin: '8px 0 4px' }}/>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--wine)', letterSpacing: '0.04em' }}>{data.price}</span>
            <span className="sans" style={{ fontSize: 11, color: 'rgba(246,236,217,0.55)' }}>{data.costPer}</span>
          </div>
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.24em', color: 'rgba(246,236,217,0.6)' }}>
            {data.duration}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <FlipIcon size={10} color="rgba(246,236,217,0.4)" />
          <span className="mono uppercase" style={{ fontSize: 8, letterSpacing: '0.32em', color: 'rgba(246,236,217,0.4)' }}>Tap to flip</span>
        </div>
      </div>

      {overlay}
    </div>
  );
}

// Photo-context badge — same shape as CategoryBadge but tuned for the
// dark card photo (warm-cream stroke + warm-cream text).
function PhotoCategoryBadge({ children }) {
  return (
    <span className="mono uppercase" style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 9px', borderRadius: 999,
      border: '1px solid rgba(239,229,210,0.4)',
      color: 'rgba(239,229,210,0.85)', fontSize: 9, letterSpacing: '0.22em', lineHeight: 1,
    }}>{children}</span>
  );
}

// ── Card back — cream paper page (the "magazine spread" turn) ──
function SwipeCardBack({ data = JAZZ }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      borderRadius: 22,
      overflow: 'hidden',
      background: 'var(--page-warm)',
      border: '1px solid var(--ink-hair)',
      boxShadow: '0 24px 60px rgba(26,10,8,0.28)',
    }}>
      {/* paper grain inside the card */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08, mixBlendMode: 'multiply', pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/><feColorMatrix values=%220 0 0 0 0.1  0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0.6 0%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/></svg>")',
      }}/>
      {/* wine hairline at top */}
      <div style={{
        position: 'absolute', top: 0, left: '18%', right: '18%', height: 1,
        background: 'linear-gradient(90deg, transparent 0%, var(--wine) 50%, transparent 100%)',
        opacity: 0.5,
      }}/>

      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <CardProgress idx={2} total={10} variant="paper" />
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        padding: '52px 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 14,
        overflow: 'hidden',
      }}>
        <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--red)' }}>{data.category}</span>

        <h2 className="serif" style={{
          margin: 0, fontSize: 22, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.015em',
          color: 'var(--ink)',
        }}>
          {data.title[0]} <span className="italic" style={{ color: 'var(--wine)' }}>{data.title[1]}</span>
        </h2>

        <p className="sans" style={{
          margin: 0, fontSize: 12.5, lineHeight: 1.55,
          color: 'var(--ink-soft)',
        }}>{data.description}</p>

        {/* WHY TONIGHT callout */}
        <div style={{
          marginTop: 4,
          background: 'var(--wine-soft)',
          borderLeft: '3px solid var(--red)',
          padding: '10px 14px',
          borderRadius: '0 8px 8px 0',
        }}>
          <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.3em', color: 'var(--red)' }}>Why tonight</span>
          <div className="serif italic" style={{
            color: 'var(--ink)', fontSize: 13.5, lineHeight: 1.4, marginTop: 6,
          }}>{data.why}</div>
        </div>

        <div style={{
          background: 'rgba(26,10,8,0.04)',
          border: '1px solid var(--ink-hair)',
          borderRadius: 8,
          padding: '10px 14px',
        }}>
          <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.3em', color: 'var(--ink-dim)' }}>Getting there</span>
          <div className="sans" style={{
            color: 'var(--ink-soft)', fontSize: 11.5, lineHeight: 1.55, marginTop: 6,
          }}>{data.logistics}</div>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <FlipIcon size={10} color="var(--ink-faint)" />
          <span className="mono uppercase" style={{ fontSize: 8, letterSpacing: '0.32em', color: 'var(--ink-faint)' }}>Tap to flip back</span>
        </div>
      </div>
    </div>
  );
}

// Progress pill. `variant` switches between dark-photo and paper context.
function CardProgress({ idx = 2, total = 10, variant = 'photo' }) {
  const isPaper = variant === 'paper';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 999,
      background: isPaper ? 'rgba(26,10,8,0.06)' : 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${isPaper ? 'var(--ink-hair)' : 'rgba(246,236,217,0.12)'}`,
    }}>
      <span className="mono uppercase" style={{
        fontSize: 8.5, letterSpacing: '0.28em',
        color: isPaper ? 'var(--ink-dim)' : 'rgba(246,236,217,0.65)',
      }}>{idx} / {total}</span>
    </div>
  );
}

function FlipIcon({ size = 12, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2.5 4 A 4 3 0 0 1 9.5 4" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M9.5 4 L 9.5 1.5 M 9.5 4 L 11.5 3" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M9.5 8 A 4 3 0 0 1 2.5 8" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M2.5 8 L 2.5 10.5 M 2.5 8 L 0.5 9" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// Action buttons below the card — paper-context (cream bg).
function CardActions({ state = 'idle' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, marginTop: 22 }}>
      <ActionBtn type="pass" pressed={state === 'pass'} />
      <ActionBtn type="info" />
      <ActionBtn type="like" pressed={state === 'like'} />
    </div>
  );
}
function ActionBtn({ type, pressed = false }) {
  const cfg = {
    pass: {
      size: 58,
      bg: pressed ? 'rgba(200,54,43,0.12)' : 'var(--page-warm)',
      border: pressed ? 'var(--red)' : 'var(--ink-hair)',
      color: pressed ? 'var(--red)' : 'var(--ink-dim)',
      glow: pressed ? '0 0 24px rgba(200,54,43,0.35)' : 'none',
    },
    info: {
      size: 44,
      bg: 'var(--page-warm)',
      border: 'var(--ink-hair)',
      color: 'var(--ink-dim)',
      glow: 'none',
    },
    like: {
      size: 58,
      bg: pressed ? 'var(--red)' : 'var(--page-warm)',
      border: pressed ? 'var(--red)' : 'var(--ink-hair)',
      color: pressed ? 'var(--page)' : 'var(--red)',
      glow: pressed ? '0 8px 22px rgba(200,54,43,0.35)' : 'none',
    },
  }[type];
  return (
    <div style={{
      width: cfg.size, height: cfg.size, borderRadius: 999,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: cfg.color,
      boxShadow: cfg.glow,
    }}>
      {type === 'pass' && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      )}
      {type === 'info' && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
          <path d="M8 7 L8 11.5 M8 4.6 L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
      {type === 'like' && (
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
          <path d="M10 16.5 C 3.5 12.5, 1.5 9, 3 6.5 C 4.5 4.5, 7.5 4, 10 7 C 12.5 4, 15.5 4.5, 17 6.5 C 18.5 9, 16.5 12.5, 10 16.5 Z"
            stroke="currentColor" strokeWidth="1.5" fill={pressed ? 'currentColor' : 'none'} strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

// Swipe overlay — saved is red, pass is wine. Each uses an italic serif
// caption like a magazine stamp.
function SwipeOverlay({ kind }) {
  const cfg = kind === 'like'
    ? { tint: 'rgba(200,54,43,0.35)', glow: 'rgba(200,54,43,0.5)', color: '#ffc6b8' }
    : { tint: 'rgba(107,24,32,0.4)', glow: 'rgba(107,24,32,0.5)', color: '#f6cab8' };
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at center, ${cfg.tint} 0%, transparent 72%)`,
      pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="serif italic" style={{
        color: cfg.color,
        fontSize: 70, fontWeight: 500, letterSpacing: '0.04em',
        textShadow: `0 0 40px ${cfg.glow}`,
        transform: kind === 'like' ? 'rotate(-14deg)' : 'rotate(10deg)',
        border: `2px solid ${cfg.color}`,
        padding: '6px 30px',
        borderRadius: 8,
      }}>
        {kind === 'like' ? 'Saved' : 'Pass'}
      </div>
    </div>
  );
}

// ── Generic deck-screen wrapper ─────────────────────────────────
function CardStage({ kind = 'front', actionState = 'idle' }) {
  const cardW = 312;
  const cardH = 440;

  return (
    <MobileFrame nav={<BottomNav active="discover" />}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mark size={14} />
          <Wordmark size={13} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PinIcon size={11} color="var(--ink-dim)" />
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.24em', color: 'var(--ink-dim)' }}>Brooklyn · Thu Eve</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 6 }}>
        <div style={{ position: 'relative', width: cardW, height: cardH }}>
          {/* peek cards behind */}
          {[2, 1].map(i => (
            <div key={i} style={{
              position: 'absolute',
              left: i * 5, right: i * 5,
              top: i * 8, bottom: -i * 4,
              borderRadius: 22,
              background: 'var(--page-soft)',
              border: '1px solid var(--ink-hair)',
              opacity: 0.7 - i * 0.2,
              transform: `scale(${1 - i * 0.04})`,
              transformOrigin: 'top center',
              boxShadow: '0 8px 20px rgba(26,10,8,0.08)',
            }}/>
          ))}
          {/* front card */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {kind === 'back'
              ? <SwipeCardBack />
              : <SwipeCardFront overlay={
                  kind === 'like' ? <SwipeOverlay kind="like" />
                  : kind === 'pass' ? <SwipeOverlay kind="pass" />
                  : null
                } />
            }
          </div>
        </div>

        <CardActions state={actionState} />
      </div>
    </MobileFrame>
  );
}

function CardFrontScreen()  { return <CardStage kind="front" />; }
function CardBackScreen()   { return <CardStage kind="back"  />; }
function CardLikeScreen()   { return <CardStage kind="like"  actionState="like" />; }
function CardPassScreen()   { return <CardStage kind="pass"  actionState="pass" />; }

// ── End-of-deck "That's a wrap" ────────────────────────────────
function EndOfDeckScreen() {
  return (
    <MobileFrame nav={<BottomNav active="discover" />}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', gap: 28, textAlign: 'center',
      }}>
        <Mark size={42} strokeWidth={1.5} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.32em', color: 'var(--red)' }}>That's a wrap</span>
          <h1 className="serif" style={{
            margin: 0, fontSize: 34, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--ink)',
          }}>
            Ten ideas, <span className="italic" style={{ color: 'var(--wine)' }}>four kept.</span>
          </h1>
          <div className="rule-h" style={{ width: 80, opacity: 0.5 }}/>
          <p className="sans" style={{ margin: 0, fontSize: 13, lineHeight: 1.55, maxWidth: 270, color: 'var(--ink-dim)' }}>
            Your saved ideas are waiting in Matches. Pick one and make a plan, or shuffle a fresh deck.
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 14,
          padding: '14px 24px', borderRadius: 14,
          border: '1px solid var(--ink-hair)',
          background: 'var(--page-warm)',
        }}>
          <span className="serif italic" style={{ fontSize: 44, color: 'var(--red)', lineHeight: 1, fontWeight: 500 }}>4</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.28em', color: 'var(--ink-dim)' }}>Saved tonight</span>
            <span className="sans" style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 3 }}>of 10 ideas seen</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <RedCTA>View matches</RedCTA>
          <GhostCTA>Shuffle a fresh deck</GhostCTA>
        </div>
      </div>
    </MobileFrame>
  );
}

Object.assign(window, {
  SwipeCardFront, SwipeCardBack, PhotoCategoryBadge,
  CardFrontScreen, CardBackScreen, CardLikeScreen, CardPassScreen,
  EndOfDeckScreen,
  CardStage, FlipIcon, ActionBtn, SwipeOverlay, CardProgress,
});
