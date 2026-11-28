import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle, Loader2, Paperclip, X, FileText } from 'lucide-react';

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
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAttachFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files || []);
      setAttachments(prev => [...prev, ...files.map(f => ({ name: f.name, size: f.size }))]);
    };
    input.click();
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) => {
    if (!Number.isFinite(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

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
      <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
        <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Request Sent</span>
        </div>
        <div style={{ textAlign: 'center', padding: '70px 24px' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={42} color="#16A34A" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink-1)', marginBottom: 8 }}>We're on it!</h2>
          <p style={{ color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: '0 auto 28px' }}>
            Your request has been submitted. Our support team usually replies within <strong>24 hours</strong>.
          </p>
          <button onClick={() => navigate('/help-support')} className="btn-primary" style={{ width: '100%' }}>Back to Help</button>
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
        <span style={{ fontWeight: 700, fontSize: 18 }}>Submit a Request</span>
      </div>

      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 20 }}>
          Describe your issue and we'll get back to you by email within 24 hours.
        </p>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 8 }}>Topic</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setError(''); }}
              style={{
                padding: '8px 14px', borderRadius: 'var(--radius-xl)', fontSize: 13, fontWeight: 600,
                border: category === c.id ? '2px solid var(--accent)' : '1.5px solid var(--line-1)',
                background: category === c.id ? 'var(--accent-softer)' : 'var(--surface)',
                color: category === c.id ? 'var(--accent)' : 'var(--ink-2)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; }}
            >{c.label}</button>
          ))}
        </div>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 8 }}>Subject</label>
        <input
          value={subject}
          onChange={e => { setSubject(e.target.value); setError(''); }}
          placeholder="Brief summary of your issue"
          style={{
            width: '100%', fontSize: 15, borderRadius: 'var(--radius-md)', padding: 13,
            border: '1.5px solid var(--line-1)', background: 'var(--surface-2)',
            outline: 'none', boxSizing: 'border-box', marginBottom: 16,
          }}
        />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 8 }}>Message</label>
        <textarea
          value={message}
          onChange={e => { setMessage(e.target.value); setError(''); }}
          placeholder="Tell us what happened, including dates and item links if relevant…"
          style={{
            width: '100%', minHeight: 110, fontSize: 15, borderRadius: 'var(--radius-md)', padding: 13,
            border: '1.5px solid var(--line-1)', background: 'var(--surface-2)',
            outline: 'none', boxSizing: 'border-box', resize: 'vertical',
            fontFamily: 'inherit', marginBottom: 16,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <button
            onClick={handleAttachFiles}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px',
              borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--ink-2)', background: 'var(--surface-2)',
              fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', cursor: 'pointer',
              alignSelf: 'flex-start',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.borderColor = 'var(--accent-line)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; }}
          >
            <Paperclip size={14} /> Attach files
          </button>

          {attachments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {attachments.map((file, index) => (
                <div key={`${file.name}-${index}`} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                }}>
                  <FileText size={14} color="var(--ink-3)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-1)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>{formatSize(file.size)}</p>
                  </div>
                  <button onClick={() => handleRemoveAttachment(index)} style={{ padding: 4, cursor: 'pointer', background: 'none', border: 'none' }}>
                    <X size={14} color="var(--ink-4)" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-line)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16 }}>
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
