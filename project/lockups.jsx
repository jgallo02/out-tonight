// lockups.jsx — All lockups now share H2's typographic system:
//   Playfair Display, "Out" roman + "Tonight" italic,
//   optional hairline rule + JetBrains Mono detail caption.
// Variations differ by mark presence, lockup orientation, and density.

// Shared wordmark — "Out Tonight" with mixed roman + italic.
function Wordmark({ size = 84 }) {
  return (
    <div
      className="serif cream word"
      style={{ fontSize: size, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 0.95 }}
    >
      Out <span className="italic">Tonight</span>
    </div>
  );
}

// Shared detail caption — hairline rule + mono uppercase tag with a dot
// separator. Used beneath the wordmark in "full" lockups. `width` controls
// the rule length so it scales with the wordmark above it.
function Detail({ width = 320, gap = 18, marginTop = 18, align = 'center' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', width: '100%' }}>
      <div className="rule" style={{ height: 1, width, marginTop, opacity: 0.5 }} />
      <div
        className="mono dim uppercase"
        style={{ fontSize: 9.5, letterSpacing: '0.28em', marginTop: gap - 6, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <span>Est. MMXXVI</span>
        <Dot color="rgba(240,236,228,0.35)" />
        <span>Dusk to Dawn</span>
      </div>
    </div>
  );
}

// ─── Horizontal lockups ──────────────────────────────────────────

// H1 — Primary horizontal lockup: SkyHeart mark on the left, wordmark to
// its right with the hairline rule + mono detail beneath. The full marque.
function H1() {
  return (
    <div className="ink">
      <div className="stage">
        <div className="row" style={{ gap: 26, alignItems: 'center' }}>
          <SkyHeart size={78} strokeWidth={1.6} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Wordmark size={72} />
            <div className="rule" style={{ height: 1, width: '100%', marginTop: 14, opacity: 0.5 }} />
            <div
              className="mono dim uppercase"
              style={{ fontSize: 9, letterSpacing: '0.28em', marginTop: 10, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span>Est. MMXXVI</span>
              <Dot color="rgba(240,236,228,0.35)" />
              <span>Dusk to Dawn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// H2 — Cleaner horizontal: mark + wordmark, no caption. Most flexible.
function H2() {
  return (
    <div className="ink">
      <div className="stage">
        <div className="row" style={{ gap: 24, alignItems: 'center' }}>
          <SkyHeart size={86} strokeWidth={1.7} />
          <Wordmark size={84} />
        </div>
      </div>
    </div>
  );
}

// H3 — Pure wordmark, no mark. The typographic-only treatment for narrow
// editorial contexts (e.g. running header, footer, sign-off).
function H3() {
  return (
    <div className="ink">
      <div className="stage">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Wordmark size={84} />
          <Detail width={300} />
        </div>
      </div>
    </div>
  );
}

// ─── Stacked lockups ─────────────────────────────────────────────

// S1 — Primary stacked: SkyHeart above wordmark, with caption beneath.
function S1() {
  return (
    <div className="ink">
      <div className="stage">
        <div className="stack" style={{ gap: 30 }}>
          <SkyHeart size={108} strokeWidth={1.8} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Wordmark size={68} />
            <Detail width={240} marginTop={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

// S2 — Stacked without caption — tighter, for cards and avatars.
function S2() {
  return (
    <div className="ink">
      <div className="stage">
        <div className="stack" style={{ gap: 28 }}>
          <SkyHeart size={108} strokeWidth={1.8} />
          <Wordmark size={72} />
        </div>
      </div>
    </div>
  );
}

// S3 — Stacked with mark sat inside a hairline framing (just two short
// rules flanking it). A more architectural / masthead-y feel.
function S3() {
  return (
    <div className="ink">
      <div className="stage">
        <div className="stack" style={{ gap: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span className="rule" style={{ height: 1, width: 48 }} />
            <SkyHeart size={82} strokeWidth={1.6} />
            <span className="rule" style={{ height: 1, width: 48 }} />
          </div>
          <Wordmark size={72} />
          <div className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.32em', color: 'var(--amber)', marginTop: 4 }}>
            A Nightly Guide
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App icons / mark in isolation ──────────────────────────────

// I1 — Plain mark on the dark ground. The canonical outlined form.
function I1() {
  return (
    <div className="ink crop">
      <span className="tr" /><span className="bl" />
      <div className="stage">
        <SkyHeart size={220} strokeWidth={2} />
      </div>
    </div>
  );
}

// I2 — Mark inside a hairline circle. Reads like a coin or a medallion.
function I2() {
  return (
    <div className="ink crop">
      <span className="tr" /><span className="bl" />
      <div className="stage">
        <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="120" cy="120" r="116" fill="none" stroke="var(--cream-faint)" strokeWidth="1" />
          </svg>
          <SkyHeart size={160} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

// I3 — Mark inside an iOS-style squircle, sized for a real home screen
// icon. The squircle has a faint inner ring so the dark icon sits inside
// the dark canvas with a hint of separation.
function I3() {
  return (
    <div className="ink crop">
      <span className="tr" /><span className="bl" />
      <div className="stage">
        <div style={{
          width: 232, height: 232, borderRadius: 52, // iOS squircle radius
          background: 'var(--ink)',
          boxShadow: 'inset 0 0 0 1px rgba(240,236,228,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SkyHeart size={150} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

// ─── Context applications ───────────────────────────────────────

// C1 — App splash / launch screen at a mobile width.
function C1() {
  return (
    <div className="ink" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px 0', fontSize: 11 }}>
        <span className="cream sans" style={{ fontWeight: 600 }}>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><rect x="0.5" y="0.5" width="13" height="8" rx="1.5" stroke="#f0ece4" opacity="0.8"/><rect x="2" y="2" width="10" height="5" rx="0.5" fill="#f0ece4" opacity="0.8"/><rect x="14.5" y="3" width="1" height="3" rx="0.3" fill="#f0ece4" opacity="0.8"/></svg>
        </div>
      </div>
      {/* main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <SkyHeart size={62} strokeWidth={1.5} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div className="serif cream word" style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 0.95 }}>
            Out <span className="italic">Tonight</span>
          </div>
          <div className="rule" style={{ height: 1, width: 140, opacity: 0.4 }} />
          <div className="mono dim uppercase" style={{ fontSize: 8, letterSpacing: '0.28em' }}>A Nightly Guide</div>
        </div>
      </div>
      {/* footer */}
      <div style={{ padding: '0 22px 30px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <div style={{
          background: 'var(--cream)', color: 'var(--ink)', padding: '14px 24px',
          borderRadius: 999, fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.04em', width: '100%', textAlign: 'center', boxSizing: 'border-box'
        }}>
          Find tonight's plans
        </div>
        <div className="mono faint uppercase" style={{ fontSize: 8, letterSpacing: '0.3em' }}>v 0.1</div>
      </div>
    </div>
  );
}

// C2 — Editorial-style web header with nav + hero.
function C2() {
  return (
    <div className="ink" style={{ padding: 36, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* top bar — nav strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 24, borderBottom: '1px solid rgba(240,236,228,0.12)' }}>
        <div className="row" style={{ gap: 14, alignItems: 'center' }}>
          <SkyHeart size={34} strokeWidth={1.4} />
          <span className="serif cream word" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1 }}>
            Out <span className="italic">Tonight</span>
          </span>
        </div>
        <div className="row sans uppercase" style={{ gap: 26, fontSize: 10, letterSpacing: '0.22em', color: 'var(--cream-dim)' }}>
          <span>Tonight</span>
          <span>This Week</span>
          <span>Saved</span>
          <span style={{ color: 'var(--cream)' }}>Sign in</span>
        </div>
      </div>
      {/* hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        <div className="mono uppercase" style={{ fontSize: 10, letterSpacing: '0.34em', color: 'var(--amber)' }}>
          Thursday · 24 May · 19°
        </div>
        <div className="serif cream" style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.018em', maxWidth: 580 }}>
          Seven plans for a <span className="italic">slow, warm</span> Thursday night.
        </div>
        <div className="sans dim" style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 460 }}>
          A wine bar that opened last month, a screening of a film you forgot you loved, and four other things worth leaving the apartment for.
        </div>
      </div>
    </div>
  );
}

// C3 — Home-screen icon mock: rounded squircle with the SkyHeart mark.
function C3() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#1c1814', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 20%, rgba(201,128,58,0.18), transparent 50%), radial-gradient(circle at 70% 80%, rgba(80,40,120,0.18), transparent 55%)' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 168, height: 168, background: 'var(--ink)',
          borderRadius: 38,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <SkyHeart size={118} strokeWidth={2} />
        </div>
        <span className="sans" style={{ color: '#fff', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
          Out Tonight
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { H1, H2, H3, S1, S2, S3, I1, I2, I3, C1, C2, C3 });
