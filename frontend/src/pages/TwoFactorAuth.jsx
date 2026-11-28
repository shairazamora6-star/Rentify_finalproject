import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, QrCode, Smartphone, MessageSquare, CheckCircle } from 'lucide-react';

export default function TwoFactorAuth() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [method, setMethod] = useState('app');

  return (
    <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Two-Factor Authentication</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: enabled ? 'var(--success-light)' : 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <ShieldCheck size={24} color={enabled ? 'var(--success)' : 'var(--ink-4)'} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 2 }}>
                  {enabled ? 'Protection enabled' : 'Protect your account'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
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
                  background: enabled ? 'linear-gradient(135deg, #3978D5, #73A7E5)' : 'var(--line-1)',
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
          <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line-1)', padding: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Verification Method</p>

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
                  border: `2px solid ${method === id ? 'var(--accent)' : 'var(--line-1)'}`,
                  background: method === id ? 'var(--accent-softer)' : 'var(--surface)',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: method === id ? 'var(--accent-soft)' : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={method === id ? 'var(--accent)' : 'var(--ink-3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 2 }}>{title}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{desc}</p>
                </div>
                {method === id && <CheckCircle size={20} color="var(--accent)" />}
              </button>
            ))}

            <div style={{
              background: 'var(--surface-2)', borderRadius: 12, padding: 14,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <QrCode size={40} color="var(--ink-1)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>Scan with your app</p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>rentify.app/2fa/setup</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
