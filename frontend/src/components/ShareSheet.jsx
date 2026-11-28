import { useEffect, useState } from 'react';
import { ChevronLeft, Link2, MessageCircle, MoreHorizontal, Check } from 'lucide-react';

export default function ShareSheet({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const shareUrl = `${window.location.origin}/item/${item.id}`;
  const shareText = `Check out "${item.title}" for rent — ₱${item.price}/day on Rentify!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMessenger = () => {
    window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const handleMoreOptions = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: item.title, text: shareText, url: shareUrl }); }
      catch { /* cancelled */ }
    } else {
      handleCopyLink();
    }
  };

  const categoryLabel = {
    cameras: 'camera', gaming: 'console', tools: 'tool',
    electronics: 'item', fashion: 'item', sports: 'item', home: 'item',
  }[item.category] || 'item';

  const options = [
    {
      icon: copied ? <Check size={18} color="var(--success)" /> : <Link2 size={18} color="var(--accent)" />,
      label: copied ? 'Copied!' : 'Copy Link',
      bg: copied ? 'var(--success-light)' : 'var(--accent-softer)',
      action: handleCopyLink,
    },
    {
      icon: <MessageCircle size={18} color="var(--accent)" />,
      label: 'Messenger',
      bg: 'var(--accent-softer)',
      action: handleMessenger,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
      label: 'Facebook',
      bg: 'var(--accent-softer)',
      action: handleFacebook,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="var(--success)" />
          <path d="M22.5 9.5A9.46 9.46 0 0016 7a9.5 9.5 0 00-8.22 14.24L7 25l3.87-.8A9.5 9.5 0 0016 25.5a9.5 9.5 0 009.5-9.5 9.46 9.46 0 00-3-6.5zm-6.5 14.6a7.88 7.88 0 01-4.02-1.1l-.29-.17-2.98.78.8-2.92-.19-.3A7.9 7.9 0 018.1 16a7.9 7.9 0 1114.78 3.9A7.88 7.88 0 0116 24.1zm4.33-5.9c-.24-.12-1.4-.69-1.62-.77-.21-.08-.37-.12-.53.12s-.6.77-.74.93c-.14.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.17-1.4-1.3-1.63-.14-.23-.01-.36.1-.48.1-.1.24-.27.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.28-.73-1.75-.19-.46-.38-.4-.53-.4h-.45c-.16 0-.42.06-.64.3-.21.24-.83.81-.83 1.98s.85 2.3.97 2.46c.12.16 1.67 2.55 4.05 3.57.57.24 1.01.39 1.35.5.57.18 1.09.15 1.5.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.45-.28z" fill="white" />
        </svg>
      ),
      label: 'WhatsApp',
      bg: 'var(--success-light)',
      action: handleWhatsApp,
    },
    {
      icon: <MoreHorizontal size={18} color="var(--ink-4)" />,
      label: 'More Options',
      bg: 'var(--surface-1)',
      action: handleMoreOptions,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes shareFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sharePopIn {
          from { transform: scale(0.95) translateY(12px); opacity: 0; }
          to   { transform: scale(1)    translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'shareFadeIn 0.2s ease',
          padding: '20px',
        }}
      >
        {/* Card — stop click from closing */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 400,
            background: 'var(--surface)',
            borderRadius: 24,
            boxShadow: 'var(--shadow-lg)',
            animation: 'sharePopIn 0.22s ease',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '18px 16px 12px',
            borderBottom: '1px solid var(--line-1)',
          }}>
            <button
              onClick={onClose}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--surface-1)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
            >
              <ChevronLeft size={18} color="var(--ink-1)" />
            </button>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)', margin: 0 }}>
              Share this {categoryLabel}
            </h3>
          </div>

          {/* Item preview — compact horizontal */}
          <div style={{
            margin: '12px 14px 10px',
            borderRadius: 12, overflow: 'hidden',
            border: '1px solid var(--line-1)',
            display: 'flex', flexDirection: 'row', alignItems: 'stretch',
          }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ width: 80, height: 72, objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{
              padding: '8px 12px', flex: 1,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-1)', margin: 0, lineHeight: 1.3 }}>
                {item.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ color: '#F59E0B', fontSize: 12 }}>★</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                    {item.rating} ({Array.isArray(item.reviews) ? item.reviews.length : item.reviews} Reviews)
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                  ₱{item.price}/day
                </span>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 12, color: 'var(--ink-4)', padding: '0 14px 10px', margin: 0 }}>
            Share this {categoryLabel} with your friends so they can easily view and rent it.
          </p>

          {/* Options */}
          <div style={{ padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {options.map(opt => (
              <button
                key={opt.label}
                onClick={opt.action}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 11,
                  background: 'var(--surface)', border: '1px solid var(--line-1)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  width: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.borderColor = 'var(--accent-line)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: opt.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {opt.icon}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-1)' }}>{opt.label}</span>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
