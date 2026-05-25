import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function TopBarAvatar({ size = 32 }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url ?? ''
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || '?'

  return (
    <button
      onClick={() => navigate('/profile')}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: '#16204a',
        border: '1.5px solid rgba(239,229,210,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', cursor: 'pointer', padding: 0, flexShrink: 0,
      }}
    >
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: size * 0.36,
          fontWeight: 500,
          color: 'rgba(239,229,210,0.7)',
          lineHeight: 1,
          userSelect: 'none',
        }}>{initials}</span>
      )}
    </button>
  )
}
