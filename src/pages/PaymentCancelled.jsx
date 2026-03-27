import { Link } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import styles from './PaymentCancelled.module.css'

export default function PaymentCancelled() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon}>✕</div>
        <h1 className={styles.title}>Payment Cancelled.</h1>
        <p className={styles.subtitle}>Your reservation has been saved. Complete payment anytime from your dashboard.</p>
        <div className={styles.actions}>
          <Link to="/dashboard" className={styles.btnPrimary}>Complete Payment</Link>
          <Link to="/#fleet" className={styles.btnGhost}>Back to Fleet</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
