/**
 * Three-tier image resolver
 *
 * Tier 1: Google Places Photos API  (venue_name + city → real venue photo)
 * Tier 2: Unsplash search API        (image_search_query → atmospheric photo)
 * Tier 3: null                        (caller uses its category gradient)
 *
 * Results are cached in-memory for the session so the same idea never
 * triggers duplicate network calls (e.g. on "View more" or re-render).
 */

const cache = new Map()

// ── Tier 1: Google Places (New API v1) ──────────────────────────────────────

async function fetchGooglePlacesPhoto(venueName, city) {
  const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
  if (!key || !venueName) return null

  try {
    // Step 1 — text search to find the place and get its first photo name
    const searchRes = await fetch(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'places.photos',
        },
        body: JSON.stringify({ textQuery: `${venueName} ${city}` }),
      },
    )
    if (!searchRes.ok) return null
    const searchData = await searchRes.json()
    const photoName = searchData.places?.[0]?.photos?.[0]?.name
    if (!photoName) return null

    // Step 2 — get the actual photo URI (skipHttpRedirect avoids CORS redirect chain)
    const mediaRes = await fetch(
      `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=900&skipHttpRedirect=true&key=${key}`,
    )
    if (!mediaRes.ok) return null
    const mediaData = await mediaRes.json()
    return mediaData.photoUri ?? null
  } catch {
    return null
  }
}

// ── Tier 2: Unsplash search ──────────────────────────────────────────────────

async function fetchUnsplashPhoto(query) {
  const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  if (!key || !query) return null

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } },
    )
    if (!res.ok) return null
    const data = await res.json()
    // Use the "regular" size (1080px wide) — good balance of quality vs load time
    return data.results?.[0]?.urls?.regular ?? null
  } catch {
    return null
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Resolve the best available image URL for an idea.
 * Returns a URL string or null (use gradient fallback).
 *
 * @param {string|null} venueName   - exact venue name from Claude response
 * @param {string}      city        - city from user's session params
 * @param {string}      searchQuery - image_search_query from Claude response
 */
export async function resolveImage(venueName, city, searchQuery) {
  const cacheKey = `${venueName ?? ''}|${city}|${searchQuery}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  // Mark as pending to avoid duplicate in-flight calls for the same key
  cache.set(cacheKey, null)

  let url = null

  if (venueName) {
    url = await fetchGooglePlacesPhoto(venueName, city)
  }

  if (!url) {
    url = await fetchUnsplashPhoto(searchQuery)
  }

  cache.set(cacheKey, url)
  return url
}
