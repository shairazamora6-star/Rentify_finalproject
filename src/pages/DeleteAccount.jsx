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
    <div className="page" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}><ChevronLeft size={24} color="#0F172A" /></button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Delete Account</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #FECACA', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ background: '#FEF2F2', padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={24} color="#DC2626" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#991B1B' }}>This action is permanent</p>
              <p style={{ fontSize: 13, color: '#B91C1C', marginTop: 2, lineHeight: 1.5 }}>Once your account is deleted, all your data will be removed within 30 days. This cannot be undone.</p>
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>When you delete your account:</p>
            {[
              { icon: User, text: 'Your profile and personal information are removed' },
              { icon: XCircle, text: 'Active rentals are cancelled and refunded' },
              { icon: XCircle, text: 'Messages and reviews you posted are removed' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Icon size={16} color="#DC2626" />
                  <span style={{ fontSize: 13, color: '#334155' }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 20, marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
            Why are you leaving? <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Help us improve — any feedback is welcome"
            style={{
              width: '100%', minHeight: 70, padding: 12, borderRadius: 10,
              border: '1.5px solid #E2E8F0', background: '#F8FAFC',
              fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => { setConfirmed(e.target.checked); setError(''); }}
            style={{ width: 20, height: 20, accentColor: '#DC2626', marginTop: 1, flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
            I understand that <strong>deleting my account is permanent</strong> and that all associated data will be removed within 30 days.
          </span>
        </label>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: 15, borderRadius: 14, border: 'none',
            background: confirmed ? '#DC2626' : '#F87171', color: 'white',
            fontSize: 15, fontWeight: 700, cursor: confirmed ? 'pointer' : 'not-allowed',
            opacity: confirmed ? 1 : 0.6, transition: 'all 0.15s',
          }}
        >
          Delete my account
        </button>

        <button onClick={() => navigate('/account-settings')} style={{
          width: '100%', marginTop: 10, padding: 15, borderRadius: 14,
          border: '1.5px solid #E2E8F0', background: 'white',
          color: '#0F172A', fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
