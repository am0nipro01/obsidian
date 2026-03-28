import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getRoutes } from '../utils/routes'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const { i18n } = useTranslation()
  const routes = getRoutes(i18n.language)

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0C0C0C', color: '#C8A96E', fontFamily: 'serif', letterSpacing: '0.1em' }}>
      OBSIDIAN
    </div>
  )

  if (!user) return <Navigate to={routes.login} state={{ from: location.pathname + location.search }} replace />
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/" replace />

  return children
}
