import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { categories } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { items, user, rentals } = useApp();
  const [activeCat, setActiveCat] = useState('all');
  const [location, setLocation] = useState('San Francisco, CA');
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationDraft, setLocationDraft] = useState('San Francisco, CA');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const filtered = activeCat === 'all' ? items : items.filter(i => i.category === activeCat);
  const featured = items.filter(i => i.featured);
  const nearbyItems = activeCat === 'all' ? filtered.filter(item => !item.featured) : filtered;

  // Most rented: rank items by how often they appear in the customer's rental history
  const rentalCounts = {};
  rentals.forEach(r => {
    const title = r.item || (r.itemId ? (items.find(i => i.id === r.itemId) || {}).title : null);
    if (title) rentalCounts[title] = (rentalCounts[title] || 0) + 1;
  });
  const mostRented = items
    .filter(i => rentalCounts[i.title] > 0)
    .sort((a, b) => rentalCounts[b.title] - rentalCounts[a.title])
    .slice(0, 6);
  const popularItems = mostRented.length ? mostRented : featured.length ? featured : items.slice(0, 6);
  const isFromHistory = mostRented.length > 0;

  return (
    <div className="page">
      {/* Location & Greeting */}
      <div style={{ padding: '14px 20px 0' }}>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 2, fontWeight: 500 }}>{greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ' 👋'}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {editingLocation ? (
            <input
              value={locationDraft}
              onChange={e => setLocationDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && locationDraft.trim()) {
                  setLocation(locationDraft.trim());
                  setEditingLocation(false);
                }
                if (e.key === 'Escape') setEditingLocation(false);
              }}
              autoFocus
              style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', border: 'none', outline: 'none', background: '#F8FAFC', borderRadius: 8, padding: '4px 8px', width: 180 }}
            />
          ) : (
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{location}</span>
          )}
          {editingLocation ? (
            <button onClick={() => { if (locationDraft.trim()) setLocation(locationDraft.trim()); setEditingLocation(false); }} style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, marginLeft: 2, background: 'none', border: 'none', cursor: 'pointer' }}>Save</button>
          ) : (
            <button onClick={() => { setLocationDraft(location); setEditingLocation(true); }} style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, marginLeft: 2, background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={() => navigate('/search')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', background: '#F8FAFC',
          border: '1.5px solid #E2E8F0', borderRadius: 14,
          textAlign: 'left', color: '#94A3B8', fontSize: 15, fontWeight: 500,
          transition: 'all 0.15s', minHeight: 50,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.background = '#EFF6FF'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
        >
          <Search size={18} color="#94A3B8" />
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>Search cameras, tools, and more</span>
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
        {categories.filter(cat => cat.id !== 'all').map(cat => (
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
            <button onClick={() => navigate('/nearby')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, padding: '4px 0' }}>Find nearby →</button>
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
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Nearby listings</h2>
          <button onClick={() => navigate('/search')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, padding: '4px 0' }}>See All →</button>
        </div>
        <div className="rental-grid">
          {nearbyItems.slice(0, 6).map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      </div>

      {/* Most Rented */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>Most rented</h2>
            {isFromHistory && <TrendingUp size={15} color="#2563EB" />}
          </div>
          <button onClick={() => navigate('/search')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, padding: '4px 0', background: 'none', border: 'none', cursor: 'pointer' }}>See all →</button>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 14px' }}>
          {isFromHistory ? 'Items customers rent the most' : 'Popular picks right now'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {popularItems.map((item, idx) => (
            <button key={item.id} onClick={() => navigate(`/item/${item.id}`)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, borderRadius: 14,
              background: 'white', border: '1.5px solid #EDF4FC',
              cursor: 'pointer', textAlign: 'left',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,93,150,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDF4FC'; e.currentTarget.style.boxShadow = ''; }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                background: idx === 0 ? '#EEF2FF' : '#F8FAFC',
                color: idx === 0 ? '#2563EB' : '#94A3B8',
                display: 'grid', placeItems: 'center',
                fontSize: 12, fontWeight: 800,
              }}>{idx + 1}</span>
              <img src={item.image} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  {isFromHistory ? `${rentalCounts[item.title]} rental${rentalCounts[item.title] === 1 ? '' : 's'}` : `$${item.price}/day`}
                </div>
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#2563EB' }}>${item.price}<span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>/day</span></span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
