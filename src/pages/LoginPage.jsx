import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SKY_PATH = [
  'M -16 0', 'L -16 -10', 'L -14 -10', 'L -14 -16', 'L -12 -16',
  'L -12 -20', 'L -11 -23', 'L -10 -20', 'L -10 -16', 'L -8 -16',
  'L -8 -10', 'L -6 -10', 'L -6 0', 'L -4 0', 'L -4 -14', 'L -3 -14',
  'L -3 -16', 'L -1 -19', 'L 1 -16', 'L 1 -14', 'L 2 -14', 'L 2 0',
  'L 5 0', 'L 5 -8', 'L 14 -8', 'L 14 -11', 'L 16 -11', 'L 16 0',
  'L 0 14', 'Z',
].join(' ')

function SkyHeartMark({ size = 46, color = '#e8a832' }) {
  return (
    <svg width={size} height={size} viewBox="-22 -26 44 44" style={{ display: 'block' }}>
      <path
        d={SKY_PATH}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="miter"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function CornerCrop({ pos }) {
  const base = { position: 'absolute', width: 18, height: 18, pointerEvents: 'none' }
  const c = 'rgba(239,229,210,0.28)'
  const map = {
    tl: { ...base, top: 18, left: 18, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` },
    tr: { ...base, top: 18, right: 18, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` },
    bl: { ...base, bottom: 18, left: 18, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` },
    br: { ...base, bottom: 18, right: 18, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` },
  }
  return <div style={map[pos]} />
}

async function handleGoogleSignIn() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/auth/callback' },
  })
}

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/input', { replace: true })
    })
  }, [navigate])

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0c1538',
      color: '#efe5d2',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      maxWidth: 430,
      margin: '0 auto',
    }}>
      <CornerCrop pos="tl" />
      <CornerCrop pos="tr" />
      <CornerCrop pos="bl" />
      <CornerCrop pos="br" />

      {/* Center content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        gap: 28,
      }}>
        <SkyHeartMark size={46} color="#e8a832" />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {/* Wordmark */}
          <div style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 50,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            color: '#efe5d2',
            textAlign: 'center',
          }}>
            Out{' '}
            <span style={{ fontStyle: 'italic', color: '#e8a832' }}>Tonight</span>
          </div>

          {/* Hairline rule */}
          <div style={{
            width: 160,
            height: 1,
            background: 'rgba(239,229,210,0.5)',
          }} />

          {/* Tagline */}
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            letterSpacing: '0.04em',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: 260,
            color: 'rgba(239,229,210,0.62)',
          }}>
            Tonight, make it{' '}
            <span style={{
              fontStyle: 'italic',
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#e8a832',
            }}>worth remembering.</span>
          </div>
        </div>

        {/* Editorial footnote */}
        <div style={{
          fontFamily: '"DM Mono", monospace',
          textTransform: 'uppercase',
          fontSize: 8.5,
          letterSpacing: '0.34em',
          color: 'rgba(239,229,210,0.32)',
          marginTop: 8,
        }}>
          Issue N&#xBA;&nbsp;24&nbsp;·&nbsp;Spring MMXXVI
        </div>
      </div>

      {/* Sign-in footer */}
      <div style={{
        padding: '0 28px 44px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        alignItems: 'center',
      }}>
        <button
          onClick={handleGoogleSignIn}
          style={{
            background: '#efe5d2',
            color: '#0c1538',
            borderRadius: 999,
            padding: '14px 22px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.01em',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <GoogleG size={18} />
          Continue with Google
        </button>

        <div style={{
          fontFamily: '"DM Mono", monospace',
          textTransform: 'uppercase',
          fontSize: 8,
          letterSpacing: '0.28em',
          textAlign: 'center',
          lineHeight: 1.7,
          color: 'rgba(239,229,210,0.32)',
        }}>
          By signing in you agree to our<br />Terms &amp; Privacy
        </div>
      </div>
    </div>
  )
}
