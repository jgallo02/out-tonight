// palettes.jsx — Five distinct color directions for Out Tonight, each
// defined as a complete token set. A <PaletteScope palette="…"> wrapper
// applies the palette by setting CSS custom properties on a containing
// div, so any descendant that reads var(--page), var(--ink), var(--red),
// etc. is automatically themed.
//
// Photos on swipe cards intentionally stay dark/atmospheric across all
// palettes — they represent real venue imagery, not theme color.

const PALETTES = {
  // 01 — OXBLOOD THEATER
  // Deep wine room, theater curtains, antique brass detail. Old-world
  // dramatic. Brass is primary accent; peach is the italic emphasis.
  oxblood: {
    name: 'Oxblood Theater',
    blurb: 'Deep wine room · antique brass · peach italic',
    vars: {
      '--page':       '#3a0e15',
      '--page-warm':  '#481620',
      '--page-soft':  '#5a1c28',
      '--ink':        '#f2e7cc',
      '--ink-soft':   '#d4c4a4',
      '--ink-dim':    'rgba(242,231,204,0.62)',
      '--ink-faint':  'rgba(242,231,204,0.35)',
      '--ink-hair':   'rgba(242,231,204,0.16)',
      '--ink-mist':   'rgba(242,231,204,0.06)',
      '--red':        '#d4a23a',
      '--red-deep':   '#a88020',
      '--wine':       '#f5b896',
      '--wine-soft':  'rgba(245,184,150,0.12)',
      '--gold':       '#d4a23a',
      '--page-vignette': 'rgba(0,0,0,0.4)',
    },
  },

  // 02 — FOREST LIBRARY
  // Deep emerald walls, leather chairs, brass lamps. Grown-up, calm.
  forest: {
    name: 'Forest Library',
    blurb: 'Deep emerald · brass lamplight · ivory text',
    vars: {
      '--page':       '#102a1f',
      '--page-warm':  '#163428',
      '--page-soft':  '#1c3e30',
      '--ink':        '#f0e8d4',
      '--ink-soft':   '#c8c0a8',
      '--ink-dim':    'rgba(240,232,212,0.62)',
      '--ink-faint':  'rgba(240,232,212,0.32)',
      '--ink-hair':   'rgba(240,232,212,0.14)',
      '--ink-mist':   'rgba(240,232,212,0.05)',
      '--red':        '#d9a23a',
      '--red-deep':   '#a8801e',
      '--wine':       '#e8c878',
      '--wine-soft':  'rgba(232,200,120,0.12)',
      '--gold':       '#d9a23a',
      '--page-vignette': 'rgba(0,0,0,0.4)',
    },
  },

  // 03 — MIDNIGHT + PERSIMMON
  // Deep ink blue, hot persimmon orange, moonstone text. Sunset over a
  // harbor; cinematic, going-out energy.
  midnight: {
    name: 'Midnight & Persimmon',
    blurb: 'Deep ink blue · persimmon · moonstone',
    vars: {
      '--page':       '#0e1626',
      '--page-warm':  '#18233a',
      '--page-soft':  '#20304a',
      '--ink':        '#e8e0d0',
      '--ink-soft':   '#c8c2b2',
      '--ink-dim':    'rgba(232,224,208,0.62)',
      '--ink-faint':  'rgba(232,224,208,0.30)',
      '--ink-hair':   'rgba(232,224,208,0.12)',
      '--ink-mist':   'rgba(232,224,208,0.05)',
      '--red':        '#f06234',
      '--red-deep':   '#c44820',
      '--wine':       '#f4b478',
      '--wine-soft':  'rgba(244,180,120,0.12)',
      '--gold':       '#e8c068',
      '--page-vignette': 'rgba(0,0,0,0.4)',
    },
  },

  // 04 — AUBERGINE + BLUSH
  // Deep eggplant velvet, dusty pink/blush, gold spark. Sensual,
  // intimate jazz lounge — the most romantic of the five.
  aubergine: {
    name: 'Aubergine & Blush',
    blurb: 'Eggplant velvet · dusty pink · gold spark',
    vars: {
      '--page':       '#28162e',
      '--page-warm':  '#34203a',
      '--page-soft':  '#3d2a44',
      '--ink':        '#f0e0e0',
      '--ink-soft':   '#d8c4c8',
      '--ink-dim':    'rgba(240,224,224,0.62)',
      '--ink-faint':  'rgba(240,224,224,0.32)',
      '--ink-hair':   'rgba(240,224,224,0.14)',
      '--ink-mist':   'rgba(240,224,224,0.05)',
      '--red':        '#e8859a',
      '--red-deep':   '#c45a74',
      '--wine':       '#f4b4a8',
      '--wine-soft':  'rgba(244,180,168,0.12)',
      '--gold':       '#e8b478',
      '--page-vignette': 'rgba(0,0,0,0.35)',
    },
  },

  // 05 — CARBON + ACID
  // Warm carbon (not pure black), acid lime-yellow pop, soft pearl. The
  // modern Brutalist-gallery wildcard; club-coded, design-y.
  carbon: {
    name: 'Carbon & Acid',
    blurb: 'Warm carbon · acid lime · soft pearl',
    vars: {
      '--page':       '#1a1a1c',
      '--page-warm':  '#252527',
      '--page-soft':  '#2e2e30',
      '--ink':        '#f4eed8',
      '--ink-soft':   '#c8c4b0',
      '--ink-dim':    'rgba(244,238,216,0.62)',
      '--ink-faint':  'rgba(244,238,216,0.30)',
      '--ink-hair':   'rgba(244,238,216,0.12)',
      '--ink-mist':   'rgba(244,238,216,0.05)',
      '--red':        '#cce842',
      '--red-deep':   '#a8c020',
      '--wine':       '#f4a892',
      '--wine-soft':  'rgba(244,168,146,0.12)',
      '--gold':       '#cce842',
      '--page-vignette': 'rgba(0,0,0,0.4)',
    },
  },

  // ── GEMSTONE STUDY ──────────────────────────────────────────────
  // Four jewel-toned palettes built like a velvet jewelry case. Each
  // base is a true gemstone hue (sapphire, emerald, amethyst, onyx) and
  // the accents are complementary gems set into that body.

  // 06 — SAPPHIRE & RUBY
  // Royal-velvet sapphire blue with ruby red primary and warm gold italic.
  sapphire: {
    name: 'Sapphire & Ruby',
    blurb: 'Velvet sapphire · ruby · pearl · gold italic',
    vars: {
      '--page':       '#0c1538',
      '--page-warm':  '#16204a',
      '--page-soft':  '#1f2a5c',
      '--ink':        '#efe5d2',
      '--ink-soft':   '#d4c7a8',
      '--ink-dim':    'rgba(239,229,210,0.62)',
      '--ink-faint':  'rgba(239,229,210,0.32)',
      '--ink-hair':   'rgba(239,229,210,0.14)',
      '--ink-mist':   'rgba(239,229,210,0.06)',
      '--red':        '#c8243a',
      '--red-deep':   '#9c1c2c',
      '--wine':       '#e8a832',
      '--wine-soft':  'rgba(232,168,50,0.12)',
      '--gold':       '#e8a832',
      '--page-vignette': 'rgba(0,0,0,0.45)',
    },
  },

  // 07 — EMERALD & TOPAZ
  // Deep luscious emerald with golden topaz accents. Cartier-meets-supper-club.
  emerald: {
    name: 'Emerald & Topaz',
    blurb: 'Deep emerald · topaz gold · pearl cream',
    vars: {
      '--page':       '#0d3528',
      '--page-warm':  '#154030',
      '--page-soft':  '#1d4d3a',
      '--ink':        '#efe5d0',
      '--ink-soft':   '#c8c0a4',
      '--ink-dim':    'rgba(239,229,208,0.62)',
      '--ink-faint':  'rgba(239,229,208,0.32)',
      '--ink-hair':   'rgba(239,229,208,0.14)',
      '--ink-mist':   'rgba(239,229,208,0.05)',
      '--red':        '#e8a432',
      '--red-deep':   '#b4801c',
      '--wine':       '#f0c870',
      '--wine-soft':  'rgba(240,200,112,0.12)',
      '--gold':       '#e8a432',
      '--page-vignette': 'rgba(0,0,0,0.4)',
    },
  },

  // 08 — AMETHYST & CITRINE
  // Rich amethyst purple with citrine yellow-gold pop. Mystic, luxe.
  amethyst: {
    name: 'Amethyst & Citrine',
    blurb: 'Deep amethyst · citrine · pearl blush',
    vars: {
      '--page':       '#2a124a',
      '--page-warm':  '#3a1d5c',
      '--page-soft':  '#4a2870',
      '--ink':        '#f0e8e8',
      '--ink-soft':   '#d4c8c4',
      '--ink-dim':    'rgba(240,232,232,0.62)',
      '--ink-faint':  'rgba(240,232,232,0.32)',
      '--ink-hair':   'rgba(240,232,232,0.14)',
      '--ink-mist':   'rgba(240,232,232,0.05)',
      '--red':        '#e8c83a',
      '--red-deep':   '#b8a020',
      '--wine':       '#f4d878',
      '--wine-soft':  'rgba(244,216,120,0.12)',
      '--gold':       '#e8c83a',
      '--page-vignette': 'rgba(0,0,0,0.45)',
    },
  },

  // 09 — ONYX JEWEL BOX
  // Cool deep onyx with two gems set against it — ruby for the CTA,
  // emerald for the italic Tonight, topaz for gold detail. Most
  // jewelry-case-coded of the four.
  jewelbox: {
    name: 'Onyx Jewel Box',
    blurb: 'Onyx velvet · ruby · emerald italic · topaz',
    vars: {
      '--page':       '#0a0c14',
      '--page-warm':  '#14171f',
      '--page-soft':  '#1c1f28',
      '--ink':        '#f0ead8',
      '--ink-soft':   '#c8c4b0',
      '--ink-dim':    'rgba(240,234,216,0.62)',
      '--ink-faint':  'rgba(240,234,216,0.30)',
      '--ink-hair':   'rgba(240,234,216,0.12)',
      '--ink-mist':   'rgba(240,234,216,0.05)',
      '--red':        '#c8243a',
      '--red-deep':   '#9c1c2c',
      '--wine':       '#2ea862',
      '--wine-soft':  'rgba(46,168,98,0.14)',
      '--gold':       '#e8b042',
      '--page-vignette': 'rgba(0,0,0,0.5)',
    },
  },
};

