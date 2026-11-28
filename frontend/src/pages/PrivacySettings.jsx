import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Eye, Globe, Lock, CheckCircle, ChevronRight } from 'lucide-react';

export default function PrivacySettings() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // public, friends, private
    showRentalHistory: true,
    showReviews: true,
    showFavorites: true,
    showLocation: 'city', // city, region, hidden
    allowMessagesFrom: 'everyone', // everyone, verified, none
    activityStatus: true,
    searchIndexing: true,
    analyticsTracking: true,
    personalizedAds: false,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <span style={{ fontWeight: 700, fontSize: 18 }}>Privacy Settings</span>
      </div>

      <div style={{ padding: '20px' }}>
        {saved && (
          <div style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
            background: 'var(--success)', color: 'white', padding: '12px 24px', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <CheckCircle size={18} /> Privacy settings saved
          </div>
        )}

        {/* Profile Visibility */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={20} color="var(--ink-3)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Profile Visibility</p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Who can see your profile</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {[
              { value: 'public', label: 'Public', desc: 'Anyone on Rentify can see your profile', icon: Globe },
              { value: 'friends', label: 'Connections Only', desc: 'Only people you\'ve rented with or messaged', icon: User },
              { value: 'private', label: 'Private', desc: 'Only you can see your profile', icon: Lock },
            ].map(option => (
              <label key={option.value} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px', borderRadius: 10, marginTop: 12,
                border: `2px solid ${privacy.profileVisibility === option.value ? 'var(--accent)' : 'var(--line-1)'}`,
                background: privacy.profileVisibility === option.value ? 'var(--accent-softer)' : 'var(--surface)',
                cursor: 'pointer',
              }}>
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option.value}
                  checked={privacy.profileVisibility === option.value}
                  onChange={e => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                  style={{ width: 20, height: 20, accentColor: 'var(--accent)' }}
                />
                <option.icon size={20} color={privacy.profileVisibility === option.value ? 'var(--accent)' : 'var(--ink-4)'} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{option.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* What's Visible on Profile */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Eye size={20} color="var(--ink-3)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Profile Content</p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Choose what appears on your public profile</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {[
              { key: 'showRentalHistory', label: 'Rental History', desc: 'Past and current rentals' },
              { key: 'showReviews', label: 'Reviews Received', desc: 'Ratings and reviews from others' },
              { key: 'showFavorites', label: 'Favorite Items', desc: 'Items you\'ve saved' },
            ].map(item => (
              <label key={item.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 0', borderBottom: '1px solid var(--line-2)', cursor: 'pointer',
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy[item.key]}
                  onChange={e => setPrivacy(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ width: 22, height: 22, accentColor: 'var(--accent)' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Location Privacy */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Location Privacy</p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>How precise your location appears</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {[
              { value: 'city', label: 'City Level', desc: 'Show city only (e.g., San Francisco, CA)' },
              { value: 'region', label: 'Region Level', desc: 'Show metro area (e.g., Bay Area)' },
              { value: 'hidden', label: 'Hidden', desc: 'Don\'t show location on profile' },
            ].map(option => (
              <label key={option.value} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px', borderRadius: 10, marginTop: 12,
                border: `2px solid ${privacy.showLocation === option.value ? 'var(--accent)' : 'var(--line-1)'}`,
                background: privacy.showLocation === option.value ? 'var(--accent-softer)' : 'var(--surface)',
                cursor: 'pointer',
              }}>
                <input
                  type="radio"
                  name="showLocation"
                  value={option.value}
                  checked={privacy.showLocation === option.value}
                  onChange={e => setPrivacy(prev => ({ ...prev, showLocation: e.target.value }))}
                  style={{ width: 20, height: 20, accentColor: 'var(--accent)' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{option.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Communication Privacy */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageSquare size={20} color="var(--ink-3)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Messages</p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Who can send you messages</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {[
              { value: 'everyone', label: 'Everyone', desc: 'All Rentify users can message you' },
              { value: 'verified', label: 'Verified Users Only', desc: 'Only users with verified accounts' },
              { value: 'none', label: 'No One', desc: 'Disable direct messages entirely' },
            ].map(option => (
              <label key={option.value} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px', borderRadius: 10, marginTop: 12,
                border: `2px solid ${privacy.allowMessagesFrom === option.value ? 'var(--accent)' : 'var(--line-1)'}`,
                background: privacy.allowMessagesFrom === option.value ? 'var(--accent-softer)' : 'var(--surface)',
                cursor: 'pointer',
              }}>
                <input
                  type="radio"
                  name="allowMessagesFrom"
                  value={option.value}
                  checked={privacy.allowMessagesFrom === option.value}
                  onChange={e => setPrivacy(prev => ({ ...prev, allowMessagesFrom: e.target.value }))}
                  style={{ width: 20, height: 20, accentColor: 'var(--accent)' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{option.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Data & Analytics */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Data & Analytics</p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Control how your data is used</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {[
              { key: 'activityStatus', label: 'Activity Status', desc: 'Show when you\'re online to other users' },
              { key: 'searchIndexing', label: 'Search Indexing', desc: 'Allow your profile to appear in search results' },
              { key: 'analyticsTracking', label: 'Analytics Tracking', desc: 'Help us improve Rentify with usage data' },
              { key: 'personalizedAds', label: 'Personalized Ads', desc: 'Show relevant ads based on your activity' },
            ].map(item => (
              <label key={item.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 0', borderBottom: '1px solid var(--line-2)', cursor: 'pointer',
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy[item.key]}
                  onChange={e => setPrivacy(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ width: 22, height: 22, accentColor: 'var(--accent)' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Data Management Links */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Your Data</p>
          </div>
          <button onClick={() => navigate('/data-permissions')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'var(--surface)', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={18} color="var(--ink-3)" />
            </div>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--ink-1)' }}>Data Permissions</span>
            <ChevronRight size={20} color="var(--ink-4)" />
          </button>
          <div style={{ borderTop: '1px solid var(--line-2)' }} />
          <button onClick={() => navigate('/download-data')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'var(--surface)', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--ink-1)' }}>Download My Data</span>
            <ChevronRight size={20} color="var(--ink-4)" />
          </button>
        </div>

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}

function MessageSquare(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function Shield(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
