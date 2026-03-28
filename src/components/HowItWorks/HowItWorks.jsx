import { useTranslation } from 'react-i18next'
import styles from './HowItWorks.module.css'

/* ─── Feature icons (blue rounded-square app-icon style) ─── */

function IconFleet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 11l1.5-4.5h11L19 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="11" width="20" height="7" rx="2" stroke="white" strokeWidth="1.8"/>
      <circle cx="7" cy="18" r="2" fill="white"/>
      <circle cx="17" cy="18" r="2" fill="white"/>
    </svg>
  )
}

function IconConcierge() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2z" stroke="white" strokeWidth="1.8"/>
      <path d="M2 20c0-4 4.5-7 10-7s10 3 10 7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
      <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const ICONS = [IconFleet, IconConcierge, IconClock]

/* ─── Component ─── */

export default function HowItWorks() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const features = t('howItWorks.features', { returnObjects: true })

  return (
    <section id="experience" className={`${styles.section} reveal`}>
      <div className={styles.container}>
        <div className={styles.layout}>

          {/* ── Left: image + floating card ── */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1751847610182-1a7123484c41?auto=format&fit=crop&w=900&q=80"
                alt={isFr ? "Expérience Obsidian" : "Obsidian Experience"}
                className={styles.image}
              />
            </div>
          </div>

          {/* ── Right: tag + title + description + features ── */}
          <div className={styles.contentCol}>
            <span className={styles.tag}>
              {isFr ? 'L\'EXPÉRIENCE' : 'THE EXPERIENCE'}
            </span>

            <h2 className={styles.title}>
              {isFr ? t('howItWorks.titleLine1') : t('howItWorks.titleLine1')}<br />
              {t('howItWorks.titleLine2')}
            </h2>

            <p className={styles.desc}>{t('howItWorks.desc')}</p>

            <div className={styles.features}>
              {features.map((feature, i) => {
                const Icon = ICONS[i] ?? IconFleet
                return (
                  <div key={i} className={styles.feature}>
                    <div className={styles.featureIcon}>
                      <Icon />
                    </div>
                    <div className={styles.featureText}>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      <p className={styles.featureDesc}>{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
