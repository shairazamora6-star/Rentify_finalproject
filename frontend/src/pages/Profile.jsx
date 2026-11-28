import { useRef, useState, useMemo } from 'react';
import { Camera, User, Mail, MapPin, Calendar, Edit2, Shield, Bell, LogOut, Trash2, LayoutDashboard, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user, updateUser, rentals } = useApp();
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'John Mitchell',
    email: user?.email || 'john.mitchell@email.com',
    phone: user?.phone || '+1 (555) 123-4567',
    location: user?.location || 'San Francisco, CA',
    joined: 'January 2024',
  });
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const scale = Math.max(size / image.width, size / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        const context = canvas.getContext('2d');
        context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        const resized = canvas.toDataURL('image/jpeg', 0.88);
        setProfileImage(resized);
        updateUser({ profileImage: resized });
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const toggleEdit = () => {
    if (editMode) updateUser(profile);
    setEditMode(!editMode);
  };

  const initials = (profile.name || 'R')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Compute stats from rentals
  const stats = useMemo(() => {
    const userRentals = rentals.filter(r => r.ownerId === user?.id || r.userId === user?.id);
    const rentalsCount = userRentals.length;
    const earned = userRentals.reduce((sum, r) => sum + (r.totalPrice || r.price || 0), 0);
    // Mock rating - could be from reviews in a real app
    const rating = 4.8;
    return { rentalsCount, earned, rating };
  }, [rentals, user?.id]);

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--line-1)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)' }}>Profile</h1>
        <button onClick={toggleEdit} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, color: 'var(--accent)', fontWeight: 600,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 0.75; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}>
          {editMode ? (
            <>
              <Check size={16} /> Done
            </>
          ) : (
            <>
              <Edit2 size={16} /> Edit
            </>
          )}
        </button>
      </div>

      {/* Avatar Section */}
      <div style={{
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--line-1)',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          position: 'relative',
        }}>
          {profileImage ? (
            <img src={profileImage} alt={profile.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3978D5, #73A7E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 32,
            }}>{initials}</div>
          )}
          <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Change profile photo" style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--surface)', cursor: 'pointer',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
            <Camera size={14} color="white" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 12, color: 'var(--ink-1)' }}>{profile.name}</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>{profile.email}</p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 1, background: 'var(--line-1)', margin: '0 20px',
        borderRadius: 12, overflow: 'hidden', marginTop: 16,
      }}>
        {[
          { label: 'Rentals', value: stats.rentalsCount.toString() },
          { label: 'Earned', value: `₱${stats.earned.toLocaleString()}` },
          { label: 'Rating', value: `${stats.rating} ★` },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--surface)', padding: '16px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)' }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{stat.label}</p>
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
            borderBottom: '1px solid var(--line-2)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color="var(--ink-3)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 2 }}>{label}</p>
              {editMode && !readonly ? (
                <input
                  value={profile[key]}
                  onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: 14, borderRadius: 8 }}
                />
              ) : (
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-1)' }}>{profile[key]}</p>
              )}
            </div>
            {!editMode && !readonly && (
              <button onClick={() => setEditMode(true)} style={{ color: 'var(--accent)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 0.75; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}>
                <Edit2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Settings Links */}
      <div style={{ padding: '0 20px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Settings</p>
        {[
          { icon: Shield, label: 'Account Settings', path: '/account-settings' },
          { icon: Bell, label: 'Notifications', path: '/notifications-settings' },
          { icon: LayoutDashboard, label: 'Admin Console', path: '/admin' },
        ].map(({ icon: Icon, label, path }) => (
          <button key={label} onClick={() => navigate(path)} style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 0',
            borderBottom: '1px solid var(--line-2)',
            background: 'none', cursor: 'pointer', textAlign: 'left',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color="var(--ink-3)" />
            </div>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--ink-1)' }}>{label}</span>
            <span style={{ color: 'var(--line-1)' }}>›</span>
          </button>
        ))}
      </div>

      {/* Danger Zone */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Danger Zone</p>
        <button onClick={() => navigate('/delete-account')} style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 0',
          background: 'none', cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-softer)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--danger-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trash2 size={18} color="var(--danger)" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--danger)' }}>Delete Account</span>
        </button>
        <button onClick={handleLogout} style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 0',
          background: 'none', cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogOut size={18} color="var(--ink-3)" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-3)' }}>Log Out</span>
        </button>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
