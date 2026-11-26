import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle, Loader2, Paperclip } from 'lucide-react';

const categories = [
  { id: 'booking', label: 'Booking issue' },
  { id: 'payment', label: 'Payment' },
  { id: 'item', label: 'Item condition' },
  { id: 'safety', label: 'Safety & trust' },
  { id: 'other', label: 'Something else' },
];

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!category || !subject || !message) {
      setError('Please fill in category, subject and your message.');
      return;
    }
    setError('');
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="page" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Request Sent</span>
        </div>
        <div style={{ textAlign: 'center', padding: '70px 24px' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={42} color="#16A34A" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>We're on it!</h2>
          <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: '0 auto 28px' }}>
            Your request has been submitted. Our support team usually replies within <strong>24 hours</strong>.
          </p>
          <button onClick={() => navigate('/help-support')} className="btn-primary" style={{ width: '100%' }}>Back to Help</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}><ChevronLeft size={24} color="#0F172A" /></button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Submit a Request</span>
      </div>

      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5, marginBottom: 20 }}>
          Describe your issue and we'll get back to you by email within 24 hours.
        </p>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Topic</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setError(''); }}
              style={{
                padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: category === c.id ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                background: category === c.id ? '#EFF6FF' : 'white',
                color: category === c.id ? '#2563EB' : '#334155',
                cursor: 'pointer',
              }}
            >{c.label}</button>
          ))}
        </div>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Subject</label>
        <input
          value={subject}
          onChange={e => { setSubject(e.target.value); setError(''); }}
          placeholder="Brief summary of your issue"
          style={{
            width: '100%', fontSize: 15, borderRadius: 12, padding: 13,
            border: '1.5px solid #E2E8F0', background: '#F8FAFC',
            outline: 'none', boxSizing: 'border-box', marginBottom: 16,
          }}
        />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Message</label>
        <textarea
          value={message}
          onChange={e => { setMessage(e.target.value); setError(''); }}
          placeholder="Tell us what happened, including dates and item links if relevant…"
          style={{
            width: '100%', minHeight: 110, fontSize: 15, borderRadius: 12, padding: 13,
            border: '1.5px solid #E2E8F0', background: '#F8FAFC',
            outline: 'none', boxSizing: 'border-box', resize: 'vertical',
            fontFamily: 'inherit', marginBottom: 16,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
            borderRadius: 10, border: '1.5px dashed #CBD5E1', background: '#F8FAFC',
            fontSize: 12, fontWeight: 600, color: '#64748B', cursor: 'pointer',
          }}>
            <Paperclip size={14} /> Attach files
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={sending}
          className="btn-primary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: sending ? 0.7 : 1 }}
        >
          {sending ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
          {sending ? 'Sending…' : 'Send Request'}
        </button>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
