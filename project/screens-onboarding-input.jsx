// screens-onboarding-input.jsx — Splash, input form, loading state.
// Cream & Cinema palette: paper-cream pages, ink text, cinema-red CTAs,
// wine italic accents.

// ── A1 — Splash / Sign in ───────────────────────────────────────
function SplashScreen() {
  return (
    <MobileFrame>
      {/* corner ornaments — tiny printer's-mark hairlines */}
      <CornerCrop pos="tl" /><CornerCrop pos="tr" /><CornerCrop pos="bl" /><CornerCrop pos="br" />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px',
        gap: 28, position: 'relative',
      }}>
        <Mark size={46} strokeWidth={1.5} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div className="serif word" style={{
            fontSize: 50, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 0.95,
            color: 'var(--ink)', textAlign: 'center',
          }}>
            Out <span className="italic" style={{ color: 'var(--wine)' }}>Tonight</span>
          </div>
          <div className="rule-h" style={{ width: 160, opacity: 0.5 }}/>
          <div className="sans" style={{
            fontSize: 13, letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.5, maxWidth: 260,
            color: 'var(--ink-dim)',
          }}>
            Tonight, make it <span className="italic serif" style={{ color: 'var(--wine)' }}>worth remembering.</span>
          </div>
        </div>

        {/* tiny editorial footer line */}
        <div className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.34em', color: 'var(--ink-faint)', marginTop: 8 }}>
          Issue Nº 24 · Spring MMXXVI
        </div>
      </div>

      {/* sign-in footer */}
      <div style={{ padding: '0 28px 44px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', position: 'relative' }}>
        <div style={{
          background: 'var(--ink)', color: 'var(--page)',
          borderRadius: 999, padding: '14px 22px',
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
          letterSpacing: '0.01em',
          width: '100%', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <GoogleG size={18} />
          Continue with Google
        </div>
        <div className="mono uppercase" style={{ fontSize: 8, letterSpacing: '0.28em', textAlign: 'center', lineHeight: 1.7, color: 'var(--ink-faint)' }}>
          By signing in you agree to our<br/>Terms &amp; Privacy
        </div>
      </div>
    </MobileFrame>
  );
}

function CornerCrop({ pos }) {
  const s = { position: 'absolute', width: 18, height: 18, pointerEvents: 'none' };
  const c = 'var(--ink-faint)';
  const map = {
    tl: { ...s, top: 18, left: 18, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` },
    tr: { ...s, top: 18, right: 18, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` },
    bl: { ...s, bottom: 18, left: 18, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` },
    br: { ...s, bottom: 18, right: 18, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` },
  };
  return <div style={map[pos]} />;
}

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

// ── B1 — Input form (filled) ────────────────────────────────────
function InputFormScreen() {
  return (
    <MobileFrame>
      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 22px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={18} color="var(--ink)" />
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--ink-dim)' }}>Back</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mark size={14} />
          <Wordmark size={13} />
        </div>
        <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'transparent' }}>Back</span>
      </div>

      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '4px 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {/* Section header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--red)' }}>Tonight's brief</span>
          <h1 className="serif" style={{
            fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0, color: 'var(--ink)',
          }}>
            Where are we <span className="italic" style={{ color: 'var(--wine)' }}>going?</span>
          </h1>
        </div>

        {/* City */}
        <FieldRow label="City">
          <PinIcon size={14} color="var(--ink-dim)" />
          <span className="sans" style={{ fontSize: 15, flex: 1, color: 'var(--ink)' }}>Brooklyn, NY</span>
          <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.24em', color: 'var(--ink-dim)' }}>Change</span>
        </FieldRow>

        {/* Date + Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FieldRow label="Date">
            <span className="sans" style={{ fontSize: 14, color: 'var(--ink)' }}>Thu · May 24</span>
          </FieldRow>
          <FieldRow label="Time">
            <span className="sans" style={{ fontSize: 14, flex: 1, color: 'var(--ink)' }}>Evening</span>
            <ChevronDown size={11} color="var(--ink-dim)" />
          </FieldRow>
        </div>

        {/* Group size */}
        <FieldRow label="Who's coming">
          <span className="sans" style={{ fontSize: 14, flex: 1, color: 'var(--ink)' }}>2 people</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Stepper symbol="−" />
            <span className="serif" style={{ fontSize: 16, minWidth: 14, textAlign: 'center', color: 'var(--ink)' }}>2</span>
            <Stepper symbol="+" />
          </div>
        </FieldRow>

        {/* Vibe chips */}
        <div>
          <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--ink-dim)' }}>Tonight's vibe</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 11 }}>
            <VibeChip selected>Romantic</VibeChip>
            <VibeChip>Adventurous</VibeChip>
            <VibeChip selected>Quirky</VibeChip>
            <VibeChip>Relaxed</VibeChip>
            <VibeChip>Formal</VibeChip>
            <VibeChip>Casual</VibeChip>
            <VibeChip>Cultural</VibeChip>
            <VibeChip>Active</VibeChip>
            <VibeChip selected>Cozy</VibeChip>
            <VibeChip>Spontaneous</VibeChip>
          </div>
        </div>

        {/* Budget */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--ink-dim)' }}>Budget per person</span>
            <span className="serif italic" style={{ fontSize: 18, color: 'var(--wine)' }}>$85</span>
          </div>
          <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'var(--ink-hair)', borderRadius: 2 }}/>
            <div style={{ position: 'absolute', left: 0, width: '22%', height: 2, background: 'var(--red)', borderRadius: 2 }}/>
            <div style={{
              position: 'absolute', left: 'calc(22% - 9px)',
              width: 18, height: 18, borderRadius: 999,
              background: 'var(--page)', border: '3px solid var(--red)',
              boxShadow: '0 2px 6px rgba(26,10,8,0.18)',
            }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.22em', color: 'var(--ink-faint)' }}>$25</span>
            <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.22em', color: 'var(--ink-faint)' }}>$500+</span>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        {/* CTA */}
        <RedCTA icon={<span style={{ fontSize: 14 }}>→</span>}>Find ideas</RedCTA>
      </div>
    </MobileFrame>
  );
}

function PinIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 12.5 C 7 12.5, 11.5 8.5, 11.5 5.5 C 11.5 3, 9.5 1, 7 1 C 4.5 1, 2.5 3, 2.5 5.5 C 2.5 8.5, 7 12.5, 7 12.5 Z" stroke={color} strokeWidth="1.1" fill="none"/>
      <circle cx="7" cy="5.5" r="1.4" stroke={color} strokeWidth="1.1" fill="none"/>
    </svg>
  );
}
function ChevronDown({ size = 12, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2 4 L6 8 L10 4" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function ChevronLeft({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M9 2 L4 7 L9 12" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function Stepper({ symbol }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 999,
      border: '1px solid var(--ink-hair)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink)', fontSize: 14, fontFamily: 'var(--sans)', lineHeight: 1,
    }}>{symbol}</div>
  );
}

// ── B2 — Loading state ──────────────────────────────────────────
function LoadingScreen() {
  return (
    <MobileFrame>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', gap: 36, position: 'relative',
      }}>
        {/* skeleton card deck — these are the dark deck cards previewed
            against the cream page */}
        <div style={{ position: 'relative', width: 220, height: 280 }}>
          {[2, 1, 0].map(i => (
            <div key={i} style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${i * 8}px, ${i * -10}px) rotate(${i * 2 - 1}deg)`,
              background: 'linear-gradient(165deg, #1f1812 0%, #14100c 100%)',
              border: '1px solid rgba(0,0,0,0.18)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(26,10,8,0.18)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(110deg, transparent 30%, rgba(246,236,217,0.07) 50%, transparent 70%)',
              }}/>
              {i === 0 && (
                <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ height: 6, width: 60, background: 'rgba(200,54,43,0.5)', borderRadius: 3 }}/>
                  <div style={{ height: 12, width: '85%', background: 'rgba(246,236,217,0.22)', borderRadius: 3 }}/>
                  <div style={{ height: 12, width: '60%', background: 'rgba(246,236,217,0.14)', borderRadius: 3 }}/>
                  <div style={{ height: 8, width: '70%', background: 'rgba(246,236,217,0.1)', borderRadius: 3, marginTop: 4 }}/>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.015em', maxWidth: 280, color: 'var(--ink)' }}>
            Searching for something <span className="italic" style={{ color: 'var(--wine)' }}>worth remembering</span>…
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Spinner size={10} />
            <span className="mono uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--red)' }}>
              10 ideas inbound
            </span>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

function Spinner({ size = 10 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      border: `1.5px solid rgba(200,54,43,0.22)`,
      borderTopColor: 'var(--red)',
    }}/>
  );
}

Object.assign(window, {
  SplashScreen, InputFormScreen, LoadingScreen,
  ChevronLeft, ChevronDown, PinIcon, Stepper, Spinner, GoogleG, CornerCrop,
});
