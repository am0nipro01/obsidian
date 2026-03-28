import { Helmet } from 'react-helmet-async'

const SITE_URL  = 'https://obsidian-rental.com' // ← update with your real domain
const SITE_NAME = 'OBSIDIAN'
const OG_IMAGE  = `${SITE_URL}/og-image.svg`

/**
 * SEO component — drop it at the top of any page.
 *
 * Props:
 *   title       — page title (appended with " | OBSIDIAN")
 *   description — meta description (150–160 chars)
 *   canonical   — canonical path, e.g. "/our-story"
 *   lang        — "fr" | "en"
 *   ogImage     — override OG image URL
 *   noindex     — true to block indexing (protected pages)
 *   schema      — JSON-LD object(s) — array or single object
 *   altLang     — { fr: '/notre-histoire', en: '/our-story' }
 */
export default function SEO({
  title,
  description,
  canonical,
  lang = 'fr',
  ogImage = OG_IMAGE,
  noindex = false,
  schema = null,
  altLang = null,
}) {
  const fullTitle   = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : null

  return (
    <Helmet htmlAttributes={{ lang }}>
      {/* ── Core ── */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* ── hreflang (language alternates) ── */}
      {altLang?.fr && <link rel="alternate" hrefLang="fr" href={`${SITE_URL}${altLang.fr}`} />}
      {altLang?.en && <link rel="alternate" hrefLang="en" href={`${SITE_URL}${altLang.en}`} />}
      {altLang?.fr && altLang?.en && <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${altLang.fr}`} />}

      {/* ── Open Graph ── */}
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image"       content={ogImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale"      content={lang === 'fr' ? 'fr_FR' : 'en_US'} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image"       content={ogImage} />

      {/* ── JSON-LD structured data ── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  )
}
