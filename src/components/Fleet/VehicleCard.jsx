import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styles from './VehicleCard.module.css'

export default function VehicleCard({ vehicle }) {
  const { t } = useTranslation()

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={vehicle.image} alt={vehicle.name} className={styles.image} />
        <span className={styles.category}>{vehicle.category}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{vehicle.name}</h3>

        <div className={styles.footer}>
          <p className={styles.price}>
            <span className={styles.amount}>{vehicle.price}€</span>
            <span className={styles.unit}>{t('fleet.perDay')}</span>
          </p>
          <Link to="/reservation" className={styles.cta}>
            {t('fleet.cta')}
          </Link>
        </div>
      </div>
    </article>
  )
}
