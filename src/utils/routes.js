/**
 * Centralized route configuration.
 *
 * Nav-derived routes (login, dashboard) are auto-slugified from the nav label
 * in each language's translation file. If you rename a nav item in fr.json or
 * en.json, the URL for that page updates automatically on next build.
 *
 * Non-nav routes (booking, bookingConfirmed, paymentCancelled) use the explicit
 * `routes.*` keys defined in each translation file.
 */

import fr from '../i18n/fr.json'
import en from '../i18n/en.json'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents: é→e, à→a, etc.
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric
    .trim()
    .replace(/\s+/g, '-')           // spaces → hyphens
}

function build(t) {
  return {
    home: '/',
    login: '/' + slugify(t.nav.login),
    dashboard: '/' + slugify(t.nav.dashboard),
    ourStory: '/' + slugify(t.nav.ourStory),
    booking: '/' + t.routes.booking,
    bookingConfirmed: '/' + t.routes.bookingConfirmed,
    paymentCancelled: '/' + t.routes.paymentCancelled,
    admin: '/admin',
  }
}

export const ROUTES = {
  fr: build(fr),
  en: build(en),
}

/** Returns the route map for a given language code. */
export function getRoutes(lang) {
  return ROUTES[lang?.startsWith('fr') ? 'fr' : 'en']
}

/**
 * Given a pathname, return the route key ('login', 'dashboard', …) by scanning
 * all language route tables. Used by the language toggle to navigate to the
 * translated equivalent of the current page.
 */
export function getRouteKeyByPath(path) {
  for (const lang of ['en', 'fr']) {
    const entry = Object.entries(ROUTES[lang]).find(
      ([, val]) => val === path || path.startsWith(val + '?')
    )
    if (entry) return entry[0]
  }
  return null
}
