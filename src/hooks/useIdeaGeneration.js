import { useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useIdeaGeneration() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.functions.invoke('generate-ideas', {
        body: payload,
      })
      if (error) throw new Error(error.message)
      if (!Array.isArray(data)) throw new Error('Unexpected response format')
      return data
    },
  })
}
