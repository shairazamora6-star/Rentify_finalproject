import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, User, Mail, MapPin, Camera, Save, CheckCircle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useRef } from 'react';

export default function PersonalInfo() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, setUser, addNotification, updateUser } = useApp();
  const fileInputRef = useRef(null);

  // Read initial tab from URL ?tab= param
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  // Initialize profile from user context
  const [profile, setProfile] = useState(() => {
    if (!user) return { fullName: '', username: '', bio: '', email: '', phone: '', location: '' };
    const nameParts = (user.name || '').split(' ');
    return {
      fullName: user.name || '',
      username: user.username || (nameParts.length > 1 ? nameParts[0].toLowerCase() + nameParts[1].toLowerCase() : nameParts[0].toLowerCase()),
      bio: user.bio || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      avatar: user.avatar || null,
    };
  });

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

  // Sync activeTab to URL
  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Derive initials from fullName for avatar
  const initials = (profile.fullName || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));

    // Update user in context (demo mode persistence via localStorage in AppContext)
    const updatedUser = {
      ...user,
      name: profile.fullName,
      username: profile.username,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      avatar: profile.avatar,
      profileImage,
    };
    setUser(updatedUser);
    updateUser({
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      profileImage,
    });

    setSaving(false);
    setSaved(true);
    addNotification({
      type: 'profile_updated',
      title: 'Profile Updated',
      message: 'Your personal information has been saved.',
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setProfile(prev => ({ ...prev, avatar: null }));
    setProfileImage('');
    updateUser({ profileImage: '' });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'location', label: 'Location', icon: MapPin },
  ];

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
        <span style={{ fontWeight: 700, fontSize: 18 }}>Personal Info</span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: 'white', borderBottom: '1px solid #E2E8F0',
        position: 'sticky', top: 56, zIndex: 40, padding: '0 20px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '14px 0', borderBottom: `2px solid ${activeTab === tab.id ? '#2563EB' : 'transparent'}`,
              background: 'none', cursor: 'pointer',
              color: activeTab === tab.id ? '#2563EB' : '#64748B',
              fontWeight: activeTab === tab.id ? 600 : 500, fontSize: 14,
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        {saved && (
          <div style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
            background: '#087F73', color: 'white', padding: '12px 24px', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <CheckCircle size={18} /> Changes saved
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                {profile.avatar ? (
                  <>
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      style={{
                        width: 100, height: 100, borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      onClick={handleRemoveAvatar}
                      style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#EF4444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid white', cursor: 'pointer',
                      }}
                    >
                      <X size={14} color="white" />
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: 100, height: 100, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3978D5, #73A7E5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 36,
                      overflow: 'hidden',
                    }}>
                      {profileImage ? (
                        <img src={profileImage} alt={profile.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        initials
                      )}
                    </div>
                    <button type="button" onClick={handleAvatarUpload} aria-label="Change profile photo" style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 32, height: 32, borderRadius: '50%',
                      background: '#2563EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid white', cursor: 'pointer',
                    }}>
                      <Camera size={16} color="white" />
                    </button>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </div>
              <p style={{ fontSize: 13, color: '#64748B' }}>Tap to change photo</p>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
                { key: 'username', label: 'Username', type: 'text', placeholder: '@username', prefix: '@' },
                { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell others about yourself', rows: 3 },
                { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={profile[field.key]}
                      onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={field.rows}
                      style={{
                        width: '100%', padding: '12px', borderRadius: 10,
                        border: '1px solid #E2E8F0', fontSize: 15, fontFamily: 'inherit',
                        boxSizing: 'border-box', resize: 'vertical',
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {field.prefix && <span style={{ padding: '0 12px', color: '#94A3B8', fontSize: 15 }}>{field.prefix}</span>}
                      <input
                        type={field.type}
                        value={profile[field.key]}
                        onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={{
                          flex: 1, padding: '12px', borderRadius: field.prefix ? '0 10px 10px 0' : 10,
                          border: '1px solid #E2E8F0', fontSize: 15, boxSizing: 'border-box',
                          borderLeft: field.prefix ? 'none' : undefined,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ marginTop: 8 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  width: '100%', padding: '12px', borderRadius: 10,
                  border: '1px solid #E2E8F0', fontSize: 15, boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
                We'll send a verification email to the new address.
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Current Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={e => setProfile(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State"
                style={{
                  width: '100%', padding: '12px', borderRadius: 10,
                  border: '1px solid #E2E8F0', fontSize: 15, boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
                Used to show nearby items and calculate distances.
              </p>
            </div>

            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                Location Privacy
              </p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: '#2563EB' }} />
                <span style={{ fontSize: 14, color: '#334155' }}>Show my city on public profile</span>
              </label>
            </div>

            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}