import { useState } from 'react';
import { Clock, CheckCircle, XCircle, CalendarDays, RefreshCw, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const tabs = [
  { id: 'active', label: 'Active', icon: Clock },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
  { id: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export default function MyRentals() {
  const navigate = useNavigate();
  const { rentals, items, updateRental } = useApp();
  const [activeTab, setActiveTab] = useState('active');
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [receiptRental, setReceiptRental] = useState(null);
  const visibleRentals = rentals.filter(rental => rental.status === activeTab);

  const getItemId = (rental) => {
    if (rental.itemId) return rental.itemId;
    const match = items.find(i => i.title.toLowerCase() === (rental.item || '').toLowerCase());
    return match ? match.id : 1;
  };

  const cancelRental = (rental) => {
    updateRental(rental.id, { status: 'cancelled' });
    setConfirmCancel(null);
  };

  const daysBetween = (rental) => {
    if (rental.dayCount) return rental.dayCount;
    const item = items.find(i => i.id === getItemId(rental));
    if (!item || !rental._start || !rental._end) return null;
    return Math.max(1, Math.round((new Date(rental._end) - new Date(rental._start)) / 86400000));
  };

  const receiptDayCount = receiptRental ? daysBetween(receiptRental) : null;
  const receiptUnitPrice = receiptDayCount && receiptRental ? (receiptRental.total / receiptDayCount) : null;

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid #F1F5F9',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 18, color: '#0F172A' }}>‹</button>
        <span style={{ fontWeight: 800, fontSize: 17, color: '#0F172A' }}>My Rentals</span>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', paddingLeft: '20px' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const count = rentals.filter(rental => rental.status === tab.id).length;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 'none',
                padding: '13px 16px',
                display: 'flex', alignItems: 'center', gap: 6,
                borderBottom: `2px solid ${activeTab === tab.id ? '#2563EB' : 'transparent'}`,
                color: activeTab === tab.id ? '#2563EB' : '#94A3B8',
                fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500,
                whiteSpace: 'nowrap', transition: 'all 0.15s', marginRight: 4,
              }}>
                <Icon size={14} />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span style={{
                    background: activeTab === tab.id ? '#EEF2FF' : '#F1F5F9',
                    color: activeTab === tab.id ? '#2563EB' : '#94A3B8',
                    fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {visibleRentals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>
              {activeTab === 'cancelled' ? '🚫' : activeTab === 'completed' ? '✅' : '📦'}
            </div>
            <p style={{ color: '#0F172A', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No {activeTab} rentals</p>
            <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.6, maxWidth: 260, margin: '0 auto 20px' }}>
              {activeTab === 'active' || activeTab === 'upcoming'
                ? 'Browse items to make your first rental'
                : 'Your rentals will appear here'}
            </p>
            {(activeTab === 'active' || activeTab === 'upcoming') && (
              <button onClick={() => navigate('/')} className="btn-outline" style={{ width: 'auto', padding: '12px 28px' }}>
                Browse Items
              </button>
            )}
          </div>
        ) : (
          visibleRentals.map(rental => (
            <div key={rental.id} className="card card-hoverable" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 14, padding: '16px 18px' }}>
                <img src={rental.image} alt={rental.item}
                  style={{ width: 76, height: 76, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: '#0F172A' }}>{rental.item}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <CalendarDays size={13} color="#94A3B8" />
                    <span style={{ fontSize: 12, color: '#64748B' }}>{rental.startDate} → {rental.endDate}</span>
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: '#2563EB' }}>${rental.total}</p>
                </div>
              </div>
              <div style={{ padding: '10px 18px 14px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 8 }}>
                {rental.status === 'active' && rental.canExtend && (
                  <button onClick={() => navigate(`/extend-rental/${rental.id}`)} style={{
                    flex: 1, padding: '9px', borderRadius: 10,
                    border: '1.5px solid #2563EB', background: 'transparent',
                    color: '#2563EB', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}>
                    <RefreshCw size={14} /> Extend
                  </button>
                )}
                {rental.status === 'completed' && !rental.rated && (
                  <button
                    onClick={() => navigate(`/return-review/${rental.id}`)}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 10,
                      border: '1.5px solid #E2E8F0', background: 'white',
                      color: '#0F172A', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    Leave Review
                  </button>
                )}
                {rental.status === 'completed' && (
                  <button
                    onClick={() => setReceiptRental(rental)}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 10,
                      border: '1.5px solid #2563EB', background: 'transparent',
                      color: '#2563EB', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    <FileText size={14} /> Receipt
                  </button>
                )}
                {(rental.status === 'active' || rental.status === 'upcoming') && (
                  <button
                    onClick={() => setConfirmCancel(rental)}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 10,
                      border: '1.5px solid #FECACA', background: rental.status === 'active' ? '#FFF5F5' : 'white',
                      color: '#DC2626', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel confirmation */}
      {confirmCancel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(15,23,42,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setConfirmCancel(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: 18, maxWidth: 360, width: '100%', padding: 22,
            boxShadow: '0 20px 50px rgba(15,23,42,0.3)',
          }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>{confirmCancel.status === 'active' ? '⚠️' : '❓'}</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: '#0F172A' }}>
              Cancel this {confirmCancel.status} rental?
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>
              “{confirmCancel.item}” ({confirmCancel.startDate} → {confirmCancel.endDate}) will be cancelled
              {confirmCancel.status === 'active' ? ' immediately and the item must be returned as scheduled.' : ' and your reservation will be released to other renters.'}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setConfirmCancel(null)} style={{
                flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: '1.5px solid #E2E8F0', background: 'white', color: '#0F172A',
              }}>Keep rental</button>
              <button onClick={() => cancelRental(confirmCancel)} style={{
                flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                border: 'none', background: '#DC2626', color: 'white',
              }}>Cancel rental</button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt modal */}
      {receiptRental && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(15,23,42,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setReceiptRental(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: 18, maxWidth: 380, width: '100%',
            boxShadow: '0 20px 50px rgba(15,23,42,0.3)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#F8FAFC', borderBottom: '1px solid #F1F5F9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} color="#2563EB" />
                <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>Rental receipt</span>
              </div>
              <button onClick={() => setReceiptRental(null)} aria-label="Close receipt"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: '#fff', border: '1px solid #E2E8F0' }}>
                <X size={14} color="#64748B" />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <img src={receiptRental.image} alt={receiptRental.item}
                  style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{receiptRental.item}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Rental #{receiptRental.id} · Proof of rental</div>
                </div>
              </div>
              <div style={{ border: '1px dashed #CBD5E1', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'grid', gap: 8 }}>
                {[
                  ['Period', `${receiptRental.startDate} → ${receiptRental.endDate}`],
                  ['Status', 'Completed ✓'],
                  ['Payment', 'Paid in full'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748B' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Total charged</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>${receiptRental.total}</span>
              </div>
              {receiptUnitPrice != null && (
                <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
                  {receiptDayCount} day{receiptDayCount === 1 ? '' : 's'} × ${receiptUnitPrice.toFixed(2)}/day
                </p>
              )}
              <button onClick={() => setReceiptRental(null)} style={{
                width: '100%', marginTop: 18, padding: '10px', borderRadius: 10,
                border: '1.5px solid #E2E8F0', background: 'white',
                color: '#0F172A', fontSize: 13, fontWeight: 600,
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
