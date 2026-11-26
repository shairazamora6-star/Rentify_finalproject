import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, QrCode, Smartphone, MessageSquare, CheckCircle } from 'lucide-react';

export default function TwoFactorAuth() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [method, setMethod] = useState('app');

  return (
    <div className="page" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}><ChevronLeft size={24} color="#0F172A" /></button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Two-Factor Authentication</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: enabled ? '#ECFDF5' : '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <ShieldCheck size={24} color={enabled ? '#16A34A' : '#94A3B8'} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                  {enabled ? 'Protection enabled' : 'Protect your account'}
                </p>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                  {enabled
                    ? 'Your account requires a verification code in addition to your password.'
                    : 'Add an extra layer of security to your sign-in.'}
                </p>
              </div>
              {/* Toggle */}
              <button
                onClick={() => setEnabled(!enabled)}
                style={{
                  width: 52, height: 30, borderRadius: 15, position: 'relative',
                  background: enabled ? 'linear-gradient(135deg, #2563EB, #4F46E5)' : '#E2E8F0',
                  transition: 'background 0.2s', flexShrink: 0, border: 'none', cursor: 'pointer',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3, left: enabled ? 25 : 3,
                  width: 24, height: 24, borderRadius: '50%', background: 'white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)', transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>
        </div>

        {enabled && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Verification Method</p>

            {[
              { id: 'app', icon: Smartphone, title: 'Authenticator App', desc: 'Enter a code from Google Authenticator or similar' },
              { id: 'sms', icon: MessageSquare, title: 'Text Message (SMS)', desc: 'Codes sent to your phone number on file' },
            ].map(({ id, icon: Icon, title, desc }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: 14, borderRadius: 12, marginBottom: 10, textAlign: 'left',
                  border: `2px solid ${method === id ? '#2563EB' : '#E2E8F0'}`,
                  background: method === id ? '#EFF6FF' : 'white',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: method === id ? '#DBEAFE' : '#F8FAFC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={method === id ? '#2563EB' : '#64748B'} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{title}</p>
                  <p style={{ fontSize: 12, color: '#64748B' }}>{desc}</p>
                </div>
                {method === id && <CheckCircle size={20} color="#2563EB" />}
              </button>
            ))}

            <div style={{
              background: '#F8FAFC', borderRadius: 12, padding: 14,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <QrCode size={40} color="#0F172A" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Scan with your app</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>rentify.app/2fa/setup</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
