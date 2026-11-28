import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, KeyRound, ShieldCheck, CheckCircle } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const inputStyle = {
    fontSize: 15, borderRadius: 12, padding: '13px 42px 13px 44px', width: '100%',
    border: '1.5px solid var(--line-1)', background: 'var(--surface-2)', outline: 'none',
    boxSizing: 'border-box', color: 'var(--ink-1)', transition: 'border-color 0.15s',
  };

  const handleSubmit = () => {
    if (!current) { setError('Please enter your current password'); return; }
    if (next.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (next !== confirm) { setError('Passwords do not match'); return; }
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
        <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Change Password</span>
        </div>
        <div style={{ textAlign: 'center', padding: '70px 24px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Password Updated</h2>
          <p style={{ color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.6, maxWidth: 260, margin: '0 auto 28px' }}>
            Your password has been changed. Use it the next time you sign in.
          </p>
          <button onClick={() => navigate(-1)} className="btn-primary" style={{ width: '100%' }}>Back to Settings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Change Password</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line-1)', padding: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Update Password</p>

          {[
            { label: 'Current Password', value: current, set: setCurrent, ph: 'Enter current password' },
            { label: 'New Password', value: next, set: setNext, ph: 'Min. 6 characters' },
            { label: 'Confirm New Password', value: confirm, set: setConfirm, ph: 'Repeat new password' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 6 }}>{f.label}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><KeyRound size={16} color="var(--ink-4)" /></span>
                <input
                  type={show ? 'text' : 'password'}
                  value={f.value}
                  onChange={e => { f.set(e.target.value); setError(''); }}
                  placeholder={f.ph}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = ''; }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  {show ? <EyeOff size={16} color="var(--ink-3)" /> : <Eye size={16} color="var(--ink-4)" />}
                </button>
              </div>
            </div>
          ))}

          {error && (
            <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-line)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 500 }}>{error}</p>
            </div>
          )}

          <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', borderRadius: 12 }}>Save New Password</button>
        </div>

        <div style={{ background: 'var(--accent-softer)', borderRadius: 14, padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <ShieldCheck size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 2 }}>Security tip</p>
            <p style={{ fontSize: 12, color: 'var(--accent)', opacity: 0.8, lineHeight: 1.5 }}>Use a unique password with 12+ characters. Last changed 3 months ago.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
