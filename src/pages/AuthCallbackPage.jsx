import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session ? '/input' : '/', { replace: true })
    })
  }, [navigate])

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0c1538',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: '"DM Mono", monospace',
        textTransform: 'uppercase',
        fontSize: 10,
        letterSpacing: '0.32em',
        color: 'rgba(239,229,210,0.55)',
      }}>Signing you in…</span>
    </div>
  )
}
