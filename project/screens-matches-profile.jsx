// screens-matches-profile.jsx — Matches list, empty state, match detail,
// and Profile, under the Cream & Cinema palette.

const MATCH_LIST = [
  {
    category: 'Nightlife',
    title: ['Jazz Supper at', 'Mezzrow'],
    tagline: "The city's most intimate jazz room — 40 seats only.",
    price: '$$$', costPer: '~$110 / person',
    saved: 'Saved tonight',
    scene: 'jazz',
  },
  {
    category: 'Hidden Gem',
    title: ['Sake & a wheel-', 'throwing class'],
    tagline: 'A boutique studio in Williamsburg pairs sake tastings with clay.',
    price: '$$', costPer: '~$65 / person',
    saved: 'Saved tonight',
    scene: 'sushi',
  },
  {
    category: 'Wellness',
    title: ['Bathhouse hours', 'after dark'],
    tagline: 'Mid-week, low crowd, the long sauna circuit no one tells you about.',
    price: '$$', costPer: '~$55 / person',
    saved: 'Saved Wed',
    scene: 'sauna',
  },
  {
    category: 'Outdoors',
    title: ['Rooftop film at', 'the Brooklyn Bell'],
    tagline: 'A 35mm reel under the Manhattan Bridge with espresso on tap.',
    price: '$', costPer: '~$22 / person',
    saved: 'Saved Wed',
    scene: 'rooftop',
  },
];

// ── D1 — Matches list ───────────────────────────────────────────
function MatchesListScreen() {
  return (
    <MobileFrame nav={<BottomNav active="matches" />}>
      <div style={{ padding: '8px 22px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h1 className="serif" style={{
            margin: 0, fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)',
          }}>
            <span className="italic" style={{ color: 'var(--wine)' }}>Matches</span>
          </h1>
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--red)' }}>4 saved</span>
        </div>
        <div className="rule-h" style={{ width: '100%', marginTop: 12 }}/>
      </div>

      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '0 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {MATCH_LIST.map((m, i) => <MatchRow key={i} m={m} />)}
      </div>
    </MobileFrame>
  );
}

function MatchRow({ m }) {
  return (
    <div style={{
      background: 'var(--page-warm)',
      border: '1px solid var(--ink-hair)',
      borderRadius: 14,
      padding: 12,
      display: 'flex', gap: 14, alignItems: 'stretch',
      boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset',
    }}>
      <div style={{
        width: 76, height: 76, borderRadius: 9,
        overflow: 'hidden', position: 'relative', flexShrink: 0,
        boxShadow: '0 2px 6px rgba(26,10,8,0.18)',
      }}>
        <PhotoBG scene={m.scene} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
        <span className="mono uppercase" style={{ fontSize: 8, letterSpacing: '0.26em', color: 'var(--red)' }}>{m.category}</span>
        <div className="serif" style={{
          fontSize: 14.5, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.01em',
          color: 'var(--ink)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {m.title[0]} <span className="italic" style={{ color: 'var(--wine)' }}>{m.title[1]}</span>
        </div>
        <div className="sans" style={{
          fontSize: 11, lineHeight: 1.35, color: 'var(--ink-dim)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{m.tagline}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 3 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--wine)', letterSpacing: '0.04em' }}>
            {m.price} <span style={{ opacity: 0.6 }}>· {m.costPer}</span>
          </span>
          <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.22em', color: 'var(--ink-faint)' }}>{m.saved}</span>
        </div>
      </div>
    </div>
  );
}

// ── D2 — Empty state ────────────────────────────────────────────
function MatchesEmptyScreen() {
  return (
    <MobileFrame nav={<BottomNav active="matches" />}>
      <div style={{ padding: '8px 22px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h1 className="serif" style={{
            margin: 0, fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)',
          }}>
            <span className="italic" style={{ color: 'var(--wine)' }}>Matches</span>
          </h1>
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--ink-faint)' }}>0 saved</span>
        </div>
        <div className="rule-h" style={{ width: '100%', marginTop: 12 }}/>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 36px', gap: 24, textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="rule-h" style={{ width: 36, opacity: 0.5 }}/>
          <svg width="56" height="50" viewBox="0 0 56 50" fill="none">
            <path d="M28 46 C 8 34, 4 23, 8 15 C 12 9, 22 8, 28 16 C 34 8, 44 9, 48 15 C 52 23, 48 34, 28 46 Z"
              stroke="var(--wine)" strokeWidth="1.4" fill="none" opacity="0.7"/>
          </svg>
          <span className="rule-h" style={{ width: 36, opacity: 0.5 }}/>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <h2 className="serif italic" style={{
            margin: 0, fontSize: 24, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.01em',
            color: 'var(--wine)',
          }}>
            Nothing saved yet.
          </h2>
          <p className="sans" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, maxWidth: 240, color: 'var(--ink-dim)' }}>
            Start a deck and swipe right on anything worth keeping.
          </p>
        </div>

        <div style={{ marginTop: 4 }}>
          <GhostCTA full={false}>Start a deck →</GhostCTA>
        </div>
      </div>
    </MobileFrame>
  );
}

