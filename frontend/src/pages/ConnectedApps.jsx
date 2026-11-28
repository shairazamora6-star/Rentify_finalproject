import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, X } from 'lucide-react';

const apps = [
  { id: 1, name: 'Google', desc: 'Sign in & profile sync', connected: 'Jan 2025', scope: 'Profile, Email' },
  { id: 2, name: 'Apple', desc: 'Sign in with Apple', connected: 'Mar 2025', scope: 'Profile' },
];

export default function ConnectedApps() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState(apps);

  const revoke = (id) => setConnections(prev => prev.filter(a => a.id !== id));

  return (
    <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Connected Apps</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--accent-softer)', borderRadius: 14, padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <Shield size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13, color: 'var(--accent)', lineHeight: 1.5 }}>
            Third-party services that have access to your Rentify account. Revoking access won't delete your data from those services.
          </p>
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Connected Services</p>

        {connections.length === 0 ? (
          <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line-1)', padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 6 }}>No connected apps</p>
            <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>You haven't linked any third-party services.</p>
          </div>
        ) : (
          connections.map(app => (
            <div key={app.id} style={{
              background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line-1)',
              padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: 'var(--ink-1)',
              }}>{app.name[0]}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{app.name}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{app.desc} · since {app.connected}</p>
                <span style={{
                  display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 8,
                  background: 'var(--line-2)', fontSize: 10, fontWeight: 600, color: 'var(--ink-3)',
                }}>{app.scope}</span>
              </div>
              <button
                onClick={() => revoke(app.id)}
                title="Revoke access"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 0.7; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}
              >
                <X size={18} color="var(--danger)" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
