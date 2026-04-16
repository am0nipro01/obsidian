/**
 * Smooth scroll to a section by ID,
 * accounting for the fixed navbar's real height.
 * Uses offsetTop (not getBoundingClientRect) to avoid
 * being affected by CSS reveal/transform animations.
 */
export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (!el) return

  const navEl = document.querySelector('nav')
  const navHeight = navEl ? navEl.offsetHeight : 0

  // Walk up offsetParent chain to get true document offset
  let offsetTop = 0
  let current = el
  while (current) {
    offsetTop += current.offsetTop
    current = current.offsetParent
  }

  window.scrollTo({ top: offsetTop - navHeight, behavior: 'smooth' })
}
