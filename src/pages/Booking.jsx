import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer/Footer'
import AvailabilityCalendar from '../components/AvailabilityCalendar/AvailabilityCalendar'
import styles from './Booking.module.css'

// ─── Constants ─────────────────────────────────────────────────────────────────

const DELIVERY_FEE = 45
const TAX_RATE = 0.095

const PROTECTION_PLANS = [
  {
    id: 'none',
    nameFr: 'Sans protection',
    nameEn: 'No Protection',
    price: 0,
    descFr: 'Vous êtes entièrement responsable de tout dommage.',
    descEn: 'You are fully responsible for any damage.',
  },
  {
    id: 'standard',
    nameFr: 'Protection Standard',
    nameEn: 'Standard Protection',
    price: 15,
    descFr: "Couvre les dommages accidentels jusqu'à 5 000€.",
    descEn: 'Covers accidental damage up to €5,000.',
  },
  {
    id: 'premium',
    nameFr: 'Protection Premium',
    nameEn: 'Premium Protection',
    price: 30,
    descFr: 'Couverture complète, franchise zéro.',
    descEn: 'Full coverage, zero deductible.',
  },
]

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconDoorstep() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#1d4ed8" />
    </svg>
  )
}

function IconHub() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="18" height="11" rx="1" fill="#6b7280" />
      <path d="M1 10.5L12 3l11 7.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="13" width="3" height="3" rx="0.5" fill="white" />
      <rect x="14" y="13" width="3" height="3" rx="0.5" fill="white" />
      <rect x="10" y="17" width="4" height="4" rx="0.5" fill="white" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#9ca3af" />
    </svg>
  )
}

function IconReturn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 7H9.5A5.5 5.5 0 0 0 4 12.5v0A5.5 5.5 0 0 0 9.5 18H13" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 4l-3 3 3 3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#2563eb" strokeWidth="2" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="#2563eb" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.35C17.25 23.15 21 18.25 21 13V7L12 2z" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
      <polyline points="9 12 11 14 15 10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconTruck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="1" y="3" width="15" height="13" rx="1" stroke="#2563eb" strokeWidth="2" />
      <path d="M16 8h4l3 4v5h-7V8z" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="#2563eb" strokeWidth="2" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="#2563eb" strokeWidth="2" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6b7280" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="12" y2="16" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Location Autocomplete ──────────────────────────────────────────────────────

