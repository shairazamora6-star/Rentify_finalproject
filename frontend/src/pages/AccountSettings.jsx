import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Lock, Bell, Shield, ChevronRight } from 'lucide-react';

export default function AccountSettings() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'var(--surface)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Account Settings</span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Personal Info */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Personal Information</p>

          {[
            { icon: User, label: 'Personal Info', path: '/personal-info', desc: 'Name, username, bio' },
            { icon: Mail, label: 'Email Address', path: '/personal-info?tab=email', desc: 'john.mitchell@email.com' },
            { icon: Lock, label: 'Change Password', path: '/change-password', desc: 'Last changed 3 months ago' },
          ].map(({ icon: Icon, label, path, desc }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
              background: 'var(--surface)', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="var(--ink-3)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{desc}</p>
              </div>
              <ChevronRight size={20} color="var(--ink-4)" />
            </button>
          ))}
        </div>

        {/* Security */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Security</p>

          {[
            { icon: Shield, label: 'Two-Factor Authentication', path: '/2fa', desc: 'Add an extra layer of security' },
            { icon: Shield, label: 'Login Activity', path: '/login-activity', desc: 'Review recent login sessions' },
            { icon: Shield, label: 'Connected Apps', path: '/connected-apps', desc: 'Manage third-party access' },
          ].map(({ icon: Icon, label, path, desc }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
              background: 'var(--surface)', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="var(--ink-3)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{desc}</p>
              </div>
              <ChevronRight size={20} color="var(--ink-4)" />
            </button>
          ))}
        </div>

        {/* Preferences */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Preferences</p>

          {[
            { icon: Bell, label: 'Notifications', path: '/notifications-settings', desc: 'Manage notification preferences' },
            { icon: Shield, label: 'Privacy Settings', path: '/privacy-settings', desc: 'Control your profile visibility' },
            { icon: Shield, label: 'Data Permissions', path: '/data-permissions', desc: 'Manage your data & privacy' },
            { icon: Shield, label: 'Activity Status', path: '/activity-status', desc: 'Control online visibility' },
          ].map(({ icon: Icon, label, path, desc }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
              background: 'var(--surface)', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="var(--ink-3)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{desc}</p>
              </div>
              <ChevronRight size={20} color="var(--ink-4)" />
            </button>
          ))}
        </div>

        {/* Danger Zone */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Danger Zone</p>

          <button onClick={() => navigate('/delete-account')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'var(--surface)', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-soft)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--danger-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--danger)', marginBottom: 2 }}>Delete Account</p>
              <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Permanently delete your account and all data</p>
            </div>
            <ChevronRight size={20} color="var(--ink-4)" />
          </button>
        </div>

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}