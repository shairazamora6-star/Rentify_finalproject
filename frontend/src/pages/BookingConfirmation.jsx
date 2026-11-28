import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockItems } from '../data/mockData';
import { Star, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { items } = useApp();
  const item = items.find(i => i.id === parseInt(id)) || mockItems.find(i => i.id === parseInt(id));

  if (!item) return <div>Item not found</div>;

  return (
    <div className="page" style={{ padding: '0 20px' }}>
      {/* Success Animation Area */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--success-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 8 }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--ink-3)', fontSize: 15 }}>Your reservation has been successful</p>
      </div>

      {/* Item Card */}
      <div style={{
        background: 'var(--surface)', borderRadius: 16, padding: 16,
        border: '1px solid var(--line-1)', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <img src={item.image} alt={item.title}
            style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} />
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 4 }}>{item.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{item.rating}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={14} color="var(--ink-4)" />
              <span style={{ fontSize: 13, color: 'var(--ink-4)' }}>{item.location}</span>
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 16, padding: '12px 16px',
          background: 'var(--surface-1)', borderRadius: 10,
          display: 'flex', justifyContent: 'space-around',
        }}>
          {[
            { label: 'Owner', value: typeof item.owner === 'object' ? item.owner.name : item.owner },
            { label: 'Total', value: state?.total != null ? `$${state.total}` : `$${item.price}/day` },
            { label: 'Status', value: 'Confirmed' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-1)' }}>{value}</p>
            </div>
          ))}
        </div>
        {state?.startDate && state?.endDate && (
          <p style={{ marginTop: 12, textAlign: 'center', color: 'var(--ink-4)', fontSize: 12 }}>
            {new Date(state.startDate).toLocaleDateString()} – {new Date(state.endDate).toLocaleDateString()}
            {state.bookingId ? ` · Booking #${state.bookingId}` : ''}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <button className="btn-primary" onClick={() => navigate('/my-rentals')} style={{ marginBottom: 12 }}>
        View My Rentals
      </button>
      <button className="btn-outline" onClick={() => navigate('/')}>
        Back to Home
      </button>

      <div style={{ height: 20 }} />
    </div>
  );
}
