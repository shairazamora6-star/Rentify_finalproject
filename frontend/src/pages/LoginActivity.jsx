import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Monitor, Smartphone, ShieldCheck, Laptop, Globe, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const sessions = [
  { id: 1, device: 'Current session', icon: Monitor, os: 'Windows 11 · Chrome 126', location: 'Berlin, Germany', ip: '88.214.6.12', last: 'Now', current: true },
  { id: 2, device: 'iPhone 15 Pro', icon: Smartphone, os: 'iOS 19 · Safari', location: 'Berlin, Germany', ip: '88.214.6.15', last: '2 hours ago' },
  { id: 3, device: 'MacBook Pro', icon: Laptop, os: 'macOS 15 · Firefox', location: 'Munich, Germany', ip: '83.122.90.4', last: '3 days ago' },
];

export default function LoginActivity() {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const [signedOut, setSignedOut] = useState({});

  const handleSignOut = (session) => {
    setSignedOut(prev => ({ ...prev, [session.id]: true }));
    addNotification({
      type: 'session_revoked',
      title: 'Session Signed Out',
      message: `${session.device} has been signed out.`,
    });
  };

  return (
    <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Login Activity</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--accent-softer)', borderRadius: 14, padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <ShieldCheck size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13, color: 'var(--accent)', lineHeight: 1.5 }}>
            <strong>Everything looks normal.</strong> No new sign-in attempts detected. You'll be notified immediately if we spot anything unusual.
          </p>
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Recent Sessions</p>

        {sessions.map(s => {
          const Icon = s.icon;
          const revoked = signedOut[s.id];
          return (
            <div key={s.id} style={{
              background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line-1)',
              padding: 16, marginBottom: 12,
              opacity: revoked ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: s.current ? 'var(--accent-soft)' : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={s.current ? 'var(--accent)' : 'var(--ink-3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{s.device}</p>
                    {s.current && !revoked && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                        background: 'var(--success-light)', color: 'var(--success)',
                      }}>Active</span>
                    )}
                    {revoked && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                        background: 'var(--danger-soft)', color: 'var(--danger)',
                      }}>Revoked</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{s.os}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <Globe size={12} color="var(--ink-4)" />
                    <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.location}</span>
                  </div>
                  <p style={{ fontSize: 12, color: revoked ? 'var(--danger)' : s.current ? 'var(--accent)' : 'var(--ink-4)', fontWeight: 600, marginTop: 4 }}>
                    {revoked ? 'Signed out' : s.last}
                  </p>
                </div>
              </div>

              {!s.current && !revoked && (
                <button onClick={() => handleSignOut(s)} style={{
                  width: '100%', marginTop: 12, padding: 10, borderRadius: 10,
                  border: '1.5px solid var(--danger-line)', background: 'var(--danger-soft)',
                  color: 'var(--danger)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-softer)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--danger-soft)'; }}>
                  Sign out this device
                </button>
              )}
              {revoked && (
                <div style={{
                  width: '100%', marginTop: 12, padding: 10, borderRadius: 10,
                  border: '1.5px solid var(--line-1)', background: 'var(--surface-2)',
                  color: 'var(--ink-3)', fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <CheckCircle size={14} /> Device signed out
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