// ── D3 — Match detail (expanded) ───────────────────────────────
function MatchDetailScreen() {
  const m = MATCH_LIST[0];
  return (
    <MobileFrame nav={<BottomNav active="matches" />}>
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', padding: '0 16px',
        zIndex: 4,
      }}>
        <RoundIcon><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></RoundIcon>
        <RoundIcon>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1 L7 9 M4 4 L7 1 L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.5 8 L2.5 12 L11.5 12 L11.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </RoundIcon>
      </div>

      {/* dark photo crown — bleeds into the cream sheet below */}
      <div style={{ position: 'relative', height: 240, marginTop: -44 }}>
        <PhotoBG scene={m.scene} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 60%, var(--page) 100%)',
        }}/>
      </div>

      <div style={{
        flex: 1, position: 'relative', marginTop: -28,
        background: 'var(--page)',
        padding: '0 22px',
        display: 'flex', flexDirection: 'column', gap: 14,
        overflow: 'hidden',
      }}>
        <CategoryBadge tone="red">{m.category}</CategoryBadge>

        <h1 className="serif" style={{
          margin: 0, fontSize: 30, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.02em',
          color: 'var(--ink)',
        }}>
          {m.title[0]} <span className="italic" style={{ color: 'var(--wine)' }}>{m.title[1]}</span>
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: -4 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--wine)', letterSpacing: '0.04em' }}>{m.price}</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-faint)' }}/>
          <span className="sans" style={{ fontSize: 11, color: 'var(--ink-dim)' }}>{m.costPer}</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-faint)' }}/>
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--ink-dim)' }}>3 hrs</span>
        </div>

        <p className="sans" style={{
          margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink-soft)',
        }}>
          A walk-down basement on West 10th where the piano is six feet from your table. Two sets a night, no talking during music.
        </p>

        <div style={{
          background: 'var(--wine-soft)',
          borderLeft: '3px solid var(--red)',
          padding: '10px 14px',
          borderRadius: '0 8px 8px 0',
        }}>
          <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.3em', color: 'var(--red)' }}>Why tonight</span>
          <div className="serif italic" style={{ color: 'var(--ink)', fontSize: 13, lineHeight: 1.4, marginTop: 6 }}>
            Sullivan Fortner is sitting in with the Thursday quartet.
          </div>
        </div>

        <div style={{
          background: 'rgba(26,10,8,0.04)',
          border: '1px solid var(--ink-hair)',
          borderRadius: 8,
          padding: '10px 14px',
        }}>
          <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.3em', color: 'var(--ink-dim)' }}>Getting there</span>
          <div className="sans" style={{ color: 'var(--ink-soft)', fontSize: 11.5, lineHeight: 1.55, marginTop: 6 }}>
            163 W 10th St, West Village · Reserve via Bandsintown for the 9:30 set · Doors at 9:00
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
          <div style={{
            flex: 1, padding: '12px', borderRadius: 12,
            border: '1px solid var(--ink-hair)',
            color: 'var(--ink-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'var(--page-warm)',
          }}>
            Remove
          </div>
          <div style={{
            flex: 1.4, padding: '12px', borderRadius: 12,
            background: 'var(--red)', color: 'var(--page)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
            boxShadow: '0 6px 18px rgba(200,54,43,0.22)',
          }}>
            Reserve
            <span style={{ fontSize: 12 }}>↗</span>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

