import { useTranslation } from 'react-i18next'
import { fleet } from '../../data/fleet'
import VehicleCard from './VehicleCard'
import styles from './Fleet.module.css'

export default function Fleet() {
  const { t } = useTranslation()

  return (
    <section id="fleet" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="gold-line" />
          <h2 className="section-title">{t('fleet.title')}</h2>
          <p className="section-subtitle">{t('fleet.subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {fleet.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  )
}
