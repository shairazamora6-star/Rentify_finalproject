import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { mockItems } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

export default function ExtendRentalPending() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rentals } = useApp();

  const rental = rentals.find(r => r.id === parseInt(id));
  const item = rental ? mockItems.find(i => i.id === rental.itemId || i.title === rental.item) : null;

  // Guard: if rental not found, show not found
  if (!rental || !item) {
    return (
      <div className="page" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Rental Not Found</h2>
        <p style={{ color: 'var(--ink-3)', marginBottom: 24 }}>This extension request doesn't exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/my-rentals')}>
          Back to My Rentals
        </button>
      </div>
    );
  }

  const status = rental?.extensionStatus || 'pending'; // pending, approved, rejected

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'var(--warning)',
      bg: 'var(--warning-soft)',
      border: 'var(--warning-line)',
      title: 'Extension Request Sent',
      subtitle: 'Waiting for owner approval',
      description: 'The owner has been notified and will respond within 24 hours. Your current rental continues until a decision is made.',
    },
    approved: {
      icon: CheckCircle,
      color: 'var(--success)',
      bg: 'var(--success-soft)',
      border: 'var(--success-line)',
      title: 'Extension Approved!',
      subtitle: 'Your rental has been extended',
      description: 'The owner approved your extension request. The new end date is confirmed.',
    },
    rejected: {
      icon: XCircle,
      color: 'var(--danger)',
      bg: 'var(--danger-soft)',
      border: 'var(--danger-line)',
      title: 'Extension Declined',
      subtitle: 'Owner declined the extension',
      description: 'The owner has declined your extension request. Your rental will end on the original date.',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Header */}
        <div style={{
          background: 'var(--surface)', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button onClick={() => navigate(-1)} style={{ padding: 4 }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
            <ChevronLeft size={24} color="var(--ink-1)" />
          </button>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Extend Rental</span>
        </div>

      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        {/* Status Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: config.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', border: `2px solid ${config.border}`,
        }}>
          <config.icon size={40} color={config.color} />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{config.title}</h1>
        <p style={{ color: config.color, fontSize: 16, fontWeight: 600, marginBottom: 24 }}>{config.subtitle}</p>

        {/* Item Card */}
        {item && (
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 16,
            border: `1px solid ${config.border}`, marginBottom: 24, textAlign: 'left',
            maxWidth: 320, marginLeft: 'auto', marginRight: 'auto',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <img src={item.image} alt={item.title}
                style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: 'var(--ink-1)' }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Owner: {item.owner}</p>
              </div>
            </div>
            <div style={{
              padding: '12px', background: config.bg, borderRadius: 10,
              border: `1px solid ${config.border}`,
            }}>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 4 }}>Extension Dates</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>
                {rental?.endDate ? new Date(rental.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                {' '}→{' '}
                {rental?.extendedEndDate ? new Date(rental.extendedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        )}

        <p style={{ color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: '0 auto 32px' }}>
          {config.description}
        </p>

        {/* Actions based on status */}
        {status === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300, margin: '0 auto' }}>
            <button className="btn-outline" onClick={() => navigate('/my-rentals')}>
              View My Rentals
            </button>
            <button className="btn-primary" onClick={() => navigate(`/item/${item?.id}`)}>
              View Item Details
            </button>
          </div>
        )}

        {status === 'approved' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300, margin: '0 auto' }}>
            <button className="btn-primary" onClick={() => navigate('/my-rentals')}>
              View My Rentals
            </button>
            <button className="btn-outline" onClick={() => navigate(`/item/${item?.id}`)}>
              View Item Details
            </button>
          </div>
        )}

        {status === 'rejected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300, margin: '0 auto' }}>
            <button className="btn-primary" onClick={() => navigate('/my-rentals')}>
              View My Rentals
            </button>
            <button className="btn-outline" onClick={() => navigate(`/extend-rental/${id}`)}>
              Try Different Dates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}