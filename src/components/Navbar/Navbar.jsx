import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { scrollToSection } from '../../utils/scrollToSection'
import { getRoutes, getRouteKeyByPath, ROUTES } from '../../utils/routes'
import styles from './Navbar.module.css'

/* ─── Mobile menu icons ─── */
function IconCar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 11l1.5-4.5h11L19 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="11" width="20" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="7" cy="18" r="2" fill="currentColor"/><circle cx="17" cy="18" r="2" fill="currentColor"/></svg>
}
function IconCalendar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function IconDiamond() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 9l10 13L22 9 12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.8"/></svg>
}
function IconBook() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.8"/></svg>
}
function IconMail() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconSignOut() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function IconX() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function IconChevron() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces&auto=format&q=90'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, profile, signOut } = useAuth()
  const avatarSrc = profile?.avatar_url || DEFAULT_AVATAR
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const routes = getRoutes(i18n.language)
  const isFr = i18n.language.startsWith('fr')
  const isHome = location.pathname === '/'
  const isTransparent = isHome && !scrolled && !menuOpen

  // Hide navbar on post-booking pages
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

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false) }, [location])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleLang = () => {
    const newLang = isFr ? 'en' : 'fr'
    const newRoutes = getRoutes(newLang)
    const key = getRouteKeyByPath(location.pathname)
    i18n.changeLanguage(newLang)
    if (key && newRoutes[key] && key !== 'home') navigate(newRoutes[key])
  }

  const handleLogoClick = (e) => {
    if (isHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  const handleNavLink = (e, sectionId) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) scrollToSection(sectionId)
    else navigate('/', { state: { scrollTo: sectionId } })
  }

  // Avatar: initials fallback
  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <nav className={`${styles.navbar} ${isTransparent ? styles.transparent : styles.solid} ${menuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} onClick={handleLogoClick}>OBSIDIAN</Link>

          {/* Desktop links */}
          <ul className={styles.links}>
            <li><a href="/#fleet" onClick={(e) => handleNavLink(e, 'fleet')}>{t('nav.fleet')}</a></li>
            <li><a href="/#experience" onClick={(e) => handleNavLink(e, 'experience')}>{t('nav.howItWorks')}</a></li>
            <li><a href="/#testimonials" onClick={(e) => handleNavLink(e, 'testimonials')}>{t('nav.testimonials')}</a></li>
            <li><a href="/#newsletter" onClick={(e) => handleNavLink(e, 'newsletter')}>{t('nav.newsletter')}</a></li>
            <li><Link to={routes.ourStory}>{t('nav.ourStory')}</Link></li>
            {user && profile?.role === 'admin' && (
              <li><Link to={routes.admin} className={styles.adminLink}>Admin</Link></li>
            )}
          </ul>

          {/* Right: lang + avatar/login + hamburger */}
          <div className={styles.right}>
            <button className={styles.langBtn} onClick={toggleLang} aria-label="Switch language">
              {isFr ? 'EN' : 'FR'}
            </button>

            {user ? (
              /* Avatar dropdown */
              <div className={styles.avatarWrap} ref={dropdownRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setDropdownOpen(p => !p)}
                  aria-label="Profile menu"
                >
                  {avatarSrc
                    ? <img src={avatarSrc} alt="avatar" className={styles.avatarImg} />
                    : <span className={styles.avatarInitials}>{initials}</span>
                  }
                  <IconChevron />
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownUser}>
                      <span className={styles.dropdownName}>{profile?.full_name || user.email}</span>
                      <span className={profile?.role === 'admin' ? styles.dropdownRoleAdmin : styles.dropdownRole}>
                        {profile?.role === 'admin'
                          ? (isFr ? 'ADMINISTRATEUR' : 'ADMINISTRATOR')
                          : 'BLACK CARD MEMBER'
                        }
                      </span>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to={routes.profile} className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      {t('nav.profile')}
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button
                      className={`${styles.dropdownItem} ${styles.dropdownSignOut}`}
                      onClick={() => { signOut(); setDropdownOpen(false) }}
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to={routes.login} className={styles.authBtn}>{t('nav.login')}</Link>
            )}

            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Full-screen mobile overlay ── */}
      {menuOpen && (
        <div className={styles.mobileOverlay}>
          {/* Header */}
          <div className={styles.mobileOverlayHeader}>
            <Link to="/" className={styles.mobileLogo} onClick={() => setMenuOpen(false)}>OBSIDIAN</Link>
            <button className={styles.mobileClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <IconX />
            </button>
          </div>

          {/* User card image area (shown when logged in) */}
          {user && (
            <div className={styles.mobileUserCard}>
              <img src={avatarSrc} alt={profile?.full_name || 'User'} className={styles.mobileUserCardImg} />
            </div>
          )}

          {/* Nav items */}
          <nav className={styles.mobileNav}>
            <a href="/#fleet" className={styles.mobileNavItem} onClick={(e) => handleNavLink(e, 'fleet')}>
              <span className={`${styles.mobileNavIcon} ${location.pathname === '/' ? styles.mobileNavIconActive : ''}`}><IconCar /></span>
              <span className={`${styles.mobileNavLabel} ${location.pathname === '/' ? styles.mobileNavLabelActive : ''}`}>{t('nav.fleet')}</span>
            </a>
            <a href={routes.booking} className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>
              <span className={styles.mobileNavIcon}><IconCalendar /></span>
              <span className={styles.mobileNavLabel}>{isFr ? 'Réservation' : 'Reservations'}</span>
            </a>
            <a href="/#experience" className={styles.mobileNavItem} onClick={(e) => handleNavLink(e, 'experience')}>
              <span className={styles.mobileNavIcon}><IconDiamond /></span>
              <span className={styles.mobileNavLabel}>{t('nav.howItWorks')}</span>
            </a>
            <a href="/#testimonials" className={styles.mobileNavItem} onClick={(e) => handleNavLink(e, 'testimonials')}>
              <span className={styles.mobileNavIcon}><IconDiamond /></span>
              <span className={styles.mobileNavLabel}>{t('nav.testimonials')}</span>
            </a>
            <a href="/#newsletter" className={styles.mobileNavItem} onClick={(e) => handleNavLink(e, 'newsletter')}>
              <span className={styles.mobileNavIcon}><IconMail /></span>
              <span className={styles.mobileNavLabel}>{t('nav.newsletter')}</span>
            </a>
            <Link to={routes.ourStory} className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>
              <span className={styles.mobileNavIcon}><IconBook /></span>
              <span className={styles.mobileNavLabel}>{t('nav.ourStory')}</span>
            </Link>
          </nav>

          {/* Bottom: user info + sign out */}
          {user && (
            <div className={styles.mobileBottom}>
              <div className={styles.mobileBottomUser}>
                <img src={avatarSrc} alt="" className={styles.mobileBottomAvatar} />
                <div>
                  <p className={styles.mobileBottomName}>{profile?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                  <p className={styles.mobileBottomRole}>
                    {profile?.role === 'admin'
                      ? (isFr ? 'ADMINISTRATEUR' : 'ADMINISTRATOR')
                      : 'BLACK CARD MEMBER'
                    }
                  </p>
                </div>
              </div>
              <button
                className={styles.mobileBottomSignOut}
                onClick={() => { signOut(); setMenuOpen(false) }}
              >
                <IconSignOut />
                <span>{isFr ? 'Se Déconnecter' : 'Sign Out'}</span>
              </button>
            </div>
          )}
          {!user && (
            <div className={styles.mobileBottom}>
              <Link to={routes.login} className={styles.mobileLoginBtn} onClick={() => setMenuOpen(false)}>
                {t('nav.login')}
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
