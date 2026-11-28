// Shared stub component for admin pages not yet fully implemented.
// Import and use: <AdminStub title="Page Name" />
import { Construction } from 'lucide-react'

export default function AdminStub({ title = 'Coming Soon' }) {
  return (
    <div
      className="admin-stub"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '14px',
        color: 'var(--ink-4)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <Construction size={40} strokeWidth={1.5} />
      <h2 className="admin-stub-title" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink-2)' }}>{title}</h2>
      <p className="admin-stub-desc" style={{ fontSize: '14px', maxWidth: '320px', textAlign: 'center', lineHeight: 1.6 }}>
        This page is under construction. Check back soon.
      </p>
    </div>
  )
}
