import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getRoutes } from '../utils/routes'
import Footer from '../components/Footer/Footer'
import styles from './Profile.module.css'

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces&auto=format&q=90'

/* ─── Icons ─── */
function IconUser() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function IconShield() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.35C17.25 23.15 21 18.25 21 13V7L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
}
function IconSliders() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="6" r="2" fill="white" stroke="currentColor" strokeWidth="1.8"/><circle cx="15" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.8"/><circle cx="9" cy="18" r="2" fill="white" stroke="currentColor" strokeWidth="1.8"/></svg>
}
function IconCard() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.8"/></svg>
}
function IconSettings() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8"/></svg>
}
function IconCheck() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconCamera() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2"/></svg>
}
function IconPenSm() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function IconTrash() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}

/* ─── Payment card icons ─── */
function IconChip() {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
      <rect width="40" height="32" rx="6" fill="#d4a843"/>
      <rect x="15" y="0" width="10" height="32" fill="rgba(0,0,0,0.09)"/>
      <rect x="0" y="11" width="40" height="10" fill="rgba(0,0,0,0.09)"/>
      <rect x="15" y="11" width="10" height="10" rx="2" fill="rgba(0,0,0,0.14)"/>
      <rect x="0.5" y="0.5" width="39" height="31" rx="5.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    </svg>
  )
}
function IconContactless() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="1.8" fill="currentColor"/>
      <path d="M7.2 7.2 C5.6 8.8 5.6 11.2 7.2 12.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M12.8 7.2 C14.4 8.8 14.4 11.2 12.8 12.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M4.6 4.6 C1.8 7.4 1.8 12.6 4.6 15.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M15.4 4.6 C18.2 7.4 18.2 12.6 15.4 15.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

/* ─── Section configs ─── */
const MEMBER_SECTIONS = [
  { id: 'personal',    labelFr: 'Profil',        labelEn: 'Profile',        Icon: IconUser     },
  { id: 'security',    labelFr: 'Sécurité',       labelEn: 'Security',       Icon: IconShield   },
  { id: 'preferences', labelFr: 'Préférences',    labelEn: 'Preferences',    Icon: IconSliders  },
  { id: 'payments',    labelFr: 'Paiements',      labelEn: 'Payments',       Icon: IconCard     },
]
const ADMIN_SECTIONS = [
  { id: 'personal',    labelFr: 'Profil',         labelEn: 'Profile',        Icon: IconUser     },
  { id: 'security',    labelFr: 'Sécurité',        labelEn: 'Security',       Icon: IconShield   },
  { id: 'preferences', labelFr: 'Préférences',    labelEn: 'Preferences',    Icon: IconSliders  },
  { id: 'admin',       labelFr: 'Administration', labelEn: 'Administration', Icon: IconSettings },
]

