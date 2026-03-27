import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer/Footer'
import StatusDropdown from '../components/StatusDropdown/StatusDropdown'
import styles from './Admin.module.css'

const EMPTY_FORM = { name: '', category: 'Sedan', price_per_day: '', image_url: '', available: true }
const CATEGORIES = ['Sedan', 'SUV', 'Sport', 'Prestige']
const STATUSES = ['pending', 'paid', 'cancelled']

export default function Admin() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('vehicles')
  const [vehicles, setVehicles] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: v }, { data: r }] = await Promise.all([
      supabase.from('vehicles').select('*').order('created_at'),
      supabase.from('reservations').select(`
        *, vehicles (name, category), profiles (full_name, email)
      `).order('created_at', { ascending: false }),
    ])
    setVehicles(v || [])
    setReservations(r || [])
    setLoading(false)
  }

  // --- Stats ---
  const stats = {
    totalVehicles: vehicles.length,
    totalReservations: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    paid: reservations.filter(r => r.status === 'paid').length,
  }

  // --- Vehicles CRUD ---
  function openAdd() { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }
  function openEdit(v) { setForm({ name: v.name, category: v.category, price_per_day: v.price_per_day, image_url: v.image_url, available: v.available }); setEditingId(v.id); setShowForm(true) }
  function cancelForm() { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM) }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form, price_per_day: parseInt(form.price_per_day) }
    if (editingId) {
      await supabase.from('vehicles').update(payload).eq('id', editingId)
    } else {
      await supabase.from('vehicles').insert(payload)
    }
    cancelForm()
    fetchAll()
  }

  async function handleDelete(id) {
    if (!window.confirm(t('admin.vehicles.confirmDelete'))) return
    await supabase.from('vehicles').delete().eq('id', id)
    fetchAll()
  }

  async function handleToggleAvailable(id, current) {
    await supabase.from('vehicles').update({ available: !current }).eq('id', id)
    fetchAll()
  }

  // --- Reservations ---
  async function handleStatusChange(id, status) {
    await supabase.from('reservations').update({ status }).eq('id', id)
    fetchAll()
  }

  async function handleDeleteReservation(id) {
    if (!window.confirm('Supprimer cette réservation ?')) return
    // Optimistic update: remove immediately from UI
    setReservations(prev => prev.filter(r => r.id !== id))
    const { error } = await supabase.from('reservations').delete().eq('id', id)
    if (error) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression. Vérifiez les permissions Supabase.')
      fetchAll() // revert on error
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div className="gold-line" />
          <h1 className={styles.title}>{t('admin.title')}</h1>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {[
            { label: t('admin.stats.totalVehicles'), value: stats.totalVehicles },
            { label: t('admin.stats.totalReservations'), value: stats.totalReservations },
            { label: t('admin.stats.pending'), value: stats.pending, gold: true },
            { label: t('admin.stats.paid'), value: stats.paid, green: true },
          ].map((s, i) => (
            <div key={i} className={styles.statCard}>
              <span className={`${styles.statValue} ${s.gold ? styles.gold : ''} ${s.green ? styles.green : ''}`}>
                {s.value}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'vehicles' ? styles.activeTab : ''}`} onClick={() => setTab('vehicles')}>
            {t('admin.tabs.vehicles')}
          </button>
          <button className={`${styles.tab} ${tab === 'reservations' ? styles.activeTab : ''}`} onClick={() => setTab('reservations')}>
            {t('admin.tabs.reservations')}
          </button>
        </div>

        {loading ? <p className={styles.loading}>...</p> : (
          <>
            {/* VEHICLES TAB */}
            {tab === 'vehicles' && (
              <div>
                <div className={styles.tabHeader}>
                  <button className={styles.addBtn} onClick={openAdd}>+ {t('admin.vehicles.add')}</button>
                </div>

                {/* Form */}
                {showForm && (
                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                      <div className={styles.field}>
                        <label>{t('admin.vehicles.name')}</label>
                        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                      </div>
                      <div className={styles.field}>
                        <label>{t('admin.vehicles.category')}</label>
                        <div className="select-wrapper">
                          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label>{t('admin.vehicles.price')}</label>
                        <input type="number" value={form.price_per_day} onChange={e => setForm({...form, price_per_day: e.target.value})} required />
                      </div>
                      <div className={styles.field}>
                        <label>{t('admin.vehicles.imageUrl')}</label>
                        <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <label className={styles.checkLabel}>
                        <input type="checkbox" checked={form.available} onChange={e => setForm({...form, available: e.target.checked})} />
                        {t('admin.vehicles.available')}
                      </label>
                      <div className={styles.formBtns}>
                        <button type="button" className={styles.cancelBtn} onClick={cancelForm}>{t('admin.vehicles.cancel')}</button>
                        <button type="submit" className={styles.saveBtn}>{t('admin.vehicles.save')}</button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Vehicles list */}
                <div className={styles.vehicleList}>
                  {vehicles.map(v => (
                    <div key={v.id} className={`${styles.vehicleRow} ${!v.available ? styles.unavailable : ''}`}>
                      <img src={v.image_url} alt={v.name} className={styles.vehicleThumb} />
                      <div className={styles.vehicleInfo}>
                        <span className={styles.vehicleCategory}>{v.category}</span>
                        <span className={styles.vehicleName}>{v.name}</span>
                      </div>
                      <span className={styles.vehiclePrice}>{v.price_per_day}€ / j</span>
                      <div className={styles.vehicleActions}>
                        <button
                          className={`${styles.toggleBtn} ${v.available ? styles.toggleOn : styles.toggleOff}`}
                          onClick={() => handleToggleAvailable(v.id, v.available)}
                        >
                          {v.available ? t('admin.vehicles.available') : t('admin.vehicles.unavailable')}
                        </button>
                        <button className={styles.editBtn} onClick={() => openEdit(v)}>{t('admin.vehicles.edit')}</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(v.id)}>{t('admin.vehicles.delete')}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESERVATIONS TAB */}
            {tab === 'reservations' && (
              <div className={styles.resList}>
                {reservations.length === 0 ? (
                  <p className={styles.loading}>Aucune réservation.</p>
                ) : reservations.map(r => (
                  <div key={r.id} className={styles.resRow}>
                    <div className={styles.resInfo}>
                      <span className={styles.resVehicle}>{r.vehicles?.name}</span>
                      <span className={styles.resClient}>{r.profiles?.full_name} — {r.profiles?.email}</span>
                      <span className={styles.resDates}>{formatDate(r.pickup_date)} → {formatDate(r.return_date)}</span>
                      <span className={styles.resLocation}>{r.location}</span>
                    </div>
                    <div className={styles.resRight}>
                      {r.total_price && <span className={styles.resTotal}>{r.total_price}€</span>}
                      <StatusDropdown
                        value={r.status}
                        options={STATUSES.map(s => ({ value: s, label: t(`dashboard.status.${s}`) }))}
                        onChange={(status) => handleStatusChange(r.id, status)}
                      />
                      <button
                        className={styles.deleteResBtn}
                        onClick={() => handleDeleteReservation(r.id)}
                        aria-label="Supprimer la réservation"
                        title="Supprimer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
