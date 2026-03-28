import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Footer from '../components/Footer/Footer'
import styles from './NotFound.module.css'

export default function NotFound() {
  const { i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>
          {isFr ? 'Page introuvable.' : 'Page not found.'}
        </h1>
        <p className={styles.subtitle}>
          {isFr
            ? 'La page que vous recherchez n\'existe pas ou a été déplacée.'
            : 'The page you\'re looking for doesn\'t exist or has been moved.'}
        </p>
        <Link to="/" className={styles.btn}>
          {isFr ? 'Retour à l\'accueil' : 'Back to home'}
        </Link>
      </div>
      <Footer />
    </div>
  )
}
