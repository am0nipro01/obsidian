import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer/Footer'
import styles from './Reservation.module.css'

export default function Reservation() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    vehicle_id: '',
    pickup: '',
    return: '',
    location: '',
  })

  useEffect(() => {
    async function fetchVehicles() {
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('available', true)
        .order('name')
      if (data) {
        setVehicles(data)
        // Pré-sélection depuis l'URL (?vehicle=Obsidian+GT)
        const nameFromUrl = searchParams.get('vehicle')
        if (nameFromUrl) {
          const match = data.find(v => v.name === nameFromUrl)
          if (match) setFormData(f => ({ ...f, vehicle_id: match.id }))
        }
      }
    }
    fetchVehicles()
  }, [])

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id)

  const calcTotal = () => {
    if (!selectedVehicle || !formData.pickup || !formData.return) return null
    const days = Math.ceil(
      (new Date(formData.return) - new Date(formData.pickup)) / (1000 * 60 * 60 * 24)
    )
    return days > 0 ? days * selectedVehicle.price_per_day : null
  }

  const total = calcTotal()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!total || total <= 0) {
      setError('Les dates sélectionnées sont invalides.')
      return
    }
    setLoading(true)

    // 1. Sauvegarder la réservation en base
    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .insert({
        user_id: user.id,
        vehicle_id: formData.vehicle_id,
        pickup_date: formData.pickup,
        return_date: formData.return,
        location: formData.location,
        total_price: total,
        status: 'pending',
      })
      .select()
      .single()

    if (resError) {
      setError(resError.message)
      setLoading(false)
      return
    }

    // 2. Créer la session Stripe et rediriger
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservationId: reservation.id,
        vehicleName: selectedVehicle.name,
        totalPrice: total,
        lang: i18n.language,
      }),
    })

    const { url, error: stripeError } = await response.json()

    if (stripeError) {
      setError(stripeError)
      setLoading(false)
      return
    }

    window.location.href = url
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className="gold-line" />
            <h1 className="section-title">{t('reservation.title')}</h1>
            <p className="section-subtitle">{t('reservation.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{t('reservation.fields.vehicle')}</label>
                <div className="select-wrapper">
                  <select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    <option value="">{t('reservation.fields.vehiclePlaceholder')}</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.price_per_day}€{t('fleet.perDay')}
                      </option>
                    ))}
                  </select>
                </div>
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
                  onClick={(e) => e.target.showPicker?.()}
                  onFocus={(e) => e.target.showPicker?.()}
                  required
                  min={new Date().toISOString().split('T')[0]}
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
                  onClick={(e) => e.target.showPicker?.()}
                  onFocus={(e) => e.target.showPicker?.()}
                  required
                  min={formData.pickup || new Date().toISOString().split('T')[0]}
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

            {/* Récap prix */}
            {total && (
              <div className={styles.recap}>
                <span className={styles.recapLabel}>Total estimé</span>
                <span className={styles.recapPrice}>{total}€</span>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? '...' : t('reservation.submit')}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
