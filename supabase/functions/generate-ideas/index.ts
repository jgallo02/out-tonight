import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function buildPrompt(params: {
  city: string
  date: string
  time: string
  group_size: number
  vibes: string[]
  budget: string
  liked_tags: string[]
  passed_tags: string[]
  exclude?: string[]
  preferences?: {
    dietary?: string[]
    travel_radius?: string
    transportation?: string
    accessibility?: string[]
    activity_level?: string
    noise_preference?: string
  }
}) {
  const { city, date, time, group_size, vibes, budget, liked_tags, passed_tags, exclude, preferences } = params
  const vibeStr = vibes.length ? vibes.join(', ') : 'open to anything'
  const likedStr = liked_tags.length ? liked_tags.join(', ') : 'none yet'
  const passedStr = passed_tags.length ? passed_tags.join(', ') : 'none'
  const excludeStr = exclude?.length ? exclude.join(', ') : null

  const prefLines: string[] = []
  if (preferences?.dietary?.length) prefLines.push(`DIETARY RESTRICTIONS: ${preferences.dietary.join(', ')} — only suggest food options that accommodate this`)
  if (preferences?.travel_radius && preferences.travel_radius !== 'citywide') {
    const radiusMap: Record<string, string> = { walkable: 'walkable only (under 1 mile)', nearby: 'nearby (under 5 miles)', anywhere: 'anywhere, distance is no concern' }
    prefLines.push(`TRAVEL RADIUS: ${radiusMap[preferences.travel_radius] ?? preferences.travel_radius}`)
  }
  if (preferences?.transportation && preferences.transportation !== 'any') prefLines.push(`TRANSPORTATION: ${preferences.transportation} — prioritize options accessible by this mode`)
  if (preferences?.accessibility?.length) prefLines.push(`ACCESSIBILITY: ${preferences.accessibility.join(', ')} — only suggest venues that meet these requirements`)
  if (preferences?.activity_level && preferences.activity_level !== 'any') {
    const actMap: Record<string, string> = { low: 'low-key & seated', moderate: 'moderate activity', active: 'active & on your feet' }
    prefLines.push(`ACTIVITY LEVEL: ${actMap[preferences.activity_level] ?? preferences.activity_level}`)
  }
  if (preferences?.noise_preference && preferences.noise_preference !== 'any') {
    const noiseMap: Record<string, string> = { quiet: 'quiet & intimate atmosphere', lively: 'lively & buzzy atmosphere' }
    prefLines.push(`ATMOSPHERE: ${noiseMap[preferences.noise_preference] ?? preferences.noise_preference}`)
  }

  return `You are a local date-night expert for ${city}. Today is ${date}, the outing is ${time}.

GROUP SIZE: ${group_size} people
VIBE: ${vibeStr}
BUDGET: ${budget}  ($ = under $30/person · $$ = $30–60 · $$$ = $60–100 · $$$$ = $100+)
THEMES TO LEAN INTO: ${likedStr}
THEMES TO AVOID: ${passedStr}${prefLines.length ? '\n' + prefLines.join('\n') : ''}${excludeStr ? `\nALREADY SHOWN — do not repeat these: ${excludeStr}` : ''}

Generate exactly 10 unique date-night ideas using your knowledge of real venues and experiences in ${city}. Be specific — use real venue names, neighborhoods, and details.

Return ONLY a valid JSON array of exactly 10 objects. No preamble. No markdown fences. Raw JSON only.

Each object must match this schema exactly:
{
  "id": "unique_string_no_spaces",
  "title": "Short punchy name, max 5 words",
  "tagline": "One-sentence hook, max 12 words",
  "category": "Food | Culture | Adventure | Nightlife | Wellness | Entertainment | Outdoors | Hidden Gem",
  "vibe_tags": ["2 to 4 lowercase tags"],
  "price_range": "$ | $$ | $$$ | $$$$",
  "estimated_cost_per_person": 45,
  "duration_estimate": "2–3 hours",
  "food_included": true,
  "description": "2–3 sentences. Specific venue details. Evocative. Not generic.",
  "why_tonight": "1 sentence on why this is perfect for this specific date and time.",
  "logistics": "Address or neighborhood. Booking notes. Best arrival time.",
  "venue_name": "Exact venue name for lookup, or null if not a fixed venue",
  "website_url": "Official website URL if known (e.g. https://lucali.com), or null",
  "image_search_query": "4–6 word atmospheric Unsplash search query"
}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Missing authorization' }, 401)

  // Validate JWT
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return json({ error: 'Unauthorized' }, 401)

  let body: {
    city: string
    date: string
    time: string
    group_size: number
    vibes: string[]
    budget: string
    liked_tags: string[]
    passed_tags: string[]
    exclude?: string[]
    preferences?: Record<string, unknown>
  }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (!body.city || !body.date || !body.time || !body.budget) {
    return json({ error: 'Missing required fields: city, date, time, budget' }, 400)
  }

  const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '' })

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8192,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    })

    const textBlock = message.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return json({ error: 'No text in Claude response' }, 500)
    }

    const raw = textBlock.text
    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']') + 1
    if (start === -1 || end === 0) return json({ error: 'No JSON array in response' }, 500)

    const ideas = JSON.parse(raw.slice(start, end))
    return json(ideas)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return json({ error: msg }, 500)
  }
})
