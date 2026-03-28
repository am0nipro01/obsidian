import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getRoutes } from '../utils/routes'
import Footer from '../components/Footer/Footer'
import styles from './Dashboard.module.css'


export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const { user, profile } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const routes = getRoutes(i18n.language)
  const paymentSuccess = new URLSearchParams(location.search).get('payment') === 'success'


  useEffect(() => {
    async function fetchReservations() {
      const { data, error } = await supabase
        .from('reservations')
        .select(`*, vehicles (name, category, image_url, price_per_day)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) setReservations(data)
      setLoading(false)
    }

    if (user) fetchReservations()
  }, [user])

  const statusClass = (status) => {
    if (status === 'paid') return styles.paid
    if (status === 'cancelled') return styles.cancelled
    return styles.pending
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
        {paymentSuccess && (
            <div className={styles.successBanner}>
                {t('dashboard.paymentSuccess')}
            </div>
        )}

          <div className="gold-line" />
          <h1 className={styles.title}>
            {t('dashboard.welcome')} {profile?.full_name?.split(' ')[0] || '—'}
          </h1>
          <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
          <Link to={routes.booking} className={styles.newBtn}>
            + {t('dashboard.newReservation')}
          </Link>
        </div>

        {/* Reservations */}
        <section>
          <h2 className={styles.sectionTitle}>{t('dashboard.reservations')}</h2>

          {loading ? (
            <p className={styles.empty}>...</p>
          ) : reservations.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{t('dashboard.empty')}</p>
              <Link to={routes.booking} className={styles.emptyCta}>
                {t('dashboard.emptyCta')}
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              {reservations.map((r) => (
                <article key={r.id} className={styles.card}>
                  <div className={styles.cardImage}>
                    <img src={r.vehicles?.image_url} alt={r.vehicles?.name} />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <div>
                        <span className={styles.category}>{r.vehicles?.category}</span>
                        <h3 className={styles.vehicleName}>{r.vehicles?.name}</h3>
                      </div>
                      <span className={`${styles.status} ${statusClass(r.status)}`}>
                        {t(`dashboard.status.${r.status}`)}
                      </span>
                    </div>
                    <div className={styles.cardDetails}>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>{t('dashboard.pickup')}</span>
                        <span>{formatDate(r.pickup_date)}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>{t('dashboard.return')}</span>
                        <span>{formatDate(r.return_date)}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>{t('dashboard.location')}</span>
                        <span>{r.location}</span>
                      </div>
                      {r.total_price && (
                        <div className={styles.detail}>
                          <span className={styles.detailLabel}>{t('dashboard.total')}</span>
                          <span className={styles.totalPrice}>{r.total_price}€</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  )
}
