/**
 * Share or copy an idea.
 * On mobile (iOS Safari, Android Chrome) — triggers the native share sheet.
 * On desktop — copies a formatted text snippet to the clipboard.
 * Returns 'shared' | 'copied' | 'error'.
 */
export async function shareIdea(idea, city = '') {
  const learnMoreUrl = idea.website_url ||
    `https://www.google.com/search?q=${encodeURIComponent(`${idea.venue_name || idea.title} ${city}`.trim())}`

  const lines = [
    `Out Tonight 🌙`,
    ``,
    idea.title,
    idea.tagline,
    ``,
    [idea.price_range, idea.duration_estimate, idea.category].filter(Boolean).join(' · '),
    ``,
    idea.description,
  ]

  if (idea.why_tonight) {
    lines.push(``, `Why tonight: ${idea.why_tonight}`)
  }

  if (idea.logistics) {
    lines.push(``, `📍 ${idea.logistics}`)
  }

  lines.push(``, learnMoreUrl)

  const text = lines.join('\n')

  try {
    if (navigator.share) {
      await navigator.share({ title: idea.title, text })
      return 'shared'
    } else {
      await navigator.clipboard.writeText(text)
      return 'copied'
    }
  } catch {
    return 'error'
  }
}
