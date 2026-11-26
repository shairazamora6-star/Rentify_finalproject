import { useState } from 'react';
import { Clock, CheckCircle, XCircle, CalendarDays, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockRentals } from '../data/mockData';

const tabs = [
  { id: 'active', label: 'Active', icon: Clock },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
  { id: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export default function MyRentals() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const rentals = mockRentals[activeTab] || [];

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
            const count = tab.id === 'active' ? mockRentals.active.length
              : tab.id === 'upcoming' ? mockRentals.upcoming.length
              : tab.id === 'completed' ? mockRentals.completed.length
              : mockRentals.cancelled.length;
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
        {rentals.length === 0 ? (
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
          rentals.map(rental => (
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
                <button style={{
                  flex: 1, padding: '9px', borderRadius: 10,
                  border: '1.5px solid #E2E8F0', background: 'white',
                  color: '#0F172A', fontSize: 13, fontWeight: 600,
                }}>
                  {rental.status === 'active' ? 'Details' : rental.status === 'completed' ? 'Review' : 'Details'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
