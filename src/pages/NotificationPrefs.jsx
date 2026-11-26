import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, BellOff, Mail, MessageSquare, Smartphone, Save, CheckCircle } from 'lucide-react';

export default function NotificationPrefs() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [prefs, setPrefs] = useState({
    // Push notifications
    pushRentalUpdates: true,
    pushMessages: true,
    pushOffers: true,
    pushReminders: true,
    pushPromotions: false,
    // Email notifications
    emailRentalUpdates: true,
    emailMessages: true,
    emailOffers: true,
    emailReminders: true,
    emailPromotions: false,
    emailWeeklyDigest: false,
    // SMS notifications
    smsRentalUpdates: false,
    smsUrgentOnly: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      title: 'Push Notifications',
      icon: Bell,
      items: [
        { key: 'pushRentalUpdates', label: 'Rental Updates', desc: 'Booking confirmations, extensions, returns' },
        { key: 'pushMessages', label: 'New Messages', desc: 'Chat messages from owners and renters' },
        { key: 'pushOffers', label: 'Offers & Deals', desc: 'Special offers on items you viewed' },
        { key: 'pushReminders', label: 'Reminders', desc: 'Upcoming rentals, return deadlines' },
        { key: 'pushPromotions', label: 'Promotions', desc: 'Marketing campaigns and announcements' },
      ],
    },
    {
      title: 'Email Notifications',
      icon: Mail,
      items: [
        { key: 'emailRentalUpdates', label: 'Rental Updates', desc: 'Booking confirmations, extensions, returns' },
        { key: 'emailMessages', label: 'New Messages', desc: 'Chat messages from owners and renters' },
        { key: 'emailOffers', label: 'Offers & Deals', desc: 'Special offers on items you viewed' },
        { key: 'emailReminders', label: 'Reminders', desc: 'Upcoming rentals, return deadlines' },
        { key: 'emailPromotions', label: 'Promotions', desc: 'Marketing campaigns and announcements' },
        { key: 'emailWeeklyDigest', label: 'Weekly Digest', desc: 'Summary of your activity each week' },
      ],
    },
    {
      title: 'SMS Notifications',
      icon: Smartphone,
      items: [
        { key: 'smsRentalUpdates', label: 'Rental Updates', desc: 'Critical rental status changes only' },
        { key: 'smsUrgentOnly', label: 'Urgent Only', desc: 'Only send SMS for time-sensitive alerts' },
      ],
    },
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
        <span style={{ fontWeight: 700, fontSize: 18 }}>Notifications</span>
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

        {/* Master Toggle */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 16, marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: '#F8FAFC',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={20} color="#64748B" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>All Notifications</p>
              <p style={{ fontSize: 13, color: '#64748B' }}>Master switch for all notification channels</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.pushRentalUpdates || prefs.emailRentalUpdates}
              onChange={e => {
                const checked = e.target.checked;
                setPrefs(prev => ({
                  ...prev,
                  pushRentalUpdates: checked,
                  pushMessages: checked,
                  pushOffers: checked,
                  pushReminders: checked,
                  pushPromotions: checked,
                  emailRentalUpdates: checked,
                  emailMessages: checked,
                  emailOffers: checked,
                  emailReminders: checked,
                  emailPromotions: checked,
                  emailWeeklyDigest: checked,
                  smsRentalUpdates: checked,
                }));
              }}
              style={{ width: 24, height: 24, accentColor: '#2563EB' }}
            />
          </label>
        </div>

        {/* Sections */}
        {sections.map(section => (
          <div key={section.title} style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 4px', marginBottom: 12,
            }}>
              <section.icon size={18} color="#64748B" />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{section.title}</h3>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              {section.items.map((item, i) => (
                <label key={item.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', borderBottom: i < section.items.length - 1 ? '1px solid #F1F5F9' : 'none',
                  cursor: 'pointer',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 2 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 12, color: '#64748B' }}>{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    onChange={e => setPrefs(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    style={{ width: 22, height: 22, accentColor: '#2563EB', cursor: 'pointer' }}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Quiet Hours */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: '#F8FAFC',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Quiet Hours</p>
              <p style={{ fontSize: 13, color: '#64748B' }}>Silence non-urgent notifications</p>
            </div>
          </div>

          <div className="time-range">
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 4 }}>Start</label>
              <input type="time" defaultValue="22:00" className="input-field" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 4 }}>End</label>
              <input type="time" defaultValue="08:00" className="input-field" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}