import { Navigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContext'
import './Admin.css'

export default function AdminDashboardPlaceholder() {
  const { admin, isAdmin, adminLogout } = useAdmin()

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-placeholder">
      <h1>Admin area</h1>
      <p>Signed in as {admin.name} ({admin.email}). The dashboard is coming soon.</p>
      <button className="btn-outline" onClick={adminLogout}>Sign out</button>
    </div>
  )
}