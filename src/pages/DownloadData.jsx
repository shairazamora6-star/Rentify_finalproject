import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, CheckCircle, Loader2, FileText } from 'lucide-react';

const datasets = [
  { id: 'profile', label: 'Profile information', desc: 'Name, email, avatar, preferences' },
  { id: 'rentals', label: 'Rental history', desc: 'All active, completed and cancelled rentals' },
  { id: 'reviews', label: 'Reviews & ratings', desc: 'Reviews you wrote and received' },
  { id: 'messages', label: 'Message history', desc: 'All conversations with other members' },
  { id: 'activity', label: 'Activity log', desc: 'Sign-in events, searches and browsing' },
];

export default function DownloadData() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(['profile', 'rentals', 'reviews']);
  const [status, setStatus] = useState('idle'); // idle | preparing | ready

  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const startDownload = () => {
    if (status === 'preparing') return;
    setStatus('preparing');
    setTimeout(() => setStatus('ready'), 1800);
  };

  const downloadCount = selected.length;

  return (
    <div className="page" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}><ChevronLeft size={24} color="#0F172A" /></button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Download My Data</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: '#EFF6FF', borderRadius: 14, padding: 14, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.5 }}>
            Export a copy of your data in <strong>JSON</strong> format. The file includes everything Rentify stores on your behalf, in a machine-readable format.
          </p>
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Select Data</p>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 20 }}>
          {datasets.map((ds, i) => {
            const on = selected.includes(ds.id);
            return (
              <button
                key={ds.id}
                onClick={() => toggle(ds.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: 16, textAlign: 'left', background: 'none', cursor: 'pointer',
                  borderBottom: i < datasets.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  border: on ? 'none' : '2px solid #CBD5E1',
                  background: on ? 'linear-gradient(135deg, #2563EB, #4F46E5)' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {on && <CheckCircle size={14} color="white" />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{ds.label}</p>
                  <p style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{ds.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {status === 'ready' ? (
          <div style={{ background: '#ECFDF5', borderRadius: 14, border: '1px solid #BBF7D0', padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FileText size={28} color="#16A34A" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>rentify-export.json</p>
                <p style={{ fontSize: 12, color: '#15803D' }}>{downloadCount} datasets · generated just now</p>
              </div>
              <button
                onClick={() => navigate('/data-permissions')}
                style={{
                  padding: '10px 16px', borderRadius: 10, border: 'none',
                  background: '#16A34A', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >Done</button>
            </div>
          </div>
        ) : (
          <button
            onClick={startDownload}
            disabled={downloadCount === 0 || status === 'preparing'}
            style={{
              width: '100%', padding: 15, borderRadius: 14, border: 'none',
              background: downloadCount === 0 ? '#E2E8F0' : 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              color: downloadCount === 0 ? '#94A3B8' : 'white',
              fontSize: 15, fontWeight: 700,
              cursor: downloadCount === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {status === 'preparing' ? (
              <> <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Preparing your export… </>
            ) : (
              <> <Download size={18} /> Prepare export ({downloadCount}) </>
            )}
          </button>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
