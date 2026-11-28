// Shared stub component for admin pages not yet fully implemented.
// Import and use: <AdminStub title="Page Name" />
import { Construction } from 'lucide-react'

export default function AdminStub({ title = 'Coming Soon' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '14px',
      color: '#94A3B8',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <Construction size={40} strokeWidth={1.5} />
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#475569' }}>{title}</h2>
      <p style={{ fontSize: '14px', maxWidth: '320px', textAlign: 'center', lineHeight: 1.6 }}>
        This page is under construction. Check back soon.
      </p>
    </div>
  )
}