export default function Profile() {
  const { t, i18n } = useTranslation()
  const { user, profile, refreshProfile } = useAuth()
  const isFr = i18n.language.startsWith('fr')
  const routes = getRoutes(i18n.language)
  const isAdmin = profile?.role === 'admin'

  const [activeSection, setActiveSection] = useState('personal')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || DEFAULT_AVATAR)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState(null)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    language: i18n.language,
  })
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' })
  const [twoFA, setTwoFA] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  /* ── Cards / carousel ── */
  const [cards, setCards] = useState([
    { id: 1, brand: 'visa', number: '4242', expiry: '11/26', isDefault: true  },
    { id: 2, brand: 'mc',   number: '1001', expiry: '04/25', isDefault: false },
  ])
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [hoveredCardId, setHoveredCardId] = useState(null)
  const [editMode,      setEditMode]      = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [editingCard,   setEditingCard]   = useState(null)
  const [newCard, setNewCard] = useState({ brand: 'visa', number: '', expiry: '' })

  const avatarInputRef = useRef(null)
  const sectionRefs = {
    personal:    useRef(null),
    security:    useRef(null),
    preferences: useRef(null),
    payments:    useRef(null),
    admin:       useRef(null),
  }

  useEffect(() => {
    setAvatarUrl(profile?.avatar_url || DEFAULT_AVATAR)
    if (profile?.full_name) setFormData(p => ({ ...p, full_name: profile.full_name }))
  }, [profile?.avatar_url, profile?.full_name])

  const scrollTo = (id) => {
    setActiveSection(id)
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' })
    : '—'

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const cardHolderName = (profile?.full_name || user?.email || 'CARD HOLDER').toUpperCase()
  const displaySections = isAdmin ? ADMIN_SECTIONS : MEMBER_SECTIONS

  /* ── Avatar upload ── */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarUploading(true)
    setAvatarError(null)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${ext}`
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
      if (uploadErr) throw new Error(`STORAGE: ${uploadErr.message}`)
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = urlData?.publicUrl
      if (!publicUrl) throw new Error('STORAGE: URL introuvable')
      const { error: dbErr } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      if (dbErr) throw new Error(`DB: ${dbErr.message}`)
      setAvatarUrl(publicUrl)
      refreshProfile?.()
    } catch (err) {
      setAvatarError(err.message)
    }
    setAvatarUploading(false)
    e.target.value = ''
  }

  const handleAvatarDelete = async () => {
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id)
    setAvatarUrl(DEFAULT_AVATAR)
    setAvatarError(null)
    refreshProfile?.()
  }

  /* ── Cards ── */
  const openAddCard = () => {
    setEditingCard(null)
    setNewCard({ brand: 'visa', number: '', expiry: '' })
    setShowCardModal(true)
  }
  const openEditCard = (card) => {
    setEditingCard(card)
    setNewCard({ brand: card.brand, number: card.number, expiry: card.expiry })
    setShowCardModal(true)
  }
  const handleDeleteCard = (id) => {
    setCards(prev => {
      const updated = prev.filter(c => c.id !== id)
      if (carouselIndex > 0 && carouselIndex >= updated.length - 1) {
        setCarouselIndex(Math.max(0, updated.length - 2))
      }
      return updated
    })
    setHoveredCardId(null)
  }
  const handleSubmitCard = () => {
    if (newCard.number.length !== 4 || newCard.expiry.length !== 5) return
    if (editingCard) {
      setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...newCard } : c))
    } else {
      setCards(prev => [...prev, { id: Date.now(), ...newCard, isDefault: false }])
    }
    setNewCard({ brand: 'visa', number: '', expiry: '' })
    setEditingCard(null)
    setShowCardModal(false)
    setEditMode(false)
  }

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      const { error } = await supabase.from('profiles').update({ full_name: formData.full_name }).eq('id', user.id)
      if (formData.language !== i18n.language) i18n.changeLanguage(formData.language)
      if (passwords.newPwd && passwords.newPwd === passwords.confirm && passwords.newPwd.length >= 6) {
        await supabase.auth.updateUser({ password: passwords.newPwd })
        setPasswords({ current: '', newPwd: '', confirm: '' })
      }
      refreshProfile?.()
      setSaveMsg(error ? 'error' : 'success')
    } catch {
      setSaveMsg('error')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(null), 3500)
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarAvatar}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className={styles.sidebarAvatarImg} />
                : initials
              }
            </div>
            <div>
              <p className={styles.sidebarName}>{profile?.full_name || user?.email}</p>
              <span className={isAdmin ? styles.sidebarBadgeAdmin : styles.sidebarBadge}>
                {isAdmin ? (isFr ? 'ADMINISTRATEUR' : 'ADMINISTRATOR') : 'BLACK CARD MEMBER'}
              </span>
            </div>
          </div>

          <nav className={styles.sidebarNav}>
            {displaySections.map(({ id, labelFr, labelEn, Icon }) => (
              <button
                key={id}
                className={`${styles.sidebarItem} ${activeSection === id ? styles.sidebarItemActive : ''}`}
                onClick={() => scrollTo(id)}
              >
                <Icon />
                <span>{isFr ? labelFr : labelEn}</span>
              </button>
            ))}
          </nav>

          {/* Membership / Admin card */}
          {isAdmin ? (
            <div className={`${styles.membershipCard} ${styles.membershipCardAdmin}`}>
              <p className={styles.membershipLabel}>{isFr ? 'ACCÈS' : 'ACCESS'}</p>
              <div className={styles.membershipTier}>
                <span className={`${styles.tierDot} ${styles.tierDotAdmin}`}>⚙</span>
                <span className={styles.tierName}>{isFr ? 'Accès total' : 'Full Access'}</span>
              </div>
              <Link to={routes.admin} className={styles.benefitsBtn} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                {isFr ? 'DASHBOARD ADMIN' : 'ADMIN DASHBOARD'}
              </Link>
            </div>
          ) : (
            <div className={styles.membershipCard}>
              <p className={styles.membershipLabel}>{isFr ? 'STATUT MEMBRE' : 'MEMBERSHIP STATUS'}</p>
              <div className={styles.membershipTier}>
                <span className={styles.tierDot}>✓</span>
                <span className={styles.tierName}>Tier 4 Elite</span>
              </div>
              <button className={styles.benefitsBtn}>{isFr ? 'VOIR LES AVANTAGES' : 'VIEW BENEFITS'}</button>
            </div>
          )}
        </aside>

        {/* ── Main ── */}
        <main className={styles.main}>

          {/* Header */}
          <div className={styles.mainHeader}>
            <div className={styles.mobileAvatarWrap}>
              <div className={styles.mobileAvatar} onClick={() => avatarInputRef.current?.click()}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" className={styles.mobileAvatarImg} />
                  : <span>{initials}</span>
                }
                <div className={styles.mobileAvatarOverlay}><IconCamera /></div>
              </div>
            </div>
            <div className={styles.mobileUserMeta}>
              <h1 className={styles.mobileUserName}>{(profile?.full_name || user?.email || '').toUpperCase()}</h1>
              <span className={isAdmin ? styles.mobileBadgeAdmin : styles.mobileBadge}>
                {isAdmin ? (isFr ? 'ADMINISTRATEUR' : 'ADMINISTRATOR') : 'BLACK CARD MEMBER'}
              </span>
            </div>

            <h1 className={styles.pageTitle}>{isFr ? 'Votre Profil.' : 'Your Profile.'}</h1>
            <div className={styles.pageSubtitle}>
              <span className={isAdmin ? styles.memberBadgeAdmin : styles.memberBadge}>
                {isAdmin ? (isFr ? 'ADMINISTRATEUR' : 'ADMINISTRATOR') : 'BLACK CARD MEMBER'}
              </span>
              <span className={styles.memberSince}>
                {isAdmin
                  ? (isFr ? `Administrateur depuis ${memberSince}` : `Administrator since ${memberSince}`)
                  : (isFr ? `Membre depuis ${memberSince}` : `Member since ${memberSince}`)
                }
              </span>
            </div>
          </div>

          {/* ── Personal Info ── */}
          <section ref={sectionRefs.personal} id="personal" className={styles.section}>
            <h2 className={styles.sectionTitle}>{isFr ? 'Informations personnelles' : 'Personal Information'}</h2>
            <div className={styles.avatarUploadRow}>
              <div className={styles.avatarUploadCircle} onClick={() => avatarInputRef.current?.click()}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" className={styles.avatarUploadImg} />
                  : <span className={styles.avatarUploadInitials}>{initials}</span>
                }
                <div className={styles.avatarUploadOverlay}>
                  {avatarUploading ? <span className={styles.avatarSpinner} /> : <IconCamera />}
                </div>
              </div>
              <div className={styles.avatarUploadMeta}>
                <p className={styles.avatarUploadTitle}>{isFr ? 'Photo de profil' : 'Profile Photo'}</p>
                <p className={styles.avatarUploadHint}>{isFr ? 'JPG ou PNG · max 2 Mo' : 'JPG or PNG · max 2 MB'}</p>
                <div className={styles.avatarBtnsRow}>
                  <button className={styles.avatarUploadBtn} onClick={() => avatarInputRef.current?.click()} disabled={avatarUploading}>
                    {avatarUploading ? (isFr ? 'Chargement…' : 'Uploading…') : (isFr ? 'Changer la photo' : 'Change Photo')}
                  </button>
                  {profile?.avatar_url && (
                    <button className={styles.avatarDeleteBtn} onClick={handleAvatarDelete} disabled={avatarUploading}>
                      {isFr ? 'Supprimer' : 'Remove'}
                    </button>
                  )}
                </div>
                {avatarError && <p className={styles.avatarErrorMsg}>{avatarError}</p>}
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'NOM COMPLET' : 'FULL NAME'}</label>
                <input className={styles.input} value={formData.full_name}
                  onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                  placeholder={isFr ? 'Votre nom' : 'Your name'} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'ADRESSE EMAIL' : 'EMAIL ADDRESS'}</label>
                <input className={`${styles.input} ${styles.inputReadOnly}`} value={user?.email || ''} readOnly />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'TÉLÉPHONE' : 'PHONE NUMBER'}</label>
                <input className={styles.input} value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+33 6 00 00 00 00" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'LANGUE' : 'LANGUAGE PREFERENCE'}</label>
                <select className={styles.select} value={formData.language}
                  onChange={e => setFormData(p => ({ ...p, language: e.target.value }))}>
                  <option value="fr">Français</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Security ── */}
          <section ref={sectionRefs.security} id="security" className={styles.section}>
            <h2 className={styles.sectionTitle}>{isFr ? 'Sécurité' : 'Security'}</h2>
            <div className={styles.formGrid3}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'MOT DE PASSE ACTUEL' : 'CURRENT PASSWORD'}</label>
                <input type="password" className={styles.input} value={passwords.current}
                  onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••••••" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'NOUVEAU MOT DE PASSE' : 'NEW PASSWORD'}</label>
                <input type="password" className={styles.input} value={passwords.newPwd}
                  onChange={e => setPasswords(p => ({ ...p, newPwd: e.target.value }))}
                  placeholder={isFr ? 'Min. 6 caractères' : 'Min. 6 characters'} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'CONFIRMER' : 'CONFIRM NEW PASSWORD'}</label>
                <input type="password" className={styles.input} value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="Confirmer" />
              </div>
            </div>
            <div className={styles.twoFACard}>
              <div className={styles.twoFAIcon}><IconShield /></div>
              <div className={styles.twoFAText}>
                <p className={styles.twoFATitle}>{isFr ? 'Authentification à deux facteurs' : 'Two-Factor Authentication'}</p>
                <p className={styles.twoFADesc}>{isFr ? 'Sécurisez votre compte avec une couche de protection supplémentaire.' : 'Secure your account with an additional security layer.'}</p>
              </div>
              <button className={`${styles.toggle} ${twoFA ? styles.toggleOn : ''}`} onClick={() => setTwoFA(p => !p)} aria-label="Toggle 2FA">
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </section>

          {/* ── Preferences ── */}
          <section ref={sectionRefs.preferences} id="preferences" className={styles.section}>
            <h2 className={styles.sectionTitle}>Communication</h2>
            <div className={styles.notifGrid}>
              <div className={`${styles.notifCard} ${emailNotif ? styles.notifCardActive : ''}`}>
                <div className={`${styles.checkbox} ${emailNotif ? styles.checkboxChecked : ''}`} onClick={() => setEmailNotif(p => !p)}>
                  {emailNotif && <IconCheck />}
                </div>
                <div>
                  <p className={styles.notifTitle}>{isFr ? 'Notifications Email' : 'Email Notifications'}</p>
                  <p className={styles.notifDesc}>{isFr ? 'Recevez les mises à jour de vos réservations, actualités de la flotte et invitations exclusives.' : 'Receive updates about your bookings, fleet news, and exclusive member-only invitations.'}</p>
                </div>
              </div>
              <div className={`${styles.notifCard} ${smsNotif ? styles.notifCardActive : ''}`}>
                <div className={`${styles.checkbox} ${smsNotif ? styles.checkboxChecked : ''}`} onClick={() => setSmsNotif(p => !p)}>
                  {smsNotif && <IconCheck />}
                </div>
                <div>
                  <p className={styles.notifTitle}>{isFr ? 'Alertes SMS' : 'SMS Alerts'}</p>
                  <p className={styles.notifDesc}>{isFr ? 'Alertes mobiles directes pour les livraisons urgentes et les notifications d\'arrivée.' : 'Direct mobile alerts for urgent vehicle logistics and arrival notifications.'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Payments (members only) ── */}
          {!isAdmin && (
            <section ref={sectionRefs.payments} id="payments" className={styles.section}>
              <div className={styles.paymentsHeader}>
                <h2 className={styles.sectionTitle}>{isFr ? 'Paiements' : 'Payments'}</h2>
                <div className={styles.paymentsHeaderRight}>
                  {cards.length > 2 && (
                    <div className={styles.carouselArrows}>
                      <button className={`${styles.arrowBtn} ${carouselIndex === 0 ? styles.arrowBtnDisabled : ''}`}
                        onClick={() => setCarouselIndex(i => Math.max(0, i - 1))} disabled={carouselIndex === 0}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button className={`${styles.arrowBtn} ${carouselIndex + 2 >= cards.length ? styles.arrowBtnDisabled : ''}`}
                        onClick={() => setCarouselIndex(i => Math.min(cards.length - 2, i + 1))} disabled={carouselIndex + 2 >= cards.length}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  )}
                  <button
                    className={`${styles.editPaymentBtn} ${editMode ? styles.editPaymentBtnActive : ''}`}
                    onClick={() => setEditMode(p => !p)}
                  >
                    {editMode ? (isFr ? 'TERMINER' : 'DONE') : (isFr ? 'MODIFIER' : 'EDIT')}
                  </button>
                  <button className={styles.addPaymentBtn} onClick={openAddCard}>
                    + {isFr ? 'AJOUTER' : 'ADD CARD'}
                  </button>
                </div>
              </div>

              <div className={styles.cardsGrid}>
                {cards.slice(carouselIndex, carouselIndex + 2).map(card => {
                  const isDark = card.brand === 'visa'
                  const isHovered = hoveredCardId === card.id
                  const isDimmed = hoveredCardId !== null && hoveredCardId !== card.id
                  const showOverlay = isHovered || editMode
                  return (
                    <div
                      key={card.id}
                      className={[
                        styles.payCard,
                        isDark ? styles.payCardDark : '',
                        isHovered ? styles.payCardHovered : '',
                        isDimmed ? styles.payCardDimmed : '',
                      ].join(' ')}
                      onMouseEnter={() => setHoveredCardId(card.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      {/* Action overlay */}
                      <div className={`${styles.cardOverlay} ${showOverlay ? styles.cardOverlayVisible : ''}`}>
                        <button className={styles.cardOverlayBtn} onClick={() => openEditCard(card)} title={isFr ? 'Modifier' : 'Edit'}>
                          <IconPenSm />
                        </button>
                        <button className={`${styles.cardOverlayBtn} ${styles.cardOverlayBtnDelete}`} onClick={() => handleDeleteCard(card.id)} title={isFr ? 'Supprimer' : 'Delete'}>
                          <IconTrash />
                        </button>
                      </div>

                      <div className={styles.payCardHeader}>
                        <span className={`${styles.payCardBank} ${!isDark ? styles.payCardBankLight : ''}`}>OBSIDIAN</span>
                        <span className={`${styles.payCardContactlessIcon} ${!isDark ? styles.payCardContactlessLight : ''}`}><IconContactless /></span>
                      </div>
                      <div className={styles.payCardChipRow}><IconChip /></div>
                      <p className={`${styles.payCardNumber} ${!isDark ? styles.payCardNumberLight : ''}`}>
                        •••• •••• •••• {card.number}
                      </p>
                      <div className={styles.payCardFooter}>
                        <div className={styles.payCardHolderBlock}>
                          <span className={`${styles.payCardMeta} ${!isDark ? styles.payCardMetaLight : ''}`}>{isFr ? 'TITULAIRE' : 'CARD HOLDER'}</span>
                          <span className={`${styles.payCardHolderName} ${!isDark ? styles.payCardHolderNameLight : ''}`}>{cardHolderName.slice(0, 20)}</span>
                        </div>
                        <div className={styles.payCardExpiryBlock}>
                          <span className={`${styles.payCardMeta} ${!isDark ? styles.payCardMetaLight : ''}`}>EXPIRES</span>
                          <span className={`${styles.payCardExpiryDate} ${!isDark ? styles.payCardExpiryDateLight : ''}`}>{card.expiry}</span>
                        </div>
                        <div className={styles.payCardNetworkBlock}>
                          {card.isDefault && (
                            <span className={isDark ? styles.payCardDefaultTag : styles.payCardDefaultTagLight}>
                              {isFr ? 'DÉFAUT' : 'DEFAULT'}
                            </span>
                          )}
                          {isDark
                            ? <span className={styles.visaLogo}>VISA</span>
                            : <div className={styles.mcLogo}><span className={styles.mcCircle1} /><span className={styles.mcCircle2} /></div>
                          }
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Administration (admin only) ── */}
          {isAdmin && (
            <section ref={sectionRefs.admin} id="admin" className={styles.section}>
              <h2 className={styles.sectionTitle}>{isFr ? 'Administration' : 'Administration'}</h2>
              <Link to={routes.admin} className={styles.adminAccessCard}>
                <div className={styles.adminAccessIcon}>
                  <IconSettings />
                </div>
                <div className={styles.adminAccessText}>
                  <p className={styles.adminAccessTitle}>{isFr ? 'Dashboard Admin' : 'Admin Dashboard'}</p>
                  <p className={styles.adminAccessDesc}>{isFr ? 'Gérer les véhicules, réservations et utilisateurs' : 'Manage vehicles, bookings and users'}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: '#6b7280' }}>
                  <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </section>
          )}

          {/* ── Actions ── */}
          <div className={styles.actions}>
            {saveMsg === 'success' && <p className={styles.successMsg}>{isFr ? '✓ Modifications enregistrées' : '✓ Changes saved'}</p>}
            {saveMsg === 'error'   && <p className={styles.errorMsg}>{isFr ? 'Une erreur est survenue.' : 'An error occurred.'}</p>}
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? '...' : (isFr ? 'ENREGISTRER LES MODIFICATIONS' : 'SAVE CHANGES')}
            </button>
            <button className={styles.deleteBtn}>{isFr ? 'Supprimer le compte' : 'Delete Account'}</button>
          </div>

        </main>
      </div>
      <Footer />

      {/* ── Card modal (add / edit) ── */}
      {showCardModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCardModal(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingCard
                  ? (isFr ? 'Modifier la carte' : 'Edit Card')
                  : (isFr ? 'Ajouter une carte' : 'Add a Card')
                }
              </h3>
              <button className={styles.modalClose} onClick={() => setShowCardModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? 'TYPE DE CARTE' : 'CARD TYPE'}</label>
                <div className={styles.brandToggle}>
                  <button className={`${styles.brandBtn} ${newCard.brand === 'visa' ? styles.brandBtnActive : ''}`}
                    onClick={() => setNewCard(p => ({ ...p, brand: 'visa' }))}>VISA</button>
                  <button className={`${styles.brandBtn} ${newCard.brand === 'mc' ? styles.brandBtnActive : ''}`}
                    onClick={() => setNewCard(p => ({ ...p, brand: 'mc' }))}>Mastercard</button>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? '4 DERNIERS CHIFFRES' : 'LAST 4 DIGITS'}</label>
                <input className={styles.input} value={newCard.number}
                  onChange={e => setNewCard(p => ({ ...p, number: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="0000" maxLength={4} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{isFr ? "DATE D'EXPIRATION" : 'EXPIRY DATE'}</label>
                <input className={styles.input} value={newCard.expiry}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '')
                    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4)
                    setNewCard(p => ({ ...p, expiry: v }))
                  }}
                  placeholder="MM/YY" maxLength={5} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancelBtn} onClick={() => setShowCardModal(false)}>
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button className={styles.modalAddBtn} disabled={newCard.number.length !== 4 || newCard.expiry.length !== 5}
                onClick={handleSubmitCard}>
                {editingCard ? (isFr ? 'Enregistrer' : 'Save') : (isFr ? 'Ajouter la carte' : 'Add Card')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
