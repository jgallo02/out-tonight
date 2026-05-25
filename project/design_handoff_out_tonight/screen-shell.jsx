// screen-shell.jsx — Mobile-frame chrome + UI primitives for the
// Cream & Cinema palette: warm paper page, near-black ink, cinema red as
// primary accent, deep wine as secondary / italic emphasis.
//
// Components live on `window` so screen files (screens-*.jsx) can use
// them without imports.

const OT_W = 360;
const OT_H = 760;

// Status bar — adapts to the active palette via var(--ink). SVG attrs
// don't accept var() values directly, so colors are pulled into style.
function ShellStatusBar({ time = '9:41' }) {
  const fill = { fill: 'var(--ink)' };
  const fillDim = { fill: 'var(--ink)', opacity: 0.45 };
  const stroke = { stroke: 'var(--ink)', fill: 'none' };
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 24px 0', fontSize: 12, color: 'var(--ink)', pointerEvents: 'none', zIndex: 5,
    }}>
      <span className="sans" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="10" viewBox="0 0 16 10">
          <rect x="0"  y="7"   width="2.5" height="3"   rx="0.4" style={fill}/>
          <rect x="4"  y="5"   width="2.5" height="5"   rx="0.4" style={fill}/>
          <rect x="8"  y="3"   width="2.5" height="7"   rx="0.4" style={fill}/>
          <rect x="12" y="0.5" width="2.5" height="9.5" rx="0.4" style={fillDim}/>
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10">
          <path d="M7 9.2 L8.4 7.5 A2 2 0 0 0 5.6 7.5 Z" style={fill}/>
          <path d="M3 5.6 A6 6 0 0 1 11 5.6"  strokeWidth="1.2" strokeLinecap="round" style={stroke}/>
          <path d="M0.8 3 A9 9 0 0 1 13.2 3"  strokeWidth="1.2" strokeLinecap="round" style={{ ...stroke, opacity: 0.7 }}/>
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10">
          <rect x="0.5" y="0.5" width="18" height="9" rx="2" strokeWidth="1" style={{ stroke: 'var(--ink)', opacity: 0.5, fill: 'none' }}/>
          <rect x="2" y="2" width="14" height="6" rx="1" style={fill}/>
          <rect x="19.5" y="3.5" width="1.5" height="3" rx="0.5" style={fillDim}/>
        </svg>
      </div>
    </div>
  );
}

