import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Clock } from 'lucide-react';

export default function DeleteAccountSuccess() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle size={44} color="#16A34A" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Account Deletion Requested</h2>
          <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: '0 auto 28px' }}>
            Your account has been scheduled for deletion. A confirmation email is on its way — follow the link to cancel within 30 days if you change your mind.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto 32px' }}>
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: 14, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <Mail size={20} color="#2563EB" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Confirmation email sent</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>john.mitchell@email.com</p>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: 14, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <Clock size={20} color="#92400E" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Deletion window</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>Permanent removal in 30 days</p>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: '100%', maxWidth: 300 }}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
