/**
 * Smooth scroll to a section by ID,
 * accounting for the fixed navbar's real height.
 */
export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (!el) return

  const navEl = document.querySelector('nav')
  const navHeight = navEl ? navEl.offsetHeight : 0
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight

  window.scrollTo({ top, behavior: 'smooth' })
}