// Mobile frame — a paper page that adapts to whichever palette is active.
// Children fill everything between the status bar and the optional bottom nav.
function MobileFrame({ children, nav, bg }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: bg || 'var(--page)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      color: 'var(--ink)',
    }}>
      {/* edge vignette — picks up whichever accent the palette defines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 130% 90% at 50% 50%, transparent 55%, var(--page-vignette, rgba(0,0,0,0.06)) 100%)',
      }}/>
      <ShellStatusBar />
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, paddingTop: 44 }}>
        {children}
      </div>
      {nav}
    </div>
  );
}

// Bottom tab nav — cream surface with a hairline top border. Active in
// cinema red, inactive in dim ink.
function BottomNav({ active = 'discover' }) {
  const tabs = [
    { key: 'discover', label: 'Discover', icon: NavCompass },
    { key: 'matches',  label: 'Matches',  icon: NavHeart },
    { key: 'profile',  label: 'Profile',  icon: NavPerson },
  ];
  return (
    <div style={{
      borderTop: '1px solid var(--ink-hair)',
      background: 'var(--page-warm)',
      padding: '10px 0 18px',
      display: 'flex',
      position: 'relative', zIndex: 2,
    }}>
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = t.key === active;
        const color = isActive ? 'var(--red)' : 'var(--ink-dim)';
        return (
          <div key={t.key} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <Icon size={22} color={color} />
            <span className="mono uppercase" style={{ fontSize: 8, letterSpacing: '0.22em', color }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Nav icons (hairline outlines, matching the SkyHeart weight) ──
function NavCompass({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.2" stroke={color} strokeWidth="1.4"/>
      <path d="M15.5 8.5 L13 13 L8.5 15.5 L11 11 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="miter" fill="none"/>
    </svg>
  );
}
function NavHeart({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 20 C 5 15.5, 3 11.5, 5 8.5 C 6.5 6.5, 9.5 6, 12 9 C 14.5 6, 17.5 6.5, 19 8.5 C 21 11.5, 19 15.5, 12 20 Z"
            stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}
function NavPerson({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="3.4" stroke={color} strokeWidth="1.4"/>
      <path d="M4.5 20 C 5.5 16, 8.5 14.5, 12 14.5 C 15.5 14.5, 18.5 16, 19.5 20" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// Out Tonight wordmark — used inline in app headers. "Out" is ink roman,
// "Tonight" is wine italic — the primary brand expression for cream surfaces.
function Wordmark({ size = 14 }) {
  return (
    <span className="serif" style={{
      fontSize: size, fontWeight: 500, lineHeight: 1, color: 'var(--ink)', letterSpacing: '-0.005em',
    }}>
      Out <span className="italic" style={{ color: 'var(--wine)' }}>Tonight</span>
    </span>
  );
}

// SkyHeart wired to the wine accent for the new palette. Use this rather
// than the bare <SkyHeart/> in app surfaces so the mark stays on-brand.
function Mark({ size = 16, strokeWidth = 1.4, color = 'var(--wine)' }) {
  return <SkyHeart size={size} strokeWidth={strokeWidth} color={color} />;
}

// ── UI primitives ──

// Category badge — small wine-outlined monospace pill. Used at the top of
// cards and as a thumbnail eyebrow.
function CategoryBadge({ children, tone = 'wine' }) {
  const cfg = tone === 'wine'
    ? { stroke: 'var(--wine)', color: 'var(--wine)' }
    : { stroke: 'var(--red)',  color: 'var(--red)'  };
  return (
    <span className="mono uppercase" style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 9px', borderRadius: 999,
      border: `1px solid ${cfg.stroke}`,
      color: cfg.color, fontSize: 9, letterSpacing: '0.22em', lineHeight: 1,
      background: 'transparent',
    }}>{children}</span>
  );
}

// Vibe / filter pill — outline (ink) by default, filled red when selected.
function VibeChip({ children, selected = false }) {
  return (
    <span className="sans" style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '8px 14px', borderRadius: 999,
      border: selected ? '1px solid transparent' : '1px solid var(--ink-hair)',
      background: selected ? 'var(--red)' : 'transparent',
      color: selected ? 'var(--page)' : 'var(--ink-soft)',
      fontSize: 12, fontWeight: selected ? 600 : 500,
      letterSpacing: '0.01em',
    }}>{children}</span>
  );
}

// Primary CTA — cinema red bg, cream text. Bold and unmissable.
function RedCTA({ children, full = true, icon = null }) {
  return (
    <div style={{
      background: 'var(--red)', color: 'var(--page)',
      padding: '15px 22px', borderRadius: 999,
      fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      width: full ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box',
      display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 10,
      boxShadow: '0 6px 18px rgba(200,54,43,0.22)',
    }}>
      {children}
      {icon}
    </div>
  );
}

// Secondary CTA — ink outline, red text on cream.
function GhostCTA({ children, full = true }) {
  return (
    <div style={{
      background: 'transparent', color: 'var(--red)',
      padding: '14px 22px', borderRadius: 999,
      border: '1px solid var(--red)',
      fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      width: full ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box',
    }}>{children}</div>
  );
}

// Form input shell — labeled paper-card row.
function FieldRow({ label, hint, children, dense = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="mono uppercase" style={{
          fontSize: 9, letterSpacing: '0.26em', color: 'var(--ink-dim)',
        }}>{label}</span>
        {hint && <span className="sans" style={{
          fontSize: 11, color: 'var(--red)', letterSpacing: '0.01em',
        }}>{hint}</span>}
      </div>
      <div style={{
        background: 'var(--page-warm)',
        border: '1px solid var(--ink-hair)',
        borderRadius: 14,
        padding: dense ? '12px 14px' : '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {children}
      </div>
    </div>
  );
}

// Hairline rule with optional centered mono caption.
function MonoDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <div style={{ height: 1, flex: 1, background: 'var(--ink-hair)' }}/>
      {label && <span className="mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.3em', color: 'var(--ink-dim)' }}>{label}</span>}
      <div style={{ height: 1, flex: 1, background: 'var(--ink-hair)' }}/>
    </div>
  );
}

// Atmospheric "photo" placeholder — rich dark gradient compositions keyed
// to category. These stay dark in the cream-themed app: photos are the
// only dark surfaces, framed by paper chrome — a classic editorial spread.
function PhotoBG({ scene = 'jazz', children }) {
  const scenes = {
    jazz: {
      base: 'linear-gradient(155deg, #2a1408 0%, #120806 55%, #060403 100%)',
      lights: 'radial-gradient(circle at 22% 68%, rgba(220,140,60,0.55), transparent 28%), radial-gradient(circle at 78% 30%, rgba(200,54,43,0.32), transparent 32%), radial-gradient(circle at 50% 90%, rgba(80,30,20,0.6), transparent 35%)',
    },
    rooftop: {
      base: 'linear-gradient(180deg, #1a0e22 0%, #2a1622 38%, #3a1a16 65%, #1a0d0a 100%)',
      lights: 'radial-gradient(circle at 70% 70%, rgba(200,154,58,0.4), transparent 30%), radial-gradient(circle at 30% 85%, rgba(200,54,43,0.32), transparent 35%), radial-gradient(ellipse 50% 18% at 50% 60%, rgba(255,200,120,0.15), transparent 70%)',
    },
    wine: {
      base: 'linear-gradient(160deg, #2a0a14 0%, #1a0608 50%, #0a0303 100%)',
      lights: 'radial-gradient(circle at 50% 30%, rgba(220,130,80,0.35), transparent 38%), radial-gradient(circle at 18% 78%, rgba(200,54,43,0.45), transparent 32%), radial-gradient(circle at 82% 75%, rgba(120,30,40,0.35), transparent 30%)',
    },
    sauna: {
      base: 'linear-gradient(180deg, #1c1410 0%, #2a1d14 45%, #1a0f08 100%)',
      lights: 'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(255,180,90,0.35), transparent 60%), radial-gradient(circle at 25% 80%, rgba(120,70,40,0.45), transparent 40%)',
    },
    gallery: {
      base: 'linear-gradient(165deg, #0e1018 0%, #14161c 50%, #08080a 100%)',
      lights: 'radial-gradient(circle at 30% 35%, rgba(220,200,170,0.18), transparent 32%), radial-gradient(circle at 72% 65%, rgba(200,54,43,0.22), transparent 32%)',
    },
    speakeasy: {
      base: 'linear-gradient(170deg, #0f0a0a 0%, #1d1108 50%, #050302 100%)',
      lights: 'radial-gradient(ellipse 40% 25% at 50% 35%, rgba(255,160,70,0.5), transparent 65%), radial-gradient(circle at 80% 80%, rgba(200,54,43,0.35), transparent 35%)',
    },
    sushi: {
      base: 'linear-gradient(180deg, #1a0f0a 0%, #2a1810 45%, #0e0805 100%)',
      lights: 'radial-gradient(circle at 50% 55%, rgba(240,180,100,0.4), transparent 30%), radial-gradient(circle at 18% 25%, rgba(140,70,40,0.3), transparent 32%), radial-gradient(circle at 85% 78%, rgba(110,50,30,0.4), transparent 30%)',
    },
    observatory: {
      base: 'linear-gradient(180deg, #06081a 0%, #0a0e26 45%, #100818 100%)',
      lights: 'radial-gradient(circle at 75% 25%, rgba(180,160,220,0.18), transparent 30%), radial-gradient(circle at 25% 78%, rgba(100,80,160,0.22), transparent 35%), radial-gradient(ellipse 60% 20% at 50% 90%, rgba(40,30,80,0.5), transparent 70%)',
    },
  };
  const s = scenes[scene] || scenes.jazz;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: s.base,
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: s.lights, mixBlendMode: 'screen' }}/>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.18, mixBlendMode: 'overlay',
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/><feColorMatrix values=%220 0 0 0 0.9  0 0 0 0 0.75  0 0 0 0 0.6  0 0 0 0.5 0%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/></svg>")',
      }}/>
      {children}
    </div>
  );
}

Object.assign(window, {
  OT_W, OT_H,
  MobileFrame, ShellStatusBar, BottomNav,
  NavCompass, NavHeart, NavPerson,
  Wordmark, Mark, CategoryBadge, VibeChip,
  RedCTA, GhostCTA, FieldRow, MonoDivider, PhotoBG,
});
