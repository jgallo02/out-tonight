import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import PageShell from '../components/layout/PageShell'

// ── Palette (Sapphire & Ruby) ─────────────────────────────────────────────
const C = {
  page:     '#0c1538',
  surface:  '#16204a',
  ink:      '#efe5d2',
  inkDim:   'rgba(239,229,210,0.62)',
  inkFaint: 'rgba(239,229,210,0.32)',
  inkHair:  'rgba(239,229,210,0.14)',
  red:      '#c8243a',
  wine:     '#e8a832',
}

const SKY_PATH = 'M -16 0 L -16 -10 L -14 -10 L -14 -16 L -12 -16 L -12 -20 L -11 -23 L -10 -20 L -10 -16 L -8 -16 L -8 -10 L -6 -10 L -6 0 L -4 0 L -4 -14 L -3 -14 L -3 -16 L -1 -19 L 1 -16 L 1 -14 L 2 -14 L 2 0 L 5 0 L 5 -8 L 14 -8 L 14 -11 L 16 -11 L 16 0 L 0 14 Z'

function MarkSmall() {
  return (
    <svg width="14" height="14" viewBox="-22 -26 44 44" style={{ display: 'block' }}>
      <path d={SKY_PATH} fill="none" stroke={C.wine} strokeWidth={1.5} strokeLinejoin="miter" strokeLinecap="square" vectorEffect="non-scaling-stroke"/>
    </svg>
  )
}

function useProfileStats() {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { saved: 0, passed: 0, topTags: [] }

      const [{ data: right }, { data: left }] = await Promise.all([
        supabase
          .from('swipes')
          .select('idea_data')
          .eq('user_id', user.id)
          .eq('direction', 'right'),
        supabase
          .from('swipes')
          .select('idea_id')
          .eq('user_id', user.id)
          .eq('direction', 'left'),
      ])

      // Count distinct saved ideas
      const savedIds = new Set((right ?? []).map(r => r.idea_data?.id).filter(Boolean))
      const passedIds = new Set((left ?? []).map(r => r.idea_id).filter(Boolean))

      // Tally tag frequency from saved ideas
      const tagCount = {}
      for (const row of (right ?? [])) {
        for (const tag of (row.idea_data?.vibe_tags ?? [])) {
          tagCount[tag] = (tagCount[tag] ?? 0) + 1
        }
      }
      const topTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag)

      return { saved: savedIds.size, passed: passedIds.size, topTags }
    },
    staleTime: 30_000,
  })
}

function Avatar({ name, avatarUrl, size = 72 }) {
  const [imgError, setImgError] = useState(false)
  const initials = (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: C.surface,
      border: `1.5px solid ${C.inkHair}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: size * 0.32, fontWeight: 500, color: C.inkDim,
          letterSpacing: '-0.02em',
        }}>{initials || '?'}</span>
      )}
    </div>
  )
}

function StatBlock({ value, label }) {
  return (
    <div style={{
      flex: 1, background: C.surface,
      border: `1px solid ${C.inkHair}`,
      borderRadius: 14, padding: '16px 12px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <span style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 28, fontWeight: 500, color: C.ink, lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontFamily: '"DM Mono", monospace',
        fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase',
        color: C.inkFaint,
      }}>{label}</span>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const { data: stats } = useProfileStats()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? ''
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url ?? ''
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  return (
    <PageShell>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '48px 22px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MarkSmall />
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 13, fontWeight: 500, color: C.ink }}>
              Out <span style={{ fontStyle: 'italic', color: C.wine }}>Tonight</span>
            </span>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Headline */}
        <div style={{ padding: '0 22px 24px' }}>
          <h1 style={{
            margin: 0, fontSize: 26, fontWeight: 500, lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontFamily: '"Playfair Display", Georgia, serif', color: C.ink,
          }}>
            Your <span style={{ fontStyle: 'italic', color: C.wine }}>profile</span>
          </h1>
        </div>

        {/* User card */}
        <div style={{ padding: '0 22px 20px' }}>
          <div style={{
            background: C.surface,
            border: `1px solid ${C.inkHair}`,
            borderRadius: 18, padding: '20px 18px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <Avatar name={name} avatarUrl={avatarUrl} size={60} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0, fontSize: 17, fontWeight: 500, lineHeight: 1.2,
                fontFamily: '"Playfair Display", Georgia, serif', color: C.ink,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{name || 'Anonymous'}</p>
              <p style={{
                margin: '3px 0 0', fontSize: 11, lineHeight: 1.4,
                fontFamily: '"DM Sans", sans-serif', color: C.inkDim,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{email}</p>
              {memberSince && (
                <p style={{
                  margin: '4px 0 0', fontSize: 9,
                  fontFamily: '"DM Mono", monospace',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: C.inkFaint,
                }}>Since {memberSince}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ padding: '0 22px 20px' }}>
            <span style={{
              display: 'block', marginBottom: 10,
              fontFamily: '"DM Mono", monospace', fontSize: 9,
              letterSpacing: '0.26em', textTransform: 'uppercase', color: C.inkFaint,
            }}>Your stats</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <StatBlock value={stats.saved} label="Saved" />
              <StatBlock value={stats.passed} label="Passed" />
              <StatBlock value={stats.saved + stats.passed} label="Explored" />
            </div>
          </div>
        )}

        {/* Taste profile */}
        {stats?.topTags?.length > 0 && (
          <div style={{ padding: '0 22px 24px' }}>
            <span style={{
              display: 'block', marginBottom: 10,
              fontFamily: '"DM Mono", monospace', fontSize: 9,
              letterSpacing: '0.26em', textTransform: 'uppercase', color: C.inkFaint,
            }}>Taste profile</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {stats.topTags.map(tag => (
                <span key={tag} style={{
                  padding: '7px 13px', borderRadius: 999,
                  border: `1px solid rgba(200,36,58,0.35)`,
                  background: 'rgba(200,36,58,0.08)',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 11.5, color: C.inkDim,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ margin: '0 22px 24px', height: 1, background: C.inkHair }} />

        {/* Sign out */}
        <div style={{ padding: '0 22px 40px' }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 999,
              background: 'transparent',
              border: `1px solid rgba(200,36,58,0.4)`,
              color: 'rgba(200,36,58,0.8)',
              fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>

      </div>
    </PageShell>
  )
}
