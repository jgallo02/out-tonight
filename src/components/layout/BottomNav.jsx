import { useLocation, useNavigate } from 'react-router-dom'

function NavCompass({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.2" stroke={color} strokeWidth="1.4"/>
      <path d="M15.5 8.5 L13 13 L8.5 15.5 L11 11 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="miter" fill="none"/>
    </svg>
  )
}

function NavHeart({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20 C 5 15.5, 3 11.5, 5 8.5 C 6.5 6.5, 9.5 6, 12 9 C 14.5 6, 17.5 6.5, 19 8.5 C 21 11.5, 19 15.5, 12 20 Z"
        stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round"
      />
    </svg>
  )
}

function NavPerson({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="3.4" stroke={color} strokeWidth="1.4"/>
      <path d="M4.5 20 C 5.5 16, 8.5 14.5, 12 14.5 C 15.5 14.5, 18.5 16, 19.5 20" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

const TABS = [
  { key: 'discover', label: 'Discover', Icon: NavCompass, path: '/input' },
  { key: 'matches',  label: 'Matches',  Icon: NavHeart,   path: '/matches' },
  { key: 'profile',  label: 'Profile',  Icon: NavPerson,  path: '/profile' },
]

function getActiveTab(pathname) {
  if (pathname.startsWith('/matches')) return 'matches'
  if (pathname.startsWith('/profile')) return 'profile'
  return 'discover'
}

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const active = getActiveTab(location.pathname)

  return (
    <div style={{
      borderTop: '1px solid rgba(239,229,210,0.14)',
      background: '#16204a',
      padding: `10px 0 env(safe-area-inset-bottom, 18px)`,
      display: 'flex',
      position: 'relative',
      zIndex: 10,
    }}>
      {TABS.map(({ key, label, Icon, path }) => {
        const isActive = key === active
        const color = isActive ? '#c8243a' : 'rgba(239,229,210,0.62)'
        return (
          <button
            key={key}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Icon size={22} color={color} />
            <span style={{
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              fontSize: 8,
              letterSpacing: '0.22em',
              color,
              lineHeight: 1,
            }}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
