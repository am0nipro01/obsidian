import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { fleet } from '../data/fleet'
import styles from './Reservation.module.css'

export default function Reservation() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    vehicle: '',
    pickup: '',
    return: '',
    location: '',
    name: '',
    email: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = new URLSearchParams({
      'form-name': 'reservation',
      ...formData,
    })
    await fetch('/', { method: 'POST', body })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successBox}>
          <div className="gold-line" style={{ margin: '0 auto 1.5rem' }} />
          <h2 className={styles.successTitle}>{t('reservation.success')}</h2>
          <Link to="/" className={styles.backLink}>← {t('nav.fleet')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="gold-line" />
          <h1 className="section-title">{t('reservation.title')}</h1>
          <p className="section-subtitle">{t('reservation.subtitle')}</p>
        </div>

        <form
          name="reservation"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <input type="hidden" name="form-name" value="reservation" />

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('reservation.fields.vehicle')}</label>
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value="">{t('reservation.fields.vehiclePlaceholder')}</option>
                {fleet.map((v) => (
                  <option key={v.id} value={v.name}>{v.name} — {v.price}€{t('fleet.perDay')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('reservation.fields.pickup')}</label>
              <input
                type="date"
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('reservation.fields.return')}</label>
              <input
                type="date"
                name="return"
                value={formData.return}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('reservation.fields.location')}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder={t('reservation.fields.locationPlaceholder')}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('reservation.fields.name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('reservation.fields.namePlaceholder')}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('reservation.fields.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('reservation.fields.emailPlaceholder')}
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className={styles.submit}>
            {t('reservation.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
