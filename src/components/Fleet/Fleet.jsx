import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fleet } from '../../data/fleet'
import VehicleCard from './VehicleCard'
import FeaturedCard from './FeaturedCard'
import styles from './Fleet.module.css'

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Sport', 'Prestige']

export default function Fleet() {
  const { t } = useTranslation()
  const [active, setActive] = useState('All')

  const featuredVehicle = fleet.find(v => v.featured)
  const companionVehicle = fleet.find(v => v.id === 8)
  const regularVehicles = fleet.filter(v => !v.featured && v.id !== 8)

  const showFeatured = active === 'All'

  const filteredRegular = active === 'All'
    ? regularVehicles
    : fleet.filter(v => v.category === active)

  return (
    <section id="fleet" className={`${styles.section} reveal`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className="section-title">{t('fleet.title')}</h2>
            <p className="section-subtitle">{t('fleet.subtitle')}</p>
          </div>
          <div className={styles.filters}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.chip} ${active === cat ? styles.chipActive : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat === 'All' ? t('fleet.filterAll') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured row — only visible when "All" filter is active */}
        {showFeatured && featuredVehicle && (
          <div className={styles.featuredRow}>
            <FeaturedCard vehicle={featuredVehicle} />
            {companionVehicle && (
              <div className={styles.featuredCompanion}>
                <VehicleCard vehicle={companionVehicle} />
              </div>
            )}
          </div>
        )}

        {/* Regular grid */}
        <div className={styles.grid}>
          {filteredRegular.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  )
}
