import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className={`${styles.footer} reveal`}>
      <div className={styles.container}>

        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>OBSIDIAN</span>
            <p className={styles.tagline}>{t('footer.tagline')}</p>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('footer.nav')}</h4>
            <ul className={styles.colList}>
              <li><a href="/#fleet">{t('nav.fleet')}</a></li>
              <li><a href="/#how-it-works">{t('nav.howItWorks')}</a></li>
              <li><Link to="/reservation">{t('nav.reservation')}</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('footer.contact')}</h4>
            <ul className={styles.colList}>
              <li><a href={`tel:${t('footer.phone')}`}>{t('footer.phone')}</a></li>
              <li><a href={`mailto:${t('footer.email')}`}>{t('footer.email')}</a></li>
              <li>{t('footer.address')}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{t('footer.copyright')}</p>
          <a href="#" className={styles.legal}>{t('footer.legal')}</a>
        </div>

      </div>
    </footer>
  )
}
