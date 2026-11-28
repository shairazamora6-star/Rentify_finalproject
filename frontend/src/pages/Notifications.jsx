import { Bell, Trash2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const markAllRead = () => {
    markAllNotificationsRead();
  };

  const clearAll = () => {
    clearNotifications();
    setShowClearConfirm(false);
  };

  const notifList = notifications;

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
        background: 'var(--surface)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--line-1)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{
            padding: 4, color: 'var(--ink-1)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 0.75; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)' }}>Notifications</h1>
        </div>
        {notifList.some(n => !n.read) && (
          <button onClick={markAllRead} style={{
            fontSize: 13, color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 0.75; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}>
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
              fontSize: 13, color: 'var(--danger)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 0.75; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}>
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}

        {showClearConfirm && (
          <div style={{
            padding: 16, background: 'var(--danger-soft)', borderRadius: 12,
            border: '1px solid var(--danger-line)', marginBottom: 16,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <XCircle size={20} color="var(--danger)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>Clear all notifications?</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowClearConfirm(false)} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                border: '1px solid var(--line-1)', background: 'var(--surface)',
                fontSize: 14, fontWeight: 500, color: 'var(--ink-3)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}>Cancel</button>
              <button onClick={clearAll} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: 'var(--danger)', color: 'white',
                fontSize: 14, fontWeight: 600, border: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--danger-shadow)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>Clear All</button>
            </div>
          </div>
        )}

        {/* Notification List */}
        {notifList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Bell size={48} color="var(--line-1)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--ink-3)', fontWeight: 600 }}>No notifications</p>
            <p style={{ color: 'var(--ink-4)', fontSize: 13, marginTop: 4 }}>You're all caught up!</p>
          </div>
        ) : (
          notifList.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              style={{
                display: 'flex',
                gap: 12,
                padding: '14px 0',
                borderBottom: '1px solid var(--line-2)',
                background: notif.read ? 'transparent' : 'var(--accent-softer)',
                borderRadius: notif.read ? 0 : 10,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (e.currentTarget.style.background === 'transparent' || e.currentTarget.style.background === '') { e.currentTarget.style.background = 'var(--surface-2)'; } }}
              onMouseLeave={e => { if (!notif.read) { e.currentTarget.style.background = 'var(--accent-softer)'; } else { e.currentTarget.style.background = ''; } }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: notif.read ? 'var(--surface-2)' : 'var(--accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>{getTypeIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: notif.read ? 500 : 700, fontSize: 14, color: 'var(--ink-1)' }}>{notif.title}</p>
                  <span style={{ fontSize: 11, color: 'var(--ink-4)', flexShrink: 0 }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{notif.message}</p>
              </div>
              {!notif.read && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 6 }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