function LocationAutocomplete({ value, onChange, placeholder, iconComponent }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const debounce = useRef(null)

  const handleInput = (e) => {
    const q = e.target.value
    onChange(q)
    if (debounce.current) clearTimeout(debounce.current)
    if (q.length < 2) { setSuggestions([]); setOpen(false); return }
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&countrycodes=fr,gb&addressdetails=1`,
          { headers: { 'Accept-Language': 'fr,en' } }
        )
        const data = await res.json()
        const seen = new Set()
        const results = []
        for (const item of data) {
          const city = item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || item.name
          const country = item.address?.country
          if (!city) continue
          const label = `${city}, ${country}`
          if (!seen.has(label)) { seen.add(label); results.push(label) }
        }
        setSuggestions(results)
        setOpen(results.length > 0)
      } catch {}
    }, 300)
  }

  const pick = (label) => { onChange(label); setSuggestions([]); setOpen(false) }

  return (
    <div className={styles.autocomplete}>
      <div className={styles.inputIcon}>
        {iconComponent}
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className={styles.iconInput}
          autoComplete="off"
        />
      </div>
      {open && (
        <ul className={styles.suggestions}>
          {suggestions.map((s, i) => (
            <li key={i} className={styles.suggestionItem} onMouseDown={() => pick(s)}>
              <span className={styles.suggestionPin}><IconPin /></span>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Date Input (click anywhere opens picker) ───────────────────────────────────

function DateInput({ value, onChange, min, className }) {
  const ref = useRef(null)
  const open = () => ref.current?.showPicker?.()
  return (
    <input
      ref={ref}
      type="date"
      value={value}
      onChange={onChange}
      min={min}
      onClick={open}
      onFocus={open}
      className={className}
    />
  )
}

// ─── Stepper ───────────────────────────────────────────────────────────────────

const SECTION_NAMES_FR = ['CHOIX DU VÉHICULE', 'PRISE EN CHARGE', 'PROTECTION', 'RÉVISION & PAIEMENT']
const SECTION_NAMES_EN = ['VEHICLE SELECTION', 'PICK-UP & DROP-OFF', 'PROTECTION', 'REVIEW & PAY']
const STEP_LABELS_FR = ['SÉLECTION', 'PLANNING', 'PROTECTION', 'RÉVISION & PAIEMENT']
const STEP_LABELS_EN = ['VEHICLE SELECTION', 'SCHEDULE', 'PROTECTION', 'REVIEW & PAY']

function Stepper({ currentStep, isFr }) {
  const labels = isFr ? STEP_LABELS_FR : STEP_LABELS_EN
  const sections = isFr ? SECTION_NAMES_FR : SECTION_NAMES_EN
  const progressPct = Math.round(((currentStep - 1) / 3) * 100)

  return (
    <div className={styles.stepper}>
      {/* Top bar — constrained to navbar width */}
      <div className={styles.stepperContent}>
        <div className={styles.stepperBar}>
          <span className={styles.stepCount}>STEP {String(currentStep).padStart(2, '0')} OF 04</span>
          <span className={styles.stepSection}>{sections[currentStep - 1]}</span>
        </div>
      </div>

      {/* Progress bar — full width */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Step circles + labels — constrained to navbar width */}
      <div className={styles.stepperContent}>
        <div className={styles.stepRow}>
          {labels.map((label, i) => {
            const done = i + 1 < currentStep
            const active = i + 1 === currentStep
            return (
              <div key={i} className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${done ? styles.stepDone : active ? styles.stepActive : ''}`}>
                  {done ? <IconCheck /> : null}
                </div>
                <span className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ''}`}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Car Summary Card (Right Panel — steps 1–3) ─────────────────────────────────

function CarSummaryCard({ vehicle, days, baseRate, deliveryFee, protectionFee, tax, total, isFr }) {
  const fmt = (n) => `${n.toFixed(2)}€`

  return (
    <div className={styles.summaryCard}>
      {vehicle ? (
        <>
          <div className={styles.summaryImageWrapper}>
            <img src={vehicle.image_url} alt={vehicle.name} className={styles.summaryImage} />
            <div className={styles.summaryBadges}>
              <span className={styles.badgeCategory}>{vehicle.category?.toUpperCase()}</span>
            </div>
          </div>
          <div className={styles.summaryBody}>
            <div className={styles.summaryInfo}>
              <h3 className={styles.summaryName}>{vehicle.name.toUpperCase()}</h3>
              <p className={styles.summarySubtitle}>{isFr ? 'TRACTION INTÉGRALE • PERFORMANCE' : 'ALL-WHEEL DRIVE • PERFORMANCE'}</p>
            </div>
            <div className={styles.pricingTable}>
              <div className={styles.pricingRow}>
                <span>{isFr ? `Tarif de base${days > 0 ? ` (${days} jour${days > 1 ? 's' : ''})` : ''}` : `Base Rate${days > 0 ? ` (${days} Day${days !== 1 ? 's' : ''})` : ''}`}</span>
                <span>{baseRate > 0 ? fmt(baseRate) : '—'}</span>
              </div>
              <div className={styles.pricingRow}>
                <span>{isFr ? 'Livraison Concierge' : 'Concierge Delivery'}</span>
                <span className={deliveryFee > 0 ? styles.priceAccent : ''}>
                  {deliveryFee > 0 ? `+${fmt(deliveryFee)}` : isFr ? 'Gratuit' : 'Free'}
                </span>
              </div>
              {protectionFee > 0 && (
                <div className={styles.pricingRow}>
                  <span>{isFr ? 'Protection' : 'Protection'}</span>
                  <span>+{fmt(protectionFee)}</span>
                </div>
              )}
              <div className={styles.pricingRow}>
                <span>{isFr ? 'Taxes & frais réglementaires' : 'Tax & Regulatory Fees'}</span>
                <span>{tax > 0 ? fmt(tax) : '—'}</span>
              </div>
            </div>
            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>{isFr ? 'MONTANT TOTAL' : 'TOTAL AMOUNT'}</span>
              <span className={styles.totalAmount}>{total > 0 ? fmt(total) : '—'}</span>
            </div>
            {total > 0 && (
              <p className={styles.refundNote}>{isFr ? "Remboursable jusqu'à 24h avant la prise en charge." : 'Fully refundable until 24 hours before pickup.'}</p>
            )}
            <div className={styles.previewRoute}>
              <div className={styles.previewMap} />
              <button className={styles.previewBtn}>{isFr ? "Aperçu de l'itinéraire" : 'Preview Route'}</button>
            </div>
            <div className={styles.assistance}>
              <span className={styles.assistanceIcon}>💬</span>
              <div>
                <p className={styles.assistanceTitle}>{isFr ? "Besoin d'aide ?" : 'Need assistance?'}</p>
                <a href="mailto:concierge@obsidian.com" className={styles.assistanceLink}>
                  {isFr ? 'Discuter avec un Concierge Obsidian' : 'Chat with an Obsidian Concierge'}
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.summaryEmpty}>
          <p>{isFr ? 'Sélectionnez un véhicule pour voir le récapitulatif.' : 'Select a vehicle to see the summary.'}</p>
        </div>
      )}
    </div>
  )
}

// ─── Summary of Charges (Right Panel — step 4 only) ────────────────────────────

function SummaryOfCharges({ selectedVehicle, pricing, bookingData, onSubmit, loading, error, isFr }) {
  const { days, baseRate, deliveryFee, protectionFee, tax, total } = pricing
  const fmt = (n) => `${n.toFixed(2)}€`
  const plan = PROTECTION_PLANS.find((p) => p.id === bookingData.protection)

  return (
    <div className={styles.chargesWrapper}>
      <div className={styles.chargesCard}>
        <h3 className={styles.chargesTitle}>{isFr ? 'Récapitulatif des frais' : 'Summary of Charges'}</h3>

        <div className={styles.chargesTable}>
          <div className={styles.chargesRow}>
            <span>
              {isFr
                ? `Tarif journalier (${selectedVehicle?.price_per_day}€ × ${days})`
                : `Daily Rate (${selectedVehicle?.price_per_day}€ × ${days})`}
            </span>
            <span>{fmt(baseRate)}</span>
          </div>
          {protectionFee > 0 && (
            <div className={styles.chargesRow}>
              <span>{isFr ? plan?.nameFr : plan?.nameEn}</span>
              <span>{fmt(protectionFee)}</span>
            </div>
          )}
          {deliveryFee > 0 && (
            <div className={styles.chargesRow}>
              <span>{isFr ? 'Livraison Concierge' : 'Concierge Delivery Fee'}</span>
              <span>{fmt(deliveryFee)}</span>
            </div>
          )}
          <div className={styles.chargesRow}>
            <span>{isFr ? 'Taxes & frais réglementaires' : 'Airport Taxes & Fees'}</span>
            <span>{fmt(tax)}</span>
          </div>
        </div>

        <div className={styles.chargesDivider} />

        <div className={styles.chargesTotal}>
          <span className={styles.chargesTotalLabel}>{isFr ? 'MONTANT TOTAL' : 'TOTAL AMOUNT'}</span>
          <div className={styles.chargesTotalRow}>
            <span className={styles.chargesTotalAmount}>{fmt(total)}</span>
            <span className={styles.chargesTotalCurrency}>EUR</span>
          </div>
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <button className={styles.proceedBtn} onClick={onSubmit} disabled={loading || total <= 0}>
          {loading ? '...' : isFr ? 'Procéder au paiement →' : 'Proceed to Payment →'}
        </button>

        <div className={styles.secureNotice}>
          <IconLock />
          <span>{isFr ? 'Paiement sécurisé via Stripe' : 'Secure payment via Stripe'}</span>
        </div>

        <p className={styles.secureDesc}>
          {isFr
            ? "Vous serez redirigé vers la page de paiement sécurisée de Stripe. Obsidian ne stocke pas vos données bancaires."
            : "You'll be redirected to Stripe's secure checkout to complete your booking. Obsidian does not store your credit card information."}
        </p>

        <div className={styles.cancellationPolicy}>
          <IconInfo />
          <p>
            <strong>{isFr ? "Politique d'annulation :" : 'Cancellation Policy:'}</strong>{' '}
            {isFr
              ? "Remboursable jusqu'à 24h avant la prise en charge. Des frais de 50€ s'appliquent dans les 24h."
              : 'Fully refundable until 24 hours before pickup. A $50 late cancellation fee applies within 24 hours.'}
          </p>
        </div>
      </div>

      <div className={styles.chargesMap}>
        {bookingData.pickupLocation ? (
          <iframe
            title="pickup-map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(bookingData.pickupLocation)}&output=embed&z=13`}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <span className={styles.chargesMapPin}>
            <IconPin />
            {isFr ? 'Lieu de prise en charge' : 'Pick-up Location'}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Step 1: Vehicle Selection ──────────────────────────────────────────────────

