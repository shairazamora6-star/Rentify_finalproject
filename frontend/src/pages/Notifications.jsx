import { Bell, CheckCheck, Trash2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockNotifications } from '../data/mockData';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifList, setNotifList] = useState(mockNotifications);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const markAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifList([]);
    setShowClearConfirm(false);
  };

  const markRead = (id) => {
    setNotifList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'booking': return '📅';
      case 'message': return '💬';
      case 'extension': return '⏰';
      case 'system': return '💳';
      default: return '🔔';
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ padding: 4 }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Notifications</h1>
        </div>
        {notifList.some(n => !n.read) && (
          <button onClick={markAllRead} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>
            Mark all read
          </button>
        )}
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Clear All */}
        {notifList.length > 0 && !showClearConfirm && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => setShowClearConfirm(true)} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 13, color: '#EF4444', fontWeight: 500,
            }}>
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}

        {showClearConfirm && (
          <div style={{
            padding: 16, background: '#FEF2F2', borderRadius: 12,
            border: '1px solid #FECACA', marginBottom: 16,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <XCircle size={20} color="#EF4444" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Clear all notifications?</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowClearConfirm(false)} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                border: '1px solid #E2E8F0', background: 'white',
                fontSize: 14, fontWeight: 500, color: '#64748B',
              }}>Cancel</button>
              <button onClick={clearAll} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: '#EF4444', color: 'white',
                fontSize: 14, fontWeight: 600, border: 'none',
              }}>Clear All</button>
            </div>
          </div>
        )}

        {/* Notification List */}
        {notifList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Bell size={48} color="#E2E8F0" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#64748B', fontWeight: 600 }}>No notifications</p>
            <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>You're all caught up!</p>
          </div>
        ) : (
          notifList.map(notif => (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              style={{
                display: 'flex',
                gap: 12,
                padding: '14px 0',
                borderBottom: '1px solid #F1F5F9',
                background: notif.read ? 'transparent' : '#EEF2FF',
                borderRadius: notif.read ? 0 : 10,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: notif.read ? '#F1F5F9' : '#EEF2FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>{getTypeIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: notif.read ? 500 : 700, fontSize: 14, color: '#0F172A' }}>{notif.title}</p>
                  <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>{notif.message}</p>
              </div>
              {!notif.read && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', flexShrink: 0, marginTop: 6 }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
