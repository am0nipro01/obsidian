import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getRoutes } from '../utils/routes'
import StatusDropdown from '../components/StatusDropdown/StatusDropdown'
import AdminChart from '../components/AdminChart/AdminChart'
import styles from './Admin.module.css'

const EMPTY_FORM = { name: '', category: 'Sedan', price_per_day: '', image_url: '', available: true }
const CATEGORIES = ['Sedan', 'SUV', 'Sport', 'Prestige']
const STATUSES = ['pending', 'paid', 'cancelled']

/* ── Sidebar icons ── */
function IconGrid() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>
}
function IconCar() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 11l1.5-4.5h11L19 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="11" width="20" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="7" cy="18" r="2" fill="currentColor"/><circle cx="17" cy="18" r="2" fill="currentColor"/></svg>
}
function IconCalendar() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function IconArrowLeft() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m0 0 7 7m-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconRefresh() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

/* ── Stat card icons ── */
function IconTruck() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 11l1.5-4.5h8.5L17 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><rect x="1" y="11" width="16" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><path d="M17 14h4l2 3H17v-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="5.5" cy="18" r="1.5" fill="currentColor"/><circle cx="14.5" cy="18" r="1.5" fill="currentColor"/><circle cx="20.5" cy="18" r="1.5" fill="currentColor"/></svg>
}
function IconClipboard() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M9 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="9" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function IconClock() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconCheck() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

