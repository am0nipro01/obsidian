import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { getRoutes } from '../utils/routes'
import styles from './Login.module.css'

export default function Login() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const routes = getRoutes(i18n.language)
  const from = location.state?.from || routes.dashboard
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name } },
      })
      if (error) { setError(error.message); setLoading(false); return }
      navigate(from, { replace: true })
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) { setError(error.message); setLoading(false); return }
      navigate(from, { replace: true })
    }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <a href="/" className={styles.logo}>OBSIDIAN</a>
        <div className={styles.goldLine} />

        <h1 className={styles.title}>
          {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label>{t('auth.fullName')}</label>
              <input
                type="text"
                name="full_name"
                placeholder={t('auth.fullNamePlaceholder')}
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label>{t('auth.email')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('auth.emailPlaceholder')}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>{t('auth.password')}</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? '...' : (mode === 'login' ? t('auth.loginBtn') : t('auth.signupBtn'))}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}>
            {mode === 'login' ? t('auth.signupLink') : t('auth.loginLink')}
          </button>
        </p>
      </div>
    </div>
  )
}
