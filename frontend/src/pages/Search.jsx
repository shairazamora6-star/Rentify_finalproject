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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [maxDistance, setMaxDistance] = useState('');

  let results = items.filter(item => {
    const matchQ = !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === 'all' || item.category === category;
    const matchPrice = !maxPrice || item.price <= Number(maxPrice);
    const matchStock = !inStockOnly || item.available;
    const matchRating = !minRating || item.rating >= Number(minRating);
    const matchDistance = !maxDistance || parseFloat(item.distance) <= Number(maxDistance);
    return matchQ && matchCat && matchPrice && matchStock && matchRating && matchDistance;
  });

  if (sortBy === 'price') results = [...results].sort((a, b) => a.price - b.price);
  else if (sortBy === 'rating') results = [...results].sort((a, b) => b.rating - a.rating);

  return (
    <div className="page">
      {/* Sticky Header */}
      <div style={{
        background: 'var(--surface)', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--line-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--line-1)', background: 'var(--surface-2)', fontSize: 17, color: 'var(--ink-1)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; e.currentTarget.style.background = 'var(--accent-softer)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}>‹</button>
          <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--ink-1)' }}>Search</span>
        </div>
        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface-2)', borderRadius: 12, padding: '11px 14px',
            border: query ? '1.5px solid var(--accent)' : '1.5px solid var(--line-1)',
            transition: 'border-color 0.15s',
          }}>
            <SearchIcon size={16} color="var(--ink-4)" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="What do you need?" style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 14, color: 'var(--ink-1)',
              }} />
          </div>
          <button onClick={() => setFiltersOpen(open => !open)} aria-pressed={filtersOpen} style={{
            width: 44, height: 44, borderRadius: 12,
            background: filtersOpen ? 'var(--accent)' : 'var(--surface-2)',
            border: filtersOpen ? 'none' : '1px solid var(--line-1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = 'var(--accent-shadow)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
            <SlidersHorizontal size={18} color={filtersOpen ? 'white' : 'var(--ink-3)'} />
          </button>
        </div>
        {filtersOpen && (
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
            marginTop: 12, padding: 12, background: 'var(--surface-2)',
            borderRadius: 12, border: '1px solid var(--line-1)',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>
              Max $/day
              <input
                type="number" min="0" value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ width: 70, padding: '8px 10px', fontSize: 13, borderRadius: 8, border: '1px solid var(--line-1)', background: 'var(--surface-1)', color: 'var(--ink-1)', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
              Available now
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>
              Min rating
              <select
                value={minRating}
                onChange={e => setMinRating(e.target.value)}
                style={{ width: 88, padding: '8px 8px', fontSize: 13, borderRadius: 8, border: '1px solid var(--line-1)', background: 'var(--surface-1)', color: 'var(--ink-1)', outline: 'none' }}
              >
                <option value="">Any</option>
                <option value="4.8">4.8+</option>
                <option value="4.5">4.5+</option>
                <option value="4.0">4.0+</option>
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>
              Max distance
              <select
                value={maxDistance}
                onChange={e => setMaxDistance(e.target.value)}
                style={{ width: 96, padding: '8px 8px', fontSize: 13, borderRadius: 8, border: '1px solid var(--line-1)', background: 'var(--surface-1)', color: 'var(--ink-1)', outline: 'none' }}
              >
                <option value="">Any</option>
                <option value="2">2 mi</option>
                <option value="3">3 mi</option>
                <option value="5">5 mi</option>
              </select>
            </label>
            {(maxPrice || inStockOnly || minRating || maxDistance) && (
              <button onClick={() => { setMaxPrice(''); setInStockOnly(false); setMinRating(''); setMaxDistance(''); }} style={{
                fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 0.75; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}>Clear filters</button>
            )}
          </div>
        )}
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
              background: category === cat.id ? 'var(--accent)' : 'var(--surface-1)',
              color: category === cat.id ? 'white' : 'var(--ink-3)',
              boxShadow: category === cat.id ? '0 2px 8px var(--accent-shadow)' : 'var(--shadow-sm)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (category !== cat.id) { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = ''; }}>{cat.label}</button>
          ))}
        </div>

        {/* Sort bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>{results.length} results</span>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 10px', background: 'var(--surface-1)', border: '1.5px solid var(--line-1)',
            borderRadius: 10, fontSize: 13, color: 'var(--ink-1)', fontWeight: 600,
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
            <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink-1)', marginBottom: 6 }}>No items found</p>
            <p style={{ color: 'var(--ink-4)', fontSize: 13 }}>Try adjusting your search or filters</p>
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