function RoundIcon({ children }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 999,
      background: 'var(--page-warm)',
      border: '1px solid var(--ink-hair)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink)',
    }}>{children}</div>
  );
}

// ── E1 — Profile ────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <MobileFrame nav={<BottomNav active="profile" />}>
      <div style={{ padding: '8px 22px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h1 className="serif" style={{
            margin: 0, fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)',
          }}>
            <span className="italic" style={{ color: 'var(--wine)' }}>Profile</span>
          </h1>
          <Mark size={16} />
        </div>
        <div className="rule-h" style={{ width: '100%', marginTop: 12 }}/>
      </div>

      <div style={{
        flex: 1, padding: '20px 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        {/* avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 62, height: 62, borderRadius: 999,
            background: 'linear-gradient(135deg, var(--red) 0%, var(--wine) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--ink-hair)',
            boxShadow: '0 4px 12px rgba(107,24,32,0.22)',
          }}>
            <span className="serif italic" style={{ fontSize: 26, fontWeight: 500, color: 'var(--page)' }}>J</span>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1, color: 'var(--ink)' }}>
              Jordan <span className="italic" style={{ color: 'var(--wine)' }}>Vega</span>
            </div>
            <div className="sans" style={{ fontSize: 12, marginTop: 4, color: 'var(--ink-dim)' }}>jordan.vega@gmail.com</div>
          </div>
        </div>

        {/* stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 1, background: 'var(--ink-hair)',
          border: '1px solid var(--ink-hair)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <Stat n="284" label="Swipes" />
          <Stat n="47"  label="Matches" />
          <Stat n="6"   label="Cities" />
        </div>

        <MonoDivider label="Tonight's history" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <HistoryRow city="Brooklyn, NY" date="Thu · May 24" swipes={10} kept={4} active />
          <HistoryRow city="Brooklyn, NY" date="Wed · May 23" swipes={10} kept={2} />
          <HistoryRow city="Lisbon, PT"   date="Sat · May 18" swipes={10} kept={5} />
          <HistoryRow city="Lisbon, PT"   date="Fri · May 17" swipes={8}  kept={3} />
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{
          padding: '14px', borderRadius: 12,
          border: '1px solid var(--ink-hair)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--page-warm)',
        }}>
          <span className="sans" style={{ fontSize: 13, color: 'var(--ink)' }}>Sign out</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3 L5 2 L11 2 L11 12 L5 12 L5 11" stroke="var(--ink-dim)" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 7 L9 7 M7 5 L9 7 L7 9" stroke="var(--ink-dim)" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </MobileFrame>
  );
}

function Stat({ n, label }) {
  return (
    <div style={{
      background: 'var(--page-warm)', padding: '16px 12px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <span className="serif italic" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1, color: 'var(--wine)' }}>{n}</span>
      <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.26em', color: 'var(--ink-dim)' }}>{label}</span>
    </div>
  );
}

function HistoryRow({ city, date, swipes, kept, active = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid var(--ink-hair)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: active ? 'var(--red)' : 'var(--ink-faint)',
          boxShadow: active ? '0 0 8px rgba(200,54,43,0.6)' : 'none',
        }}/>
        <div>
          <div className="sans" style={{ fontSize: 13, color: 'var(--ink)' }}>{city}</div>
          <div className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.24em', color: 'var(--ink-dim)', marginTop: 2 }}>{date}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="serif italic" style={{ color: 'var(--red)', fontSize: 18, fontWeight: 500 }}>{kept}</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.04em' }}>/ {swipes}</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  MatchesListScreen, MatchesEmptyScreen, MatchDetailScreen, ProfileScreen,
  MatchRow, Stat, HistoryRow, RoundIcon,
});
