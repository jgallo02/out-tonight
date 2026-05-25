import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useSwipeHistory() {
  return useQuery({
    queryKey: ['swipe-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { liked_tags: [], passed_tags: [] }

      const [{ data: right }, { data: left }] = await Promise.all([
        supabase
          .from('swipes')
          .select('idea_data')
          .eq('user_id', user.id)
          .eq('direction', 'right')
          .order('swiped_at', { ascending: false })
          .limit(20),
        supabase
          .from('swipes')
          .select('idea_data')
          .eq('user_id', user.id)
          .eq('direction', 'left')
          .order('swiped_at', { ascending: false })
          .limit(20),
      ])

      const dedup = (arr) => [...new Set(arr)]

      const liked_tags = dedup((right ?? []).flatMap((s) => s.idea_data?.vibe_tags ?? []))
      const passed_tags = dedup((left ?? []).flatMap((s) => s.idea_data?.vibe_tags ?? []))

      return { liked_tags, passed_tags }
    },
    staleTime: 30_000,
  })
}
