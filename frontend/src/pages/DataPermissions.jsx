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
        <span style={{ fontWeight: 700, fontSize: 18 }}>Data Permissions</span>
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
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Database size={20} color="#64748B" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Data Collection</p>
                <p style={{ fontSize: 13, color: '#64748B' }}>Control what data we collect</p>
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
                padding: '16px 0', borderBottom: '1px solid #F1F5F9', cursor: item.required ? 'default' : 'pointer',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{item.label}</p>
                    {item.required && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#F59E0B', background: '#FFFBEB', padding: '2px 6px', borderRadius: 4 }}>Required</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B' }}>{item.desc}</p>
                </div>
                {item.required ? (
                  <input type="checkbox" checked disabled style={{ width: 22, height: 22, accentColor: '#2563EB', opacity: 0.5 }} />
                ) : (
                  <input
                    type="checkbox"
                    checked={permissions[item.key]}
                    onChange={e => setPermissions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    style={{ width: 22, height: 22, accentColor: '#2563EB' }}
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Data Sharing */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M13 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8" />
                  <path d="M6 15v-3a3 3 0 0 1 3-3h3" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Data Sharing</p>
                <p style={{ fontSize: 13, color: '#64748B' }}>Control how your data is shared</p>
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
                padding: '16px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748B' }}>{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={permissions[item.key]}
                  onChange={e => setPermissions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ width: 22, height: 22, accentColor: '#2563EB' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Data Management Actions */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Your Data</p>
          </div>

          <button onClick={() => navigate('/download-data')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'none', cursor: 'pointer', textAlign: 'left',
            borderBottom: '1px solid #F1F5F9',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Download size={18} color="#2563EB" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#0F172A', marginBottom: 2 }}>
                Download My Data
              </p>
              <p style={{ fontSize: 12, color: '#64748B' }}>
                Get a copy of all your Rentify data (profile, rentals, messages, reviews)
              </p>
            </div>
            <ChevronRight size={20} color="#CBD5E1" />
          </button>

          <button onClick={() => navigate('/delete-account-request')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', background: 'none', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trash2 size={18} color="#EF4444" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#EF4444', marginBottom: 2 }}>
                Request Data Deletion
              </p>
              <p style={{ fontSize: 12, color: '#64748B' }}>
                Permanently delete your account and all associated data
              </p>
            </div>
            <ChevronRight size={20} color="#CBD5E1" />
          </button>
        </div>

        {/* Legal Links */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Legal</p>
          </div>
          {[
            { label: 'Privacy Policy', path: '/privacy-policy' },
            { label: 'Terms of Service', path: '/terms-of-service' },
            { label: 'Cookie Policy', path: '/cookie-policy' },
            { label: 'Data Processing Addendum', path: '/dpa' },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid #F1F5F9',
              background: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{item.label}</span>
              <ChevronRight size={20} color="#CBD5E1" />
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