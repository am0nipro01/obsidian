import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { scrollToSection } from '../../utils/scrollToSection'
import { getRoutes, getRouteKeyByPath, ROUTES } from '../../utils/routes'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, profile, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const routes = getRoutes(i18n.language)
  const isHome = location.pathname === '/'
  const isTransparent = isHome && !scrolled && !menuOpen

  // Hide navbar on post-booking pages (both language variants)
  const hiddenPaths = [
    ROUTES.en.bookingConfirmed, ROUTES.fr.bookingConfirmed,
    ROUTES.en.paymentCancelled, ROUTES.fr.paymentCancelled,
  ]
  if (hiddenPaths.includes(location.pathname)) return null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const toggleLang = () => {
    const newLang = i18n.language.startsWith('fr') ? 'en' : 'fr'
    const newRoutes = getRoutes(newLang)

    // Find which route key matches the current path and navigate to its translation
    const key = getRouteKeyByPath(location.pathname)

    i18n.changeLanguage(newLang)

    if (key && newRoutes[key] && key !== 'home') {
      navigate(newRoutes[key])
    }
  }

  const handleLogoClick = (e) => {
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNavLink = (e, sectionId) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      scrollToSection(sectionId)
    } else {
      navigate('/', { state: { scrollTo: sectionId } })
    }
  }

  return (
    <nav className={`${styles.navbar} ${isTransparent ? styles.transparent : styles.solid} ${menuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={handleLogoClick}>OBSIDIAN</Link>

        {/* Desktop center links */}
        <ul className={styles.links}>
          <li>
            <a href="/#fleet" onClick={(e) => handleNavLink(e, 'fleet')}>
              {t('nav.fleet')}
            </a>
          </li>
          <li>
            <a href="/#experience" onClick={(e) => handleNavLink(e, 'experience')}>
              {t('nav.howItWorks')}
            </a>
          </li>
          <li>
            <Link to={routes.ourStory}>{t('nav.ourStory')}</Link>
          </li>
          {user && (
            <li><Link to={routes.dashboard}>{t('nav.dashboard')}</Link></li>
          )}
          {user && profile?.role === 'admin' && (
            <li><Link to={routes.admin} className={styles.adminLink}>Admin</Link></li>
          )}
        </ul>

        {/* Desktop right: lang toggle + auth */}
        <div className={styles.right}>
          <button className={styles.langBtn} onClick={toggleLang} aria-label="Switch language">
            {i18n.language.startsWith('fr') ? 'EN' : 'FR'}
          </button>
          {user ? (
            <button className={styles.authBtn} onClick={signOut}>{t('nav.signOut')}</button>
          ) : (
            <Link to={routes.login} className={styles.authBtn}>{t('nav.login')}</Link>
          )}
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li>
            <a href="/#fleet" onClick={(e) => handleNavLink(e, 'fleet')}>
              {t('nav.fleet')}
            </a>
          </li>
          <li>
            <a href="/#experience" onClick={(e) => handleNavLink(e, 'experience')}>
              {t('nav.howItWorks')}
            </a>
          </li>
          <li>
            <Link to={routes.ourStory} onClick={() => setMenuOpen(false)}>{t('nav.ourStory')}</Link>
          </li>
          {user && (
            <li><Link to={routes.dashboard} onClick={() => setMenuOpen(false)}>{t('nav.dashboard')}</Link></li>
          )}
          {user && profile?.role === 'admin' && (
            <li><Link to={routes.admin} onClick={() => setMenuOpen(false)}>Admin</Link></li>
          )}
          {user ? (
            <li>
              <button className={styles.mobileSignOut} onClick={() => { signOut(); setMenuOpen(false) }}>
                {t('nav.signOut')}
              </button>
            </li>
          ) : (
            <li><Link to={routes.login} onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link></li>
          )}
        </ul>
      </div>
    </nav>
  )
}
