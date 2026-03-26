import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr')
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>OBSIDIAN</Link>

        <ul className={styles.links}>
          <li><a href="/#fleet">{t('nav.fleet')}</a></li>
          <li><a href="/#how-it-works">{t('nav.howItWorks')}</a></li>
          <li>
            <Link to="/reservation" className={styles.ctaLink}>
              {t('nav.reservation')}
            </Link>
          </li>
        </ul>

        <button className={styles.langBtn} onClick={toggleLang} aria-label="Switch language">
          {i18n.language.startsWith('fr') ? 'EN' : 'FR'}
        </button>
      </div>
    </nav>
  )
}
