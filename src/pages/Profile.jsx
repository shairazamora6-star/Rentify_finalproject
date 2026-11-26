import { useState } from 'react';
import { Camera, User, Mail, MapPin, Calendar, Edit2, Shield, Bell, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Mitchell',
    email: 'john.mitchell@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joined: 'January 2024',
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Profile</h1>
        <button onClick={() => setEditMode(!editMode)} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, color: '#2563EB', fontWeight: 600,
        }}>
          {editMode ? <><CheckmarkIcon /> Done</> : <><Edit2 size={16} /> Edit</>}
        </button>
      </div>

      {/* Avatar Section */}
      <div style={{
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 32,
          position: 'relative',
        }}>
          JM
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 28, height: 28, borderRadius: '50%',
            background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid white',
          }}>
            <Camera size={14} color="white" />
          </button>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 12 }}>{profile.name}</h2>
        <p style={{ fontSize: 14, color: '#64748B' }}>{profile.email}</p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 1, background: '#E2E8F0', margin: '0 20px',
        borderRadius: 12, overflow: 'hidden', marginTop: 16,
      }}>
        {[
          { label: 'Rentals', value: '12' },
          { label: 'Earned', value: '$2,450' },
          { label: 'Rating', value: '4.8 ★' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', padding: '16px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: '#64748B' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Info Fields */}
      <div style={{ padding: '20px' }}>
        {[
          { icon: User, label: 'Name', key: 'name' },
          { icon: Mail, label: 'Email', key: 'email' },
          { icon: MapPin, label: 'Location', key: 'location' },
          { icon: Calendar, label: 'Member since', key: 'joined', readonly: true },
        ].map(({ icon: Icon, label, key, readonly }) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 0',
            borderBottom: '1px solid #F1F5F9',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#F8FAFC',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color="#64748B" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 2 }}>{label}</p>
              {editMode && !readonly ? (
                <input
                  value={profile[key]}
                  onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: 14, borderRadius: 8 }}
                />
              ) : (
                <p style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{profile[key]}</p>
              )}
            </div>
            {!editMode && !readonly && (
              <button onClick={() => setEditMode(true)} style={{ color: '#2563EB' }}>
                <Edit2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Settings Links */}
      <div style={{ padding: '0 20px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Settings</p>
        {[
          { icon: Shield, label: 'Account Settings', path: '/settings' },
          { icon: Bell, label: 'Notifications', path: '/notifications-settings' },
        ].map(({ icon: Icon, label, path }) => (
          <button key={label} onClick={() => navigate(path)} style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 0',
            borderBottom: '1px solid #F1F5F9',
            background: 'none', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#F8FAFC',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color="#64748B" />
            </div>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{label}</span>
            <span style={{ color: '#E2E8F0' }}>›</span>
          </button>
        ))}
      </div>

      {/* Danger Zone */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Danger Zone</p>
        <button onClick={() => navigate('/delete-account')} style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 0',
          background: 'none', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#FEF2F2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trash2 size={18} color="#EF4444" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#EF4444' }}>Delete Account</span>
        </button>
        <button onClick={handleLogout} style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 0',
          background: 'none', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#F8FAFC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogOut size={18} color="#64748B" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#64748B' }}>Log Out</span>
        </button>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

function CheckmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
