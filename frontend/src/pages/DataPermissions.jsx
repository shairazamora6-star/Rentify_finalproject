import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Database, Download, Trash2, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

export default function DataPermissions() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTyping, setDeleteTyping] = useState('');

  const [permissions, setPermissions] = useState({
    usageAnalytics: true,
    crashReporting: true,
    personalizedExperience: true,
    marketingEmails: false,
    thirdPartySharing: false,
    locationTracking: true,
    contactSync: false,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (deleteTyping !== 'DELETE') return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    setShowDeleteConfirm(false);
    navigate('/delete-account-success');
  };

  return (
    <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
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
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink-1)' }}>Data Permissions</span>
      </div>

      <div style={{ padding: '20px' }}>
        {saved && (
          <div style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
            background: '#087F73', color: 'white', padding: '12px 24px', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <CheckCircle size={18} /> Preferences saved
          </div>
        )}

        {/* Data Collection */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Database size={20} color="var(--ink-3)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Data Collection</p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Control what data we collect</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {[
              {
                key: 'usageAnalytics',
                label: 'Usage Analytics',
                desc: 'Anonymous data about how you use Rentify to improve the app',
                required: false,
                icon: CheckCircle,
              },
              {
                key: 'crashReporting',
                label: 'Crash Reporting',
                desc: 'Automatic crash logs to help us fix bugs quickly',
                required: false,
                icon: AlertCircle,
              },
              {
                key: 'personalizedExperience',
                label: 'Personalized Experience',
                desc: 'Use your activity to customize recommendations and search results',
                required: false,
                icon: CheckCircle,
              },
              {
                key: 'locationTracking',
                label: 'Location Tracking',
                desc: 'Precise location for nearby items and distance calculations',
                required: true,
                icon: CheckCircle,
              },
            ].map(item => (
              <label key={item.key} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 0', borderBottom: '1px solid var(--line-2)', cursor: item.required ? 'default' : 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!item.required) e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { if (!item.required) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-1)' }}>{item.label}</p>
                    {item.required && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--warning)', background: '#FFFBEB', padding: '2px 6px', borderRadius: 4 }}>Required</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.desc}</p>
                </div>
                {item.required ? (
                  <input type="checkbox" checked disabled style={{ width: 22, height: 22, accentColor: 'var(--accent)', opacity: 0.5 }} />
                ) : (
                  <input
                    type="checkbox"
                    checked={permissions[item.key]}
                    onChange={e => setPermissions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    style={{ width: 22, height: 22, accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Data Sharing */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M13 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8" />
                  <path d="M6 15v-3a3 3 0 0 1 3-3h3" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Data Sharing</p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Control how your data is shared</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {[
              {
                key: 'marketingEmails',
                label: 'Marketing Communications',
                desc: 'Receive promotional emails about new features and offers',
              },
              {
                key: 'thirdPartySharing',
                label: 'Third-Party Analytics',
                desc: 'Share anonymized data with analytics partners (Google, Mixpanel)',
              },
              {
                key: 'contactSync',
                label: 'Contact Sync',
                desc: 'Access your contacts to find friends on Rentify',
              },
            ].map(item => (
              <label key={item.key} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 0', borderBottom: '1px solid var(--line-2)', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={permissions[item.key]}
                  onChange={e => setPermissions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ width: 22, height: 22, accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Data Management Actions */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Your Data</p>
          </div>

          <button onClick={() => navigate('/download-data')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'none', cursor: 'pointer', textAlign: 'left',
            borderBottom: '1px solid var(--line-2)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--accent-softer)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Download size={18} color="var(--accent)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 2 }}>
                Download My Data
              </p>
              <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                Get a copy of all your Rentify data (profile, rentals, messages, reviews)
              </p>
            </div>
            <ChevronRight size={20} color="var(--line-1)" />
          </button>

          <button onClick={() => navigate('/delete-account-request')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'none', cursor: 'pointer', textAlign: 'left',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-soft)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--danger-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trash2 size={18} color="var(--danger)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--danger)', marginBottom: 2 }}>
                Request Data Deletion
              </p>
              <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                Permanently delete your account and all associated data
              </p>
            </div>
            <ChevronRight size={20} color="var(--line-1)" />
          </button>
        </div>

        {/* Legal Links */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Legal</p>
          </div>
          {[
            { label: 'Privacy Policy', path: '/privacy-policy' },
            { label: 'Terms of Service', path: '/terms-of-service' },
            { label: 'Cookie Policy', path: '/cookie-policy' },
            { label: 'Data Processing Addendum', path: '/dpa' },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
              background: 'none', cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--ink-1)' }}>{item.label}</span>
              <ChevronRight size={20} color="var(--line-1)" />
            </button>
          ))}
        </div>

        {/* Save Button */}
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}
