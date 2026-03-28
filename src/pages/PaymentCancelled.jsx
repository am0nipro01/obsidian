import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getRoutes } from '../utils/routes'
import Footer from '../components/Footer/Footer'
import SEO from '../components/SEO/SEO'
import styles from './PaymentCancelled.module.css'

export default function PaymentCancelled() {
  const { i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const routes = getRoutes(i18n.language)

  return (
    <div className={styles.page}>
      <SEO lang={isFr ? 'fr' : 'en'} title={isFr ? 'Paiement annulé' : 'Payment Cancelled'} noindex={true} />
      <div className={styles.content}>
        <div className={styles.icon}>✕</div>
        <h1 className={styles.title}>
          {isFr ? 'Paiement annulé.' : 'Payment Cancelled.'}
        </h1>
        <p className={styles.subtitle}>
          {isFr
            ? 'Votre réservation a été sauvegardée. Finalisez le paiement à tout moment depuis votre espace.'
            : 'Your reservation has been saved. Complete payment anytime from your space.'}
        </p>
        <div className={styles.actions}>
          <Link to={routes.dashboard} className={styles.btnPrimary}>
            {isFr ? 'Finaliser le paiement' : 'Complete Payment'}
          </Link>
          <Link to="/#fleet" className={styles.btnGhost}>
            {isFr ? 'Retour à la flotte' : 'Back to Fleet'}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
