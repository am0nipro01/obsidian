import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getRoutes } from '../../utils/routes'
import styles from './VehicleCard.module.css'

export default function VehicleCard({ vehicle }) {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const routes = getRoutes(i18n.language)

  // Unit conversion
  const rangeDisplay = isFr
    ? `${Math.round(vehicle.range * 1.60934)} km`
    : `${vehicle.range} mi`

  const speedDisplay = isFr
    ? `${Math.round(vehicle.topSpeed * 1.60934)} km/h`
    : `${vehicle.topSpeed} mph`

  // Currency
  const priceDisplay = isFr
    ? `${vehicle.price}€`
    : `$${vehicle.priceUsd}`

  const perDay = isFr ? '/ jour' : '/ day'

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={vehicle.image} alt={vehicle.name} className={styles.image} />
        <span className={styles.category}>{vehicle.category}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{vehicle.name}</h3>

        {vehicle.range && (
          <div className={styles.specs}>
            <div className={styles.spec}>
              <span className={styles.specValue}>{rangeDisplay}</span>
              <span className={styles.specLabel}>{t('fleet.specRange')}</span>
            </div>
            <div className={styles.specDivider} />
            <div className={styles.spec}>
              <span className={styles.specValue}>{speedDisplay}</span>
              <span className={styles.specLabel}>{t('fleet.specTopSpeed')}</span>
            </div>
            <div className={styles.specDivider} />
            <div className={styles.spec}>
              <span className={styles.specValue}>{vehicle.acceleration}</span>
              <span className={styles.specLabel}>{t('fleet.spec060')}</span>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.price}>
            <span className={styles.amount}>{priceDisplay}</span>
            <span className={styles.unit}>{perDay}</span>
          </p>
          <Link
            to={`${routes.booking}?vehicle=${encodeURIComponent(vehicle.name)}`}
            className={styles.cta}
          >
            {t('fleet.cta')} →
          </Link>
        </div>
      </div>
    </article>
  )
}
