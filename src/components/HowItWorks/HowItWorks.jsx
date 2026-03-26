import { useTranslation } from 'react-i18next'
import styles from './HowItWorks.module.css'

export default function HowItWorks() {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true })

  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="gold-line" />
          <h2 className="section-title">{t('howItWorks.title')}</h2>
          <p className="section-subtitle">{t('howItWorks.subtitle')}</p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <span className={styles.number}>{step.number}</span>
              <div className={styles.connector} />
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