// PaletteScope — sets the palette's CSS custom properties on a wrapping
// div so descendant `var(--*)` calls resolve to the palette's values.
// Anything inside this wrapper renders in that palette.
function PaletteScope({ palette, children, style }) {
  const p = PALETTES[palette];
  if (!p) return children;
  return (
    <div style={{
      width: '100%', height: '100%',
      ...p.vars,
      ...(style || {}),
    }}>
      {children}
    </div>
  );
}

// Small overlay chip — bottom-right corner of an artboard, names the
// palette so the user can connect the artboard to its label.
function PaletteChip({ palette }) {
  const p = PALETTES[palette];
  if (!p) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 10, right: 10, zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 9px', borderRadius: 999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.12)',
      pointerEvents: 'none',
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.85)',
      }}>{p.name}</span>
    </div>
  );
}

// A swatch row — five color chips with hex labels — for the dedicated
// palette-reference artboard. Used outside any phone frame.
function PaletteSwatch({ palette }) {
  const p = PALETTES[palette];
  if (!p) return null;
  const chips = [
    { label: 'Page',   value: p.vars['--page']      },
    { label: 'Surface',value: p.vars['--page-warm'] },
    { label: 'Ink',    value: p.vars['--ink']       },
    { label: 'Accent', value: p.vars['--red']       },
    { label: 'Italic', value: p.vars['--wine']      },
  ];
  return (
    <div style={{
      width: '100%', height: '100%',
      background: p.vars['--page'],
      color: p.vars['--ink'],
      padding: '28px 28px 22px',
      boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
    }}>
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: p.vars['--ink-dim'],
        }}>{p.name}</div>
        <div style={{
          marginTop: 14,
          fontFamily: 'Playfair Display, serif',
          fontSize: 38, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 0.95,
          color: p.vars['--ink'],
        }}>
          Out <span style={{ fontStyle: 'italic', color: p.vars['--wine'] }}>Tonight</span>
        </div>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 11, lineHeight: 1.45, marginTop: 10,
          color: p.vars['--ink-dim'], maxWidth: '85%',
        }}>{p.blurb}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 6 }}>
        {chips.map(c => (
          <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
            <div style={{
              height: 44, borderRadius: 6, background: c.value,
              border: '1px solid rgba(255,255,255,0.08)',
            }}/>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: p.vars['--ink-dim'],
            }}>{c.label}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 8.5, color: p.vars['--ink-soft'],
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{c.value.startsWith('#') ? c.value.toUpperCase() : c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PALETTES, PaletteScope, PaletteChip, PaletteSwatch });
