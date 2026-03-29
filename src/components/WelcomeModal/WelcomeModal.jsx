import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './WelcomeModal.module.css'

const CONTENT = {
  fr: {
    title: 'Bienvenue sur',
    subtitle: 'Plateforme de location de véhicules premium. Voici les accès de démonstration :',
    admin: 'Administrateur',
    user: 'Utilisateur',
    password: 'Mot de passe',
    cta: 'Accéder au site →',
    skip: 'Fermer',
  },
  en: {
    title: 'Welcome to',
    subtitle: 'Premium vehicle rental platform. Here are the demo credentials:',
    admin: 'Administrator',
    user: 'User',
    password: 'Password',
    cta: 'Enter the site →',
    skip: 'Close',
  },
}

export default function WelcomeModal() {
  const { i18n } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [lang, setLang] = useState(i18n.language.startsWith('fr') ? 'fr' : 'en')

  useEffect(() => {
    if (!sessionStorage.getItem('welcome_shown')) {
      setVisible(true)
      sessionStorage.setItem('welcome_shown', '1')
    }
  }, [])

  const switchLang = (l) => {
    setLang(l)
    i18n.changeLanguage(l)
  }

  if (!visible) return null

  const t = CONTENT[lang]

  return (
    <div className={styles.overlay} onClick={() => setVisible(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Lang switcher */}
        <div className={styles.langSwitch}>
          <button
            className={`${styles.langBtn} ${lang === 'fr' ? styles.langBtnActive : ''}`}
            onClick={() => switchLang('fr')}
          >FR</button>
          <button
            className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
            onClick={() => switchLang('en')}
          >EN</button>
        </div>

        <button className={styles.closeBtn} onClick={() => setVisible(false)} aria-label="Fermer">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M13 2 2 13M2 2l11 11" stroke="#1F2937" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <img
          src="https://images.unsplash.com/photo-1628519592419-bf288f08cef5?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Voiture de sport"
          className={styles.image}
        />

        <div className={styles.content}>
          <h2 className={styles.title}>
            {t.title} <span className={styles.accent}>OBSIDIAN</span>
          </h2>
          <p className={styles.subtitle}>{t.subtitle}</p>

          <div className={styles.credentials}>
            <div className={styles.credCard}>
              <span className={styles.credRole}>{t.admin}</span>
              <span className={styles.credLine}><b>Email :</b> admin@admin.com</span>
              <span className={styles.credLine}><b>{t.password} :</b> Admin75Admin</span>
            </div>
            <div className={styles.credCard}>
              <span className={styles.credRole}>{t.user}</span>
              <span className={styles.credLine}><b>Email :</b> test@test.com</span>
              <span className={styles.credLine}><b>{t.password} :</b> Test75Test</span>
            </div>
          </div>

          <button className={styles.ctaBtn} onClick={() => setVisible(false)}>
            {t.cta}
          </button>
          <button className={styles.skipBtn} onClick={() => setVisible(false)}>
            {t.skip}
          </button>
        </div>
      </div>
    </div>
  )
}
