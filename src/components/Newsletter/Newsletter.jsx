import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section id="newsletter" className={styles.section}>

      {/* ── Section header (same pattern as Testimonials) ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.tag}>{t('nav.newsletter').toUpperCase()}</span>
        <h2 className={styles.title}>{t('newsletter.title')}</h2>
        <p className={styles.subtitle}>{t('newsletter.subtitle')}</p>
      </div>

      {/* ── Dark card with form ── */}
      <div className={styles.card}>
        {submitted ? (
          <p className={styles.successMsg}>{t('newsletter.success')}</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              className={styles.input}
              placeholder={t('newsletter.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.btn}>
              {t('newsletter.button')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </button>
          </form>
        )}
        <p className={styles.privacy}>{t('newsletter.privacy')}</p>
      </div>

    </section>
  )
}
