import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le menu à chaque changement de page
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr')
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>OBSIDIAN</Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          <li><a href="/#fleet">{t('nav.fleet')}</a></li>
          <li><a href="/#how-it-works">{t('nav.howItWorks')}</a></li>
          <li>
            <Link to="/reservation" className={styles.ctaLink}>
              {t('nav.reservation')}
            </Link>
          </li>
        </ul>

        <div className={styles.right}>
          <button className={styles.langBtn} onClick={toggleLang} aria-label="Switch language">
            {i18n.language.startsWith('fr') ? 'EN' : 'FR'}
          </button>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li><a href="/#fleet" onClick={() => setMenuOpen(false)}>{t('nav.fleet')}</a></li>
          <li><a href="/#how-it-works" onClick={() => setMenuOpen(false)}>{t('nav.howItWorks')}</a></li>
          <li>
            <Link to="/reservation" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
              {t('nav.reservation')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