export default function Admin() {
  const { t, i18n } = useTranslation()
  const { profile } = useAuth()
  const routes = getRoutes(i18n.language)
  const isFr = i18n.language.startsWith('fr')

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

    // ── Sync vehicle availability based on existing paid reservations ──
    // Collect all vehicle_ids that have at least one paid reservation
    const paidVehicleIds = new Set(
      (r || []).filter(res => res.status === 'paid' && res.vehicle_id).map(res => res.vehicle_id)
    )

    // Update each vehicle's availability in Supabase if it's out of sync
    const syncPromises = (v || []).map(vehicle => {
      const shouldBeUnavailable = paidVehicleIds.has(vehicle.id)
      if (shouldBeUnavailable && vehicle.available) {
        return supabase.from('vehicles').update({ available: false }).eq('id', vehicle.id)
      }
      if (!shouldBeUnavailable && !vehicle.available) {
        return supabase.from('vehicles').update({ available: true }).eq('id', vehicle.id)
      }
      return null
    }).filter(Boolean)

    if (syncPromises.length > 0) {
      await Promise.all(syncPromises)
      // Re-fetch vehicles with corrected availability
      const { data: vSynced } = await supabase.from('vehicles').select('*').order('created_at')
      setVehicles(vSynced || [])
    } else {
      setVehicles(v || [])
    }

    setReservations(r || [])
    setLoading(false)
  }

  const stats = {
    totalVehicles: vehicles.length,
    totalReservations: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    paid: reservations.filter(r => r.status === 'paid').length,
  }

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
    cancelForm(); fetchAll()
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

  // Vérifie les réservations "paid" restantes pour un véhicule et met à jour sa disponibilité
  async function syncVehicleAvailability(vehicleId) {
    if (!vehicleId) return
    const { data: paidRes } = await supabase
      .from('reservations')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'paid')
    await supabase
      .from('vehicles')
      .update({ available: !(paidRes && paidRes.length > 0) })
      .eq('id', vehicleId)
  }

  async function handleStatusChange(id, status) {
    await supabase.from('reservations').update({ status }).eq('id', id)
    const res = reservations.find(r => r.id === id)
    if (res?.vehicle_id) await syncVehicleAvailability(res.vehicle_id)
    fetchAll()
  }

  async function handleDeleteReservation(id) {
    if (!window.confirm(t('admin.reservations.confirmDelete'))) return
    const res = reservations.find(r => r.id === id)
    setReservations(prev => prev.filter(r => r.id !== id))
    const { error } = await supabase.from('reservations').delete().eq('id', id)
    if (error) {
      fetchAll()
    } else {
      if (res?.vehicle_id) await syncVehicleAvailability(res.vehicle_id)
      fetchAll()
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

  const NAV_ITEMS = [
    { id: 'vehicles',     label: t('admin.tabs.vehicles'),     icon: <IconCar /> },
    { id: 'reservations', label: t('admin.tabs.reservations'), icon: <IconCalendar /> },
  ]

  const STAT_CARDS = [
    { label: t('admin.stats.totalVehicles'),     value: stats.totalVehicles,     icon: <IconTruck />,     accent: 'default' },
    { label: t('admin.stats.totalReservations'), value: stats.totalReservations, icon: <IconClipboard />, accent: 'default' },
    { label: t('admin.stats.pending'),           value: stats.pending,           icon: <IconClock />,     accent: 'warning' },
    { label: t('admin.stats.paid'),              value: stats.paid,              icon: <IconCheck />,     accent: 'success' },
  ]

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.sidebarLogo}>OBSIDIAN</span>
          <span className={styles.sidebarBadge}>{isFr ? 'Admin' : 'Admin'}</span>
        </div>

        <nav className={styles.sidebarNav}>
          <span className={styles.sidebarSection}>{isFr ? 'Gestion' : 'Management'}</span>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`${styles.sidebarItem} ${tab === item.id ? styles.sidebarItemActive : ''}`}
              onClick={() => { setTab(item.id); setShowForm(false) }}
            >
              <span className={styles.sidebarItemIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to={routes.home || '/'} className={styles.backToSite}>
            <IconArrowLeft />
            {isFr ? 'Retour au site' : 'Back to site'}
          </Link>
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarUserAvatar}>
              {(profile?.full_name || 'A')[0].toUpperCase()}
            </div>
            <div className={styles.sidebarUserInfo}>
              <span className={styles.sidebarUserName}>{profile?.full_name || 'Admin'}</span>
              <span className={styles.sidebarUserRole}>{isFr ? 'Administrateur' : 'Administrator'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* Top bar */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>{t('admin.title')}</h1>
            <p className={styles.pageSubtitle}>
              {isFr ? 'Gérez vos véhicules et réservations.' : 'Manage your vehicles and reservations.'}
            </p>
          </div>
          <button className={styles.refreshBtn} onClick={fetchAll} title={isFr ? 'Actualiser' : 'Refresh'}>
            <IconRefresh />
            {isFr ? 'Actualiser' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {STAT_CARDS.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={`${styles.statIcon} ${styles[`statIcon_${s.accent}`]}`}>{s.icon}</span>
              </div>
              <span className={`${styles.statValue} ${styles[`statValue_${s.accent}`]}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <AdminChart isFr={isFr} />

        {/* Tab content */}
        <div className={styles.contentCard}>

          {/* Content header */}
          <div className={styles.contentHeader}>
            <div className={styles.tabs}>
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  className={`${styles.tab} ${tab === item.id ? styles.activeTab : ''}`}
                  onClick={() => { setTab(item.id); setShowForm(false) }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {tab === 'vehicles' && (
              <button className={styles.addBtn} onClick={showForm ? cancelForm : openAdd}>
                {showForm ? (isFr ? 'Annuler' : 'Cancel') : `+ ${t('admin.vehicles.add')}`}
              </button>
            )}
          </div>

          {/* Add/Edit form */}
          {showForm && tab === 'vehicles' && (
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

          {loading ? (
            <div className={styles.loadingRow}>
              <span className={styles.loadingDot} /><span className={styles.loadingDot} /><span className={styles.loadingDot} />
            </div>
          ) : (
            <>
              {/* ── VEHICLES TABLE ── */}
              {tab === 'vehicles' && (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{isFr ? 'Véhicule' : 'Vehicle'}</th>
                        <th>{isFr ? 'Catégorie' : 'Category'}</th>
                        <th>{isFr ? 'Prix / jour' : 'Price / day'}</th>
                        <th>{isFr ? 'Statut' : 'Status'}</th>
                        <th>{isFr ? 'Actions' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map(v => (
                        <tr key={v.id} className={!v.available ? styles.rowUnavailable : ''}>
                          <td>
                            <div className={styles.vehicleCell}>
                              <img src={v.image_url} alt={v.name} className={styles.vehicleThumb} />
                              <span className={styles.vehicleName}>{v.name}</span>
                            </div>
                          </td>
                          <td><span className={styles.badge}>{v.category}</span></td>
                          <td><span className={styles.price}>{v.price_per_day}€</span></td>
                          <td>
                            <button
                              className={`${styles.statusBadge} ${v.available ? styles.statusAvailable : styles.statusUnavailable}`}
                              onClick={() => handleToggleAvailable(v.id, v.available)}
                            >
                              {v.available ? t('admin.vehicles.available') : t('admin.vehicles.unavailable')}
                            </button>
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              <button className={styles.editBtn} onClick={() => openEdit(v)}>{t('admin.vehicles.edit')}</button>
                              <button className={styles.deleteBtn} onClick={() => handleDelete(v.id)}>{t('admin.vehicles.delete')}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {vehicles.length === 0 && (
                        <tr><td colSpan={5} className={styles.emptyRow}>{isFr ? 'Aucun véhicule.' : 'No vehicles.'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── RESERVATIONS TABLE ── */}
              {tab === 'reservations' && (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t('admin.reservations.client')}</th>
                        <th>{t('admin.reservations.vehicle')}</th>
                        <th>{t('admin.reservations.dates')}</th>
                        <th>{t('admin.reservations.location')}</th>
                        <th>{t('admin.reservations.total')}</th>
                        <th>{t('admin.reservations.status')}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(r => (
                        <tr key={r.id}>
                          <td>
                            <div className={styles.clientCell}>
                              <span className={styles.clientName}>{r.profiles?.full_name || '—'}</span>
                              <span className={styles.clientEmail}>{r.profiles?.email}</span>
                            </div>
                          </td>
                          <td><span className={styles.vehicleName}>{r.vehicles?.name}</span></td>
                          <td><span className={styles.dates}>{formatDate(r.pickup_date)} → {formatDate(r.return_date)}</span></td>
                          <td><span className={styles.location}>{r.location || '—'}</span></td>
                          <td><span className={styles.price}>{r.total_price ? `${r.total_price}€` : '—'}</span></td>
                          <td>
                            <StatusDropdown
                              value={r.status}
                              options={STATUSES.map(s => ({ value: s, label: t(`dashboard.status.${s}`) }))}
                              onChange={(status) => handleStatusChange(r.id, status)}
                            />
                          </td>
                          <td>
                            <button className={styles.deleteResBtn} onClick={() => handleDeleteReservation(r.id)} aria-label={isFr ? 'Supprimer' : 'Delete'}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {reservations.length === 0 && (
                        <tr><td colSpan={7} className={styles.emptyRow}>{isFr ? 'Aucune réservation.' : 'No reservations.'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Table footer */}
          <div className={styles.tableFooter}>
            <span className={styles.tableCount}>
              {tab === 'vehicles'
                ? `${vehicles.length} ${isFr ? 'véhicule(s)' : 'vehicle(s)'}`
                : `${reservations.length} ${isFr ? 'réservation(s)' : 'reservation(s)'}`
              }
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
