import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const DEFAULT_PREFERENCES = {
  dietary:         [],          // multi: 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'No shellfish', 'Nut-free'
  travel_radius:   'citywide',  // 'walkable' | 'nearby' | 'citywide' | 'anywhere'
  transportation:  'any',       // 'any' | 'walking' | 'transit' | 'driving'
  accessibility:   [],          // multi: 'Wheelchair accessible', 'Step-free', 'Elevator required', 'Seated only'
  activity_level:  'any',       // 'any' | 'low' | 'moderate' | 'active'
  noise_preference:'any',       // 'any' | 'quiet' | 'lively'
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState(null) // null = loading
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setPreferences({
        ...DEFAULT_PREFERENCES,
        ...(user?.user_metadata?.preferences ?? {}),
      })
    })
  }, [])

  async function savePreferences(newPrefs) {
    setSaving(true)
    setPreferences(newPrefs) // optimistic update
    await supabase.auth.updateUser({ data: { preferences: newPrefs } })
    setSaving(false)
  }

  function updatePref(key, value) {
    const updated = { ...preferences, [key]: value }
    savePreferences(updated)
  }

  function toggleArrayPref(key, item) {
    const current = preferences?.[key] ?? []
    const updated = {
      ...preferences,
      [key]: current.includes(item) ? current.filter(x => x !== item) : [...current, item],
    }
    savePreferences(updated)
  }

  return { preferences, saving, updatePref, toggleArrayPref }
}
