import { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { mockItems, categories } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('all');
  const filtered = activeCat === 'all' ? mockItems : mockItems.filter(i => i.category === activeCat);
  const featured = mockItems.filter(i => i.featured);

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '14px 20px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid #F1F5F9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 15,
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
          }}>R</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', letterSpacing: -0.3 }}>Rentify</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{icon: Bell, action: () => navigate('/notifications')}, {icon: User, action: () => navigate('/profile')}].map(({ icon: Icon, action }, i) => (
            <button key={i} onClick={action} style={{
              width: 38, height: 38, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #E2E8F0', background: 'white',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#EEF2FF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = 'white'; }}
            >
              <Icon size={18} color="#64748B" />
            </button>
          ))}
        </div>
      </div>

      {/* Location & Greeting */}
      <div style={{ padding: '14px 20px 0' }}>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 2, fontWeight: 500 }}>Good morning 👋</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>San Francisco, CA</span>
          <span style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, marginLeft: 2 }}>Change</span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={() => navigate('/search')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', background: '#F8FAFC',
          border: '1.5px solid #E2E8F0', borderRadius: 14,
          textAlign: 'left', color: '#94A3B8', fontSize: 15, fontWeight: 500,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.background = '#EFF6FF'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
        >
          <Search size={18} color="#94A3B8" />
          Search for cameras, tools, electronics…
        </button>
      </div>

      {/* Category Chips */}
      <div style={{
        padding: '0 20px', display: 'flex', gap: 8,
        overflowX: 'auto', scrollbarWidth: 'none',
        marginBottom: 20,
      }}>
        <button onClick={() => setActiveCat('all')} style={{
          padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
          whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
          background: activeCat === 'all' ? '#2563EB' : 'white',
          color: activeCat === 'all' ? 'white' : '#64748B',
          boxShadow: activeCat === 'all' ? '0 2px 8px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all 0.15s',
        }}>{'All'}</button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
            padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
            background: activeCat === cat.id ? '#2563EB' : 'white',
            color: activeCat === cat.id ? 'white' : '#64748B',
            boxShadow: activeCat === cat.id ? '0 2px 8px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
            transition: 'all 0.15s',
          }}>{cat.label}</button>
        ))}
      </div>

      {/* Featured Section */}
      {activeCat === 'all' && (
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Featured Items</h2>
            <button onClick={() => navigate('/search')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, padding: '4px 0' }}>See All →</button>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {featured.map(item => (
              <div key={item.id} style={{ minWidth: 195, flexShrink: 0 }}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Items */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Nearby Items</h2>
          <button onClick={() => navigate('/search')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, padding: '4px 0' }}>See All →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.slice(0, 6).map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      </div>

      {/* Browse Categories */}
      <div style={{ padding: '0 20px 24px' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Browse Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { name: 'Electronics', emoji: '💻', bg: '#EEF2FF' },
            { name: 'Cameras', emoji: '📷', bg: '#F0FDFA' },
            { name: 'Gaming', emoji: '🎮', bg: '#FFFBEB' },
            { name: 'Tools', emoji: '🔧', bg: '#FFF1F2' },
            { name: 'Sports', emoji: '⚽', bg: '#F5F3FF' },
            { name: 'Fashion', emoji: '👗', bg: '#FEF3C7' },
          ].map((cat, i) => (
            <button key={cat.name} onClick={() => navigate('/search')} style={{
              padding: '16px 8px', borderRadius: 14, background: cat.bg,
              border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <span style={{ fontSize: 24 }}>{cat.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
