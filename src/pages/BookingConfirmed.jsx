import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { getRoutes } from '../utils/routes'
import Footer from '../components/Footer/Footer'
import SEO from '../components/SEO/SEO'
import styles from './BookingConfirmed.module.css'

export default function BookingConfirmed() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const [reservation, setReservation] = useState(null)
  const reservationId = searchParams.get('id')
  const isFr = i18n.language.startsWith('fr')
  const routes = getRoutes(i18n.language)

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

  const locale = isFr ? 'fr-FR' : 'en-US'

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const days = reservation
    ? Math.max(0, Math.ceil(
        (new Date(reservation.return_date) - new Date(reservation.pickup_date)) /
          (1000 * 60 * 60 * 24)
      ))
    : 0

  const refId = reservationId ? reservationId.slice(0, 8).toUpperCase() : null

  return (
    <div className={styles.page}>
      <SEO lang={isFr ? 'fr' : 'en'} title={isFr ? 'Réservation confirmée' : 'Booking Confirmed'} noindex={true} />

      {/* ── Top section: icon + title + subtitle ── */}
      <div className={styles.topSection}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 className={styles.title}>
          {isFr ? 'RÉSERVATION CONFIRMÉE.' : 'BOOKING CONFIRMED.'}
        </h1>
        <p className={styles.subtitle}>
          {isFr
            ? 'Votre réservation a été sécurisée. Une clé numérique et les instructions d\'arrivée ont été envoyées à votre adresse principale.'
            : 'Your reservation has been secured. A digital key and detailed arrival instructions have been sent to your primary contact address.'}
        </p>
      </div>

      {/* ── Gray section: recap card ── */}
      {reservation && reservation.vehicles && (
        <div className={styles.cardSection}>
          <div className={styles.recapCard}>

            {/* Left: image */}
            <div className={styles.recapImage}>
              <img
                src={reservation.vehicles.image_url}
                alt={reservation.vehicles.name}
                className={styles.carImage}
              />
              {refId && (
                <span className={styles.ref}>REF: OBS-{refId}</span>
              )}
            </div>

            {/* Right: details */}
            <div className={styles.recapBody}>
              <div className={styles.recapHeader}>
                <h2 className={styles.carName}>{reservation.vehicles.name}</h2>
                <span className={styles.carCategory}>
                  {isFr ? 'Flotte Performance Prestige' : 'Luxury Performance Fleet'}
                </span>
              </div>

              <div className={styles.recapGrid}>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{isFr ? 'PRISE EN CHARGE' : 'PICKUP'}</span>
                  <span className={styles.recapValue}>{formatDate(reservation.pickup_date)}</span>
                </div>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{isFr ? 'RETOUR' : 'RETURN'}</span>
                  <span className={styles.recapValue}>{formatDate(reservation.return_date)}</span>
                </div>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{isFr ? 'LIEU' : 'LOCATION'}</span>
                  <span className={styles.recapValue}>{reservation.location}</span>
                  <span className={styles.recapSub}>{isFr ? 'Service Concierge' : 'Concierge Meet & Greet'}</span>
                </div>
                <div className={styles.recapItem}>
                  <span className={styles.recapLabel}>{isFr ? 'DURÉE TOTALE' : 'TOTAL STAY'}</span>
                  <span className={styles.recapValue}>
                    {days} {isFr ? `jour${days > 1 ? 's' : ''}` : `Day${days !== 1 ? 's' : ''}`}
                  </span>
                  <span className={styles.recapSub}>{reservation.total_price}€ {isFr ? 'total' : 'total'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className={styles.actions}>
        <a href={routes.dashboard} className={styles.btnPrimary}>
          {isFr ? 'Voir mes réservations' : 'View My Reservations'}
        </a>
        <Link to="/#fleet" className={styles.btnGhost}>
          {isFr ? 'Retour à la flotte' : 'Back to Fleet'}
        </Link>
      </div>

      <Footer />
    </div>
  )
}
