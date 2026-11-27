import { useState } from 'react';
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { categories } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items } = useApp();
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [category, setCategory] = useState(() => searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('nearest');

  let results = items.filter(item => {
    const matchQ = !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === 'all' || item.category === category;
    return matchQ && matchCat;
  });

  if (sortBy === 'price') results = [...results].sort((a, b) => a.price - b.price);
  else if (sortBy === 'rating') results = [...results].sort((a, b) => b.rating - a.rating);

  return (
    <div className="page">
      {/* Sticky Header */}
      <div style={{
        background: 'white', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid #F1F5F9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 17, color: '#0F172A',
          }}>‹</button>
          <span style={{ fontWeight: 800, fontSize: 17, color: '#0F172A' }}>Search</span>
        </div>
        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: '#F8FAFC', borderRadius: 12, padding: '11px 14px',
            border: query ? '1.5px solid #2563EB' : '1.5px solid #E2E8F0',
          }}>
            <SearchIcon size={16} color="#94A3B8" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="What do you need?" style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 14, color: '#0F172A',
              }} />
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SlidersHorizontal size={18} color="white" />
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        {/* Category Chips */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none',
          paddingBottom: 14, marginBottom: 14,
        }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
              padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
              background: category === cat.id ? '#2563EB' : 'white',
              color: category === cat.id ? 'white' : '#64748B',
              boxShadow: category === cat.id ? '0 2px 8px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.15s',
            }}>{cat.label}</button>
          ))}
        </div>

        {/* Sort bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>{results.length} results</span>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 10px', background: 'white', border: '1.5px solid #E2E8F0',
            borderRadius: 10, fontSize: 13, color: '#0F172A', fontWeight: 600,
          }}>
            <select aria-label="Sort results" value={sortBy} onChange={event => setSortBy(event.target.value)} style={{ border: 0, outline: 0, padding: '9px 0', background: 'transparent', font: 'inherit', color: 'inherit' }}>
              <option value="nearest">Nearest</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
      </div>

      {/* Results Grid */}
      <div style={{ padding: '0 20px 24px' }}>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 6 }}>No items found</p>
            <p style={{ color: '#94A3B8', fontSize: 13 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="rental-grid">
            {results.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
