import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.tagline}>{t('hero.tagline')}</span>

        <h1 className={styles.title}>
          {t('hero.titleLine1')}<br />
          <em>{t('hero.titleLine2')}</em>
        </h1>

        <p className={styles.subtitle}>{t('hero.subtitle')}</p>

        <div className={styles.actions}>
          <Link to="/reservation" className={styles.btnPrimary}>
            {t('hero.cta')}
          </Link>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLabel}>SCROLL</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  )
}
