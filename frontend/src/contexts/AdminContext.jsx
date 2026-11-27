import { createContext, useContext, useState } from 'react'
import { demoAdmin } from '../data/adminMockData'

// DEMO ONLY: this check runs in the browser, so it is NOT real security.
// A real backend must verify the admin's login and role on the server.

const AdminContext = createContext(null)

// sessionStorage clears when the browser tab is closed.
const STORAGE_KEY = 'rentify_admin_session'

function readSavedAdmin() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : null
    return parsed && parsed.role === 'admin' ? parsed : null
  } catch {
    return null
  }
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(readSavedAdmin)

  const adminLogin = async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase()

    if (!cleanEmail || !password) {
      throw new Error('Email and password are required')
    }
    if (cleanEmail !== demoAdmin.email || password !== demoAdmin.password) {
      throw new Error('Invalid admin email or password')
    }

    // Save only safe fields. Never store the password.
    const safeAdmin = {
      id: demoAdmin.id,
      name: demoAdmin.name,
      email: demoAdmin.email,
      role: demoAdmin.role,
      avatar: demoAdmin.avatar,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeAdmin))
    setAdmin(safeAdmin)
  }

  const adminLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setAdmin(null)
  }

  return (
    <AdminContext.Provider
      value={{ admin, isAdmin: Boolean(admin), adminLogin, adminLogout }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used inside an AdminProvider')
  }
  return context
}