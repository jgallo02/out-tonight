import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('swipes')
        .select('id, idea_id, idea_data, swiped_at')
        .eq('user_id', user.id)
        .eq('direction', 'right')
        .order('swiped_at', { ascending: false })

      if (error) throw new Error(error.message)

      // Deduplicate: keep the most recent entry per idea_id
      const seen = new Set()
      const unique = []
      for (const row of (data ?? [])) {
        if (!seen.has(row.idea_id)) {
          seen.add(row.idea_id)
          unique.push(row)
        }
      }
      return unique
    },
    staleTime: 10_000,
  })
}

export function useRemoveMatch() {
  const queryClient = useQueryClient()

  return async (ideaId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Delete all right-swipe rows for this idea
    await supabase
      .from('swipes')
      .delete()
      .eq('user_id', user.id)
      .eq('idea_id', ideaId)
      .eq('direction', 'right')

    queryClient.invalidateQueries({ queryKey: ['matches'] })
  }
}
