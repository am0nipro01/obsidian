import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer/Footer'
import styles from './BookingConfirmed.module.css'

export default function BookingConfirmed() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const [reservation, setReservation] = useState(null)
  const reservationId = searchParams.get('id')

  useEffect(() => {
    if (!reservationId) return
    async function fetchReservation() {
      const { data } = await supabase
        .from('reservations')
        .select('*, vehicles(*)')
        .eq('id', reservationId)
        .single()
      if (data) setReservation(data)
    }
    fetchReservation()
  }, [reservationId])

  const locale = i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US'

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const calcDays = () => {
    if (!reservation) return 0
    const d = Math.ceil(
      (new Date(reservation.return_date) - new Date(reservation.pickup_date)) /
        (1000 * 60 * 60 * 24)
    )
    return d > 0 ? d : 0
  }

  const days = calcDays()
  const daysLabel = days === 1 ? t('bookingConfirmed.day') : t('bookingConfirmed.days')
  const refId = reservationId ? reservationId.slice(0, 8).toUpperCase() : null

  return (
    <div className={styles.page}>
      <div className={styles.content}>

        {/* Icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.title}>{t('bookingConfirmed.title')}</h1>
        <p className={styles.subtitle}>{t('bookingConfirmed.subtitle')}</p>

        {/* Reservation recap */}
        {reservation && reservation.vehicles && (
          <div className={styles.recapCard}>
            <div className={styles.recapImage}>
              <img
                src={reservation.vehicles.image_url}
                alt={reservation.vehicles.name}
                className={styles.carImage}
              />
              {refId && (
                <span className={styles.ref}>{t('bookingConfirmed.ref')} {refId}</span>
              )}
            </div>
            <div className={styles.recapBody}>
              <div className={styles.recapHeader}>
                <h2 className={styles.carName}>{reservation.vehicles.name}</h2>
                <span className={styles.carCategory}>{reservation.vehicles.category}</span>
              </div>
              <div className={styles.recapGrid}>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{t('bookingConfirmed.pickup')}</span>
                  <span className={styles.recapValue}>{formatDate(reservation.pickup_date)}</span>
                </div>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{t('bookingConfirmed.return')}</span>
                  <span className={styles.recapValue}>{formatDate(reservation.return_date)}</span>
                </div>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{t('bookingConfirmed.location')}</span>
                  <span className={styles.recapValue}>{reservation.location}</span>
                </div>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{t('bookingConfirmed.total')}</span>
                  <span className={`${styles.recapValue} ${styles.recapTotal}`}>
                    {reservation.total_price}€
                    {days > 0 && <span className={styles.recapDays}> · {days} {daysLabel}</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/dashboard" className={styles.btnPrimary}>
            {t('bookingConfirmed.viewReservations')}
          </Link>
          <Link to="/#fleet" className={styles.btnGhost}>
            {t('bookingConfirmed.backToFleet')}
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  )
}
