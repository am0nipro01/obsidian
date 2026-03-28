import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getRoutes } from '../../utils/routes'
import styles from './FeaturedCard.module.css'

export default function FeaturedCard({ vehicle }) {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const routes = getRoutes(i18n.language)

  const rangeDisplay = isFr
    ? `${Math.round(vehicle.range * 1.60934)} km`
    : `${vehicle.range} mi`
  const speedDisplay = isFr
    ? `${Math.round(vehicle.topSpeed * 1.60934)} km/h`
    : `${vehicle.topSpeed} mph`

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={vehicle.image} alt={vehicle.name} className={styles.image} />
        <span className={styles.editionBadge}>
          {isFr ? 'ÉDITION LIMITÉE' : 'LIMITED EDITION'}
        </span>
      </div>

      <div className={styles.body}>
        <div>
          <span className={styles.edition}>
            {isFr ? 'ÉDITION LIMITÉE' : 'LIMITED EDITION'}
          </span>
          <h2 className={styles.name}>{vehicle.name.toUpperCase()}</h2>
          <p className={styles.desc}>{vehicle.description}</p>
        </div>

        <div className={styles.specs}>
          <div className={styles.spec}>
            <span className={styles.specLabel}>{t('fleet.specRange')}</span>
            <span className={styles.specValue}>{rangeDisplay}</span>
          </div>
          <div className={styles.specDivider} />
          <div className={styles.spec}>
            <span className={styles.specLabel}>{t('fleet.specTopSpeed')}</span>
            <span className={styles.specValue}>{speedDisplay}</span>
          </div>
          <div className={styles.specDivider} />
          <div className={styles.spec}>
            <span className={styles.specLabel}>{t('fleet.spec060')}</span>
            <span className={styles.specValue}>{vehicle.acceleration}</span>
          </div>
        </div>

        <Link
          to={`${routes.booking}?vehicle=${encodeURIComponent(vehicle.name)}`}
          className={styles.cta}
        >
          {t('fleet.cta')} ↗
        </Link>
      </div>
    </article>
  )
}