function IconSpecRange() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="1.8"/>
      <polyline points="12 6 12 12 16 14" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function IconSpecSpeed() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a10 10 0 0 1 7.07 17.07" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 2a10 10 0 0 0-7.07 17.07" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="12" x2="16" y2="8" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#6b7280"/>
    </svg>
  )
}
function IconSpecAccel() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" stroke="#6b7280" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}

function StepVehicle({ vehicles, bookingData, setBookingData, onNext, isFr }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const canContinue = bookingData.vehicle_id !== ''

  // Build category list from vehicle data
  const categories = ['All', ...Array.from(new Set(vehicles.map((v) => v.category).filter(Boolean)))]
  const filtered = activeCategory === 'All' ? vehicles : vehicles.filter((v) => v.category === activeCategory)

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>{isFr ? 'Sélectionnez votre véhicule.' : 'Select Your Vehicle.'}</h2>
      <p className={styles.stepSubtitle}>
        {isFr
          ? 'Choisissez parmi notre flotte de véhicules de prestige.'
          : 'Choose from our curated fleet of precision-engineered performance vehicles.'}
      </p>

      {/* Category filter chips */}
      <div className={styles.categoryFilters}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.categoryChip} ${activeCategory === cat ? styles.categoryChipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'All' ? (isFr ? 'Tous' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Vehicle grid */}
      <div className={styles.fleetGrid}>
        {filtered.map((v) => {
          const selected = bookingData.vehicle_id === v.id
          const rangeKm = v.range_km ?? (v.range ? Math.round(v.range * 1.60934) : null)
          const speedKmh = v.top_speed_kmh ?? v.top_speed_km ?? (v.top_speed ? Math.round(v.top_speed * 1.60934) : null)
          const accel = v.acceleration

          return (
            <button
              key={v.id}
              className={`${styles.fleetCard} ${selected ? styles.fleetCardSelected : ''}`}
              onClick={() => setBookingData((prev) => ({ ...prev, vehicle_id: v.id }))}
            >
              {/* Top row: category + checkmark */}
              <div className={styles.fleetCardTop}>
                {v.category && (
                  <span className={styles.fleetCardCategory}>{v.category.toUpperCase()}</span>
                )}
                {selected && (
                  <div className={styles.fleetCardCheckmark}>
                    <IconCheck />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className={styles.fleetCardName}>{v.name.toUpperCase()}</h3>

              {/* Image */}
              <div className={styles.fleetCardImageBox}>
                <img src={v.image_url} alt={v.name} />
              </div>

              {/* Bottom: specs left, price right */}
              <div className={styles.fleetCardBottom}>
                <div className={styles.fleetCardSpecs}>
                  {rangeKm && (
                    <div className={styles.fleetCardSpec}>
                      <IconSpecRange />
                      <span>{rangeKm} km</span>
                    </div>
                  )}
                  {speedKmh && (
                    <div className={styles.fleetCardSpec}>
                      <IconSpecSpeed />
                      <span>{speedKmh} km/h</span>
                    </div>
                  )}
                  {accel && (
                    <div className={styles.fleetCardSpec}>
                      <IconSpecAccel />
                      <span>0-100 en {accel}</span>
                    </div>
                  )}
                  {!rangeKm && !speedKmh && !accel && (
                    <span className={styles.fleetCardSpecEmpty}>{isFr ? 'Véhicule premium' : 'Premium vehicle'}</span>
                  )}
                </div>
                <div className={styles.fleetCardPriceBox}>
                  <span className={styles.fleetCardAmount}>{v.price_per_day}€</span>
                  <span className={styles.fleetCardUnit}>{isFr ? 'PAR JOUR' : 'PER DAY'}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button className={styles.nextBtn} onClick={onNext} disabled={!canContinue}>
        {isFr ? 'CONTINUER VERS LE PLANNING →' : 'CONTINUE TO SCHEDULE →'}
      </button>
    </div>
  )
}

// ─── Step 2: Scheduling Details ─────────────────────────────────────────────────

function StepSchedule({ bookingData, setBookingData, onNext, onBack, isFr }) {
  const today = new Date().toISOString().split('T')[0]
  const upd = (key, val) => setBookingData((prev) => ({ ...prev, [key]: val }))
  const handleDateChange = (pickup, returnD) => setBookingData((prev) => ({ ...prev, pickupDate: pickup, returnDate: returnD }))
  const canContinue =
    bookingData.pickupLocation.trim() &&
    bookingData.pickupDate &&
    bookingData.returnDate &&
    bookingData.returnDate >= bookingData.pickupDate

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>{isFr ? 'Détails du planning.' : 'Scheduling Details.'}</h2>
      <p className={styles.stepSubtitle}>
        {isFr
          ? 'Précisez vos préférences pour la livraison et le retour du véhicule. Notre service conciergerie assure une transition sans accroc.'
          : 'Please specify your preferred coordinates for vehicle delivery and return. Our concierge service ensures a seamless transition.'}
      </p>

      <div className={styles.formBox}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>{isFr ? 'LIEU DE PRISE EN CHARGE' : 'PICK-UP LOCATION'}</label>
            <LocationAutocomplete value={bookingData.pickupLocation} onChange={(val) => upd('pickupLocation', val)} placeholder={isFr ? 'Ville ou aéroport' : 'Enter City or Airport'} iconComponent={<IconPin />} />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>{isFr ? 'LIEU DE RETOUR' : 'RETURN LOCATION'}</label>
            {bookingData.sameReturn ? (
              <div className={styles.inputIcon}>
                <IconReturn />
                <span className={styles.sameReturnText}>{isFr ? 'Identique à la prise en charge' : 'Same as Pick-up'}</span>
              </div>
            ) : (
              <LocationAutocomplete value={bookingData.returnLocation} onChange={(val) => upd('returnLocation', val)} placeholder={isFr ? 'Ville ou aéroport' : 'Enter City or Airport'} iconComponent={<IconReturn />} />
            )}
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={bookingData.sameReturn} onChange={(e) => upd('sameReturn', e.target.checked)} />
              {isFr ? 'Identique à la prise en charge' : 'Same as Pick-up'}
            </label>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>{isFr ? 'DATE DE DÉPART' : 'PICK-UP DATE'}</label>
            <input
              type="text"
              readOnly
              value={bookingData.pickupDate
                ? new Date(bookingData.pickupDate + 'T00:00:00').toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : ''}
              placeholder={isFr ? 'Sélectionnez ci-dessous' : 'Select below'}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>{isFr ? 'DATE DE RETOUR' : 'RETURN DATE'}</label>
            <input
              type="text"
              readOnly
              value={bookingData.returnDate
                ? new Date(bookingData.returnDate + 'T00:00:00').toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : ''}
              placeholder={isFr ? 'Sélectionnez ci-dessous' : 'Select below'}
              className={styles.dateInput}
            />
          </div>
        </div>
        <AvailabilityCalendar
          vehicleId={bookingData.vehicle_id}
          pickupDate={bookingData.pickupDate}
          returnDate={bookingData.returnDate}
          onChange={handleDateChange}
          isFr={isFr}
        />
      </div>

      <div className={styles.deliverySection}>
        <h3 className={styles.deliveryTitle}>{isFr ? 'Livraison Concierge' : 'Concierge Delivery'}</h3>
        <label className={`${styles.deliveryOption} ${bookingData.deliveryOption === 'doorstep' ? styles.deliveryOptionActive : ''}`}>
          <div className={styles.deliveryInfo}>
            <div className={styles.deliveryIconWrapper}><IconDoorstep /></div>
            <div>
              <span className={styles.deliveryName}>{isFr ? 'Livraison à domicile' : 'Doorstep Delivery'}</span>
              <span className={styles.deliveryDesc}>{isFr ? 'Véhicule livré directement à votre adresse' : 'Vehicle brought directly to your location'}</span>
            </div>
          </div>
          <div className={styles.deliveryRight}>
            <span className={styles.deliveryPrice}>+{DELIVERY_FEE}€</span>
            <input type="radio" name="delivery" value="doorstep" checked={bookingData.deliveryOption === 'doorstep'} onChange={() => upd('deliveryOption', 'doorstep')} className={styles.radio} />
          </div>
        </label>
        <label className={`${styles.deliveryOption} ${bookingData.deliveryOption === 'hub' ? styles.deliveryOptionActive : ''}`}>
          <div className={styles.deliveryInfo}>
            <div className={`${styles.deliveryIconWrapper} ${styles.deliveryIconWrapperGray}`}><IconHub /></div>
            <div>
              <span className={styles.deliveryName}>{isFr ? 'Retrait Obsidian Hub' : 'Obsidian Hub Pickup'}</span>
              <span className={styles.deliveryDesc}>{isFr ? 'Récupérez au centre phare Obsidian' : 'Collect from our flagship center'}</span>
            </div>
          </div>
          <div className={styles.deliveryRight}>
            <span className={styles.deliveryFree}>{isFr ? 'GRATUIT' : 'FREE'}</span>
            <input type="radio" name="delivery" value="hub" checked={bookingData.deliveryOption === 'hub'} onChange={() => upd('deliveryOption', 'hub')} className={styles.radio} />
          </div>
        </label>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.nextBtn} onClick={onNext} disabled={!canContinue}>
          {isFr ? 'CONTINUER VERS LA PROTECTION →' : 'CONTINUE TO PROTECTION →'}
        </button>
        <button className={styles.backBtn} onClick={onBack}>← {isFr ? 'Retour' : 'Back'}</button>
      </div>
    </div>
  )
}

// ─── Step 3: Protection ─────────────────────────────────────────────────────────

function StepProtection({ bookingData, setBookingData, onNext, onBack, isFr }) {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>{isFr ? 'Protection du véhicule.' : 'Vehicle Protection.'}</h2>
      <p className={styles.stepSubtitle}>{isFr ? 'Choisissez le niveau de protection adapté à votre voyage.' : 'Choose the protection level that suits your journey.'}</p>
      <div className={styles.protectionList}>
        {PROTECTION_PLANS.map((plan) => (
          <label key={plan.id} className={`${styles.protectionOption} ${bookingData.protection === plan.id ? styles.protectionOptionActive : ''}`}>
            <div className={styles.planInfo}>
              <span className={styles.planName}>{isFr ? plan.nameFr : plan.nameEn}</span>
              <span className={styles.planDesc}>{isFr ? plan.descFr : plan.descEn}</span>
            </div>
            <div className={styles.deliveryRight}>
              <span className={styles.planPrice}>{plan.price === 0 ? (isFr ? 'Inclus' : 'Included') : `+${plan.price}€/${isFr ? 'jour' : 'day'}`}</span>
              <input type="radio" name="protection" value={plan.id} checked={bookingData.protection === plan.id} onChange={() => setBookingData((prev) => ({ ...prev, protection: plan.id }))} className={styles.radio} />
            </div>
          </label>
        ))}
      </div>
      <div className={styles.stepActions}>
        <button className={styles.nextBtn} onClick={onNext}>{isFr ? 'CONTINUER VERS LA RÉVISION →' : 'CONTINUE TO REVIEW →'}</button>
        <button className={styles.backBtn} onClick={onBack}>← {isFr ? 'Retour' : 'Back'}</button>
      </div>
    </div>
  )
}

// ─── Step 4: Review Reservation (Left Panel) ───────────────────────────────────

function StepReview({ bookingData, selectedVehicle, days, onBack, isFr }) {
  const plan = PROTECTION_PLANS.find((p) => p.id === bookingData.protection)

  const fmtDate = (d) => {
    if (!d) return '—'
    return new Date(d + 'T00:00:00').toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>{isFr ? 'Révision de la réservation.' : 'Review Reservation.'}</h2>

      {/* Vehicle card */}
      <div className={styles.reviewVehicleCard}>
        <div className={styles.reviewVehicleHeader}>
          <div>
            <span className={styles.reviewVehicleBadge}>{isFr ? 'VOTRE SÉLECTION' : 'YOUR SELECTION'}</span>
            <h3 className={styles.reviewVehicleName}>{selectedVehicle?.name}</h3>
            <p className={styles.reviewVehicleSubtitle}>{selectedVehicle?.category}</p>
          </div>
          <span className={styles.reviewVehicleYear}>2024 Model</span>
        </div>
        <img src={selectedVehicle?.image_url} alt={selectedVehicle?.name} className={styles.reviewVehicleImage} />
      </div>

      {/* Info cards 2×2 */}
      <div className={styles.reviewInfoGrid}>
        <div className={styles.reviewInfoCard}>
          <div className={styles.reviewInfoTop}>
            <IconCalendar />
            <span className={styles.reviewInfoLabel}>{isFr ? 'PLANNING' : 'SCHEDULE'}</span>
          </div>
          <p className={styles.reviewInfoTitle}>{fmtDate(bookingData.pickupDate)} — {fmtDate(bookingData.returnDate)}</p>
          <p className={styles.reviewInfoDesc}>{days} {isFr ? `jour${days > 1 ? 's' : ''} au total` : `Day${days !== 1 ? 's' : ''} Total Duration`}</p>
        </div>

        <div className={styles.reviewInfoCard}>
          <div className={styles.reviewInfoTop}>
            <IconPin />
            <span className={styles.reviewInfoLabel}>{isFr ? 'LIEU' : 'LOCATION'}</span>
          </div>
          <p className={styles.reviewInfoTitle}>{bookingData.pickupLocation || '—'}</p>
          <p className={styles.reviewInfoDesc}>
            {bookingData.deliveryOption === 'doorstep'
              ? isFr ? 'Livraison à domicile' : 'Concierge Meet & Greet'
              : isFr ? 'Retrait Obsidian Hub' : 'Obsidian Hub Pickup'}
          </p>
        </div>

        <div className={styles.reviewInfoCard}>
          <div className={styles.reviewInfoTop}>
            <IconShield />
            <span className={styles.reviewInfoLabel}>{isFr ? 'PLAN DE PROTECTION' : 'PROTECTION PLAN'}</span>
          </div>
          <p className={styles.reviewInfoTitle}>{isFr ? plan?.nameFr : plan?.nameEn}</p>
          <p className={styles.reviewInfoDesc}>{isFr ? plan?.descFr : plan?.descEn}</p>
        </div>

        <div className={styles.reviewInfoCard}>
          <div className={styles.reviewInfoTop}>
            <IconTruck />
            <span className={styles.reviewInfoLabel}>{isFr ? 'TYPE DE LIVRAISON' : 'DELIVERY TYPE'}</span>
          </div>
          <p className={styles.reviewInfoTitle}>
            {bookingData.deliveryOption === 'doorstep'
              ? isFr ? 'Livraison à domicile' : 'White-Glove Delivery'
              : isFr ? 'Retrait Obsidian Hub' : 'Hub Pickup'}
          </p>
          <p className={styles.reviewInfoDesc}>
            {bookingData.deliveryOption === 'doorstep'
              ? isFr ? 'Livraison directe à votre adresse' : 'Direct to Arrivals Terminal'
              : isFr ? 'Retrait au centre phare Obsidian' : 'Collect from our flagship center'}
          </p>
        </div>
      </div>

      <button className={styles.backBtn} onClick={onBack}>← {isFr ? 'Retour' : 'Back'}</button>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Booking() {
  const { user } = useAuth()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isFr = i18n.language.startsWith('fr')

  const [step, setStep] = useState(1)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [bookingData, setBookingData] = useState({
    vehicle_id: '',
    pickupLocation: '',
    sameReturn: true,
    returnLocation: '',
    pickupDate: '',
    returnDate: '',
    deliveryOption: 'hub',
    protection: 'standard',
  })

  useEffect(() => {
    async function fetchVehicles() {
      const { data } = await supabase.from('vehicles').select('*').eq('available', true).order('name')
      if (data) {
        setVehicles(data)
        const nameFromUrl = searchParams.get('vehicle')
        if (nameFromUrl) {
          const match = data.find((v) => v.name === nameFromUrl)
          if (match) {
            setBookingData((prev) => ({ ...prev, vehicle_id: match.id }))
            setStep(2)
          }
        }
      }
    }
    fetchVehicles()
  }, [])

  const selectedVehicle = vehicles.find((v) => v.id === bookingData.vehicle_id)

  const days =
    bookingData.pickupDate && bookingData.returnDate
      ? Math.max(0, Math.ceil((new Date(bookingData.returnDate) - new Date(bookingData.pickupDate)) / (1000 * 60 * 60 * 24)))
      : 0

  const baseRate = selectedVehicle && days > 0 ? days * selectedVehicle.price_per_day : 0
  const deliveryFee = bookingData.deliveryOption === 'doorstep' ? DELIVERY_FEE : 0
  const plan = PROTECTION_PLANS.find((p) => p.id === bookingData.protection)
  const protectionFee = plan && days > 0 ? plan.price * days : 0
  const subtotal = baseRate + deliveryFee + protectionFee
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax

  const handleSubmit = async () => {
    if (total <= 0) {
      setError(isFr ? 'Veuillez vérifier les dates sélectionnées.' : 'Please check your selected dates.')
      return
    }
    setLoading(true)
    setError(null)

    const location = bookingData.sameReturn
      ? bookingData.pickupLocation
      : `${bookingData.pickupLocation} → ${bookingData.returnLocation}`

    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .insert({ user_id: user.id, vehicle_id: bookingData.vehicle_id, pickup_date: bookingData.pickupDate, return_date: bookingData.returnDate, location, total_price: total, status: 'pending' })
      .select()
      .single()

    if (resError) { setError(resError.message); setLoading(false); return }

    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationId: reservation.id, vehicleName: selectedVehicle.name, totalPrice: total, lang: i18n.language }),
    })

    const { url, error: stripeError } = await response.json()
    if (stripeError) { setError(stripeError); setLoading(false); return }
    window.location.href = url
  }

  const pricing = { days, baseRate, deliveryFee, protectionFee, tax, total }

  return (
    <>
      <div className={styles.page}>
        <Stepper currentStep={step} isFr={isFr} />

        <div className={styles.layout}>
          <div className={styles.left}>
            {step === 1 && <StepVehicle vehicles={vehicles} bookingData={bookingData} setBookingData={setBookingData} onNext={() => setStep(2)} isFr={isFr} />}
            {step === 2 && <StepSchedule bookingData={bookingData} setBookingData={setBookingData} onNext={() => setStep(3)} onBack={() => setStep(1)} isFr={isFr} />}
            {step === 3 && <StepProtection bookingData={bookingData} setBookingData={setBookingData} onNext={() => setStep(4)} onBack={() => setStep(2)} isFr={isFr} />}
            {step === 4 && <StepReview bookingData={bookingData} selectedVehicle={selectedVehicle} days={days} onBack={() => setStep(3)} isFr={isFr} />}
          </div>

          <div className={styles.right}>
            {step === 4 ? (
              <SummaryOfCharges
                selectedVehicle={selectedVehicle}
                pricing={pricing}
                bookingData={bookingData}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                isFr={isFr}
              />
            ) : (
              <CarSummaryCard
                vehicle={selectedVehicle}
                days={days}
                baseRate={baseRate}
                deliveryFee={deliveryFee}
                protectionFee={protectionFee}
                tax={tax}
                total={total}
                isFr={isFr}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
