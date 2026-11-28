import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Clock, CheckCircle } from 'lucide-react';

export default function ActivityStatus() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState('on'); // on, off
  const [customMessage, setCustomMessage] = useState('Online now');
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('Online now');
  const [showCustom, setShowCustom] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const quickMessages = [
    'Available',
    'On the go',
    'At work',
    'Taking a break',
    'Offline',
  ];

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
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink-1)' }}>Activity Status</span>
      </div>

      <div style={{ padding: '20px' }}>
        {saved && (
          <div style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
            background: '#087F73', color: 'white', padding: '12px 24px', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <CheckCircle size={18} /> Status saved
          </div>
        )}

        {/* Main Toggle */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
            background: status === 'on' ? 'var(--accent-softer)' : 'var(--surface-2)',
            border: `3px solid ${status === 'on' ? 'var(--accent)' : 'var(--line-1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {status === 'on' ? (
              <Eye size={36} color="var(--accent)" />
            ) : (
              <EyeOff size={36} color="var(--ink-4)" />
            )}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--ink-1)' }}>
            {status === 'on' ? 'You\'re Online' : 'You\'re Invisible'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 20 }}>
            {status === 'on'
              ? 'Others can see you\'re active and your current message'
              : 'No one can see when you\'re last seen or your activity'}
          </p>

          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            cursor: 'pointer', padding: '12px 20px', borderRadius: 10,
            border: '2px solid var(--line-1)', background: 'var(--surface)', width: '100%',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-1)' }}>
              {status === 'on' ? 'Go Offline' : 'Go Online'}
            </span>
            <div style={{
              width: 48, height: 28, borderRadius: 14,
              background: status === 'on' ? 'var(--accent)' : 'var(--line-1)',
              position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'white', position: 'absolute',
                top: 3, left: status === 'on' ? 23 : 3,
                transition: 'left 0.2s',
              }} />
            </div>
            <input
              type="checkbox"
              checked={status === 'on'}
              onChange={e => setStatus(e.target.checked ? 'on' : 'off')}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {status === 'on' && (
          <>
            {/* Current Status Display */}
            <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', padding: 20, marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Your Status
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                background: 'var(--surface-2)', borderRadius: 10, marginBottom: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3978D5, #73A7E5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 16,
                }}>JM</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 2 }}>
                    John Mitchell
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{customMessage || 'Online now'}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setShowInput(true); setInputValue(customMessage || 'Online now'); }}
                  style={{ padding: 8, background: 'var(--accent-softer)', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setShowCustom(!showCustom)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 8,
                  border: '1px dashed var(--line-1)', background: 'transparent',
                  fontSize: 14, color: 'var(--ink-3)', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; e.currentTarget.style.color = 'var(--ink-3)'; }}
              >
                {showCustom ? 'Cancel Custom Message' : '+ Customize Status Message'}
              </button>

              {showCustom && (
                <div style={{ marginTop: 12 }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Enter custom message..."
                    maxLength={30}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 8,
                      border: '1px solid var(--line-1)', fontSize: 14, boxSizing: 'border-box',
                      background: 'var(--surface)', color: 'var(--ink-1)', outline: 'none',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; }}
                  />
                  <p style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 6, textAlign: 'right' }}>
                    {inputValue.length}/30 characters
                  </p>
                </div>
              )}
            </div>

            {/* Quick Presets */}
            <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', margin: '16px 20px 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Quick Presets
              </p>
              {quickMessages.map(msg => (
                <button
                  key={msg}
                  onClick={() => {
                    const nextStatus = msg === 'Offline' ? 'off' : 'on';
                    setStatus(nextStatus);
                    setCustomMessage(msg);
                    if (showCustom) { setInputValue(msg); setShowCustom(false); }
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px', borderBottom: '1px solid var(--line-2)',
                    background: customMessage === msg ? 'var(--accent-softer)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (customMessage !== msg) e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={e => { if (customMessage !== msg) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Clock size={18} color={customMessage === msg ? 'var(--accent)' : 'var(--ink-4)'} />
                  <span style={{ flex: 1, fontSize: 15, fontWeight: customMessage === msg ? 600 : 500, color: customMessage === msg ? 'var(--accent)' : 'var(--ink-1)' }}>
                    {msg}
                  </span>
                  {customMessage === msg && <CheckCircle size={18} color="var(--accent)" />}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Visibility Options */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line-1)', overflow: 'hidden', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', margin: '16px 20px 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Who Can See My Status
          </p>
          {[
            { label: 'Everyone', desc: 'All Rentify users' },
            { label: 'Connections Only', desc: 'People you\'ve messaged or rented with' },
            { label: 'No One', desc: 'Never show your status' },
          ].map(opt => (
            <label key={opt.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 20px', borderBottom: '1px solid var(--line-2)', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <input
                type="radio"
                name="visibility"
                style={{ width: 20, height: 20, accentColor: 'var(--accent)' }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-1)' }}>{opt.label}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Info Card */}
        <div style={{
          padding: 16, background: 'var(--accent-softer)', borderRadius: 12,
          border: '1px solid var(--accent-line)', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>
                Status Privacy
              </p>
              <p style={{ fontSize: 12, color: 'var(--accent)' }}>
                Even when offline, others may still see your recent profile views or rental history for up to 24 hours after logging back in.
              </p>
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
