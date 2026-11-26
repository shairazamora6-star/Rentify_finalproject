import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Lock, Bell, Shield, ChevronRight } from 'lucide-react';

export default function AccountSettings() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}>
          <ChevronLeft size={24} color="#0F172A" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Account Settings</span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Personal Info */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Personal Information</p>

          {[
            { icon: User, label: 'Personal Info', path: '/personal-info', desc: 'Name, username, bio' },
            { icon: Mail, label: 'Email Address', path: '/personal-info?tab=email', desc: 'john.mitchell@email.com' },
            { icon: Lock, label: 'Change Password', path: '/change-password', desc: 'Last changed 3 months ago' },
          ].map(({ icon: Icon, label, path, desc }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid #F1F5F9',
              background: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="#64748B" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#0F172A', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>{desc}</p>
              </div>
              <ChevronRight size={20} color="#CBD5E1" />
            </button>
          ))}
        </div>

        {/* Security */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Security</p>

          {[
            { icon: Shield, label: 'Two-Factor Authentication', path: '/2fa', desc: 'Add an extra layer of security' },
            { icon: Shield, label: 'Login Activity', path: '/login-activity', desc: 'Review recent login sessions' },
            { icon: Shield, label: 'Connected Apps', path: '/connected-apps', desc: 'Manage third-party access' },
          ].map(({ icon: Icon, label, path, desc }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid #F1F5F9',
              background: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="#64748B" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#0F172A', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>{desc}</p>
              </div>
              <ChevronRight size={20} color="#CBD5E1" />
            </button>
          ))}
        </div>

        {/* Preferences */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Preferences</p>

          {[
            { icon: Bell, label: 'Notifications', path: '/notifications-settings', desc: 'Manage notification preferences' },
            { icon: Shield, label: 'Privacy Settings', path: '/privacy-settings', desc: 'Control your profile visibility' },
            { icon: Shield, label: 'Data Permissions', path: '/data-permissions', desc: 'Manage your data & privacy' },
            { icon: Shield, label: 'Activity Status', path: '/activity-status', desc: 'Control online visibility' },
          ].map(({ icon: Icon, label, path, desc }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid #F1F5F9',
              background: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="#64748B" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#0F172A', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>{desc}</p>
              </div>
              <ChevronRight size={20} color="#CBD5E1" />
            </button>
          ))}
        </div>

        {/* Danger Zone */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', margin: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Danger Zone</p>

          <button onClick={() => navigate('/delete-account')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'none', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#EF4444', marginBottom: 2 }}>Delete Account</p>
              <p style={{ fontSize: 12, color: '#64748B' }}>Permanently delete your account and all data</p>
            </div>
            <ChevronRight size={20} color="#CBD5E1" />
          </button>
        </div>

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}