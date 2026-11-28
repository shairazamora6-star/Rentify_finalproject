import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, XCircle, User } from 'lucide-react';

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!confirmed) {
      setError('You must confirm that you understand this action is permanent.');
      return;
    }
    navigate('/delete-account-success');
  };

  return (
    <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink-1)' }}>Delete Account</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--danger-line)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ background: 'var(--danger-soft)', padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--danger-softer)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={24} color="var(--danger)" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--danger)' }}>This action is permanent</p>
              <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 2, lineHeight: 1.5 }}>Once your account is deleted, all your data will be removed within 30 days. This cannot be undone.</p>
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16 }}>When you delete your account:</p>
            {[
              { icon: User, text: 'Your profile and personal information are removed' },
              { icon: XCircle, text: 'Active rentals are cancelled and refunded' },
              { icon: XCircle, text: 'Messages and reviews you posted are removed' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Icon size={16} color="var(--danger)" />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line-1)', padding: 20, marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 6 }}>
            Why are you leaving? <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Help us improve — any feedback is welcome"
            style={{
              width: '100%', minHeight: 70, padding: 12, borderRadius: 10,
              border: '1.5px solid var(--line-1)', background: 'var(--surface-2)',
              fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
              outline: 'none', boxSizing: 'border-box', color: 'var(--ink-1)',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--line-1)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => { setConfirmed(e.target.checked); setError(''); }}
            style={{ width: 20, height: 20, accentColor: 'var(--danger)', marginTop: 1, flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            I understand that <strong>deleting my account is permanent</strong> and that all associated data will be removed within 30 days.
          </span>
        </label>

        {error && (
          <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-line)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: 15, borderRadius: 14, border: 'none',
            background: confirmed ? 'var(--danger)' : 'var(--danger-soft)', color: confirmed ? 'white' : 'var(--danger)',
            fontSize: 15, fontWeight: 700, cursor: confirmed ? 'pointer' : 'not-allowed',
            opacity: confirmed ? 1 : 0.6, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (confirmed) e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = confirmed ? '1' : '0.6'; }}
        >
          Delete my account
        </button>

        <button onClick={() => navigate('/account-settings')} style={{
          width: '100%', marginTop: 10, padding: 15, borderRadius: 14,
          border: '1.5px solid var(--line-1)', background: 'var(--surface)',
          color: 'var(--ink-1)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
