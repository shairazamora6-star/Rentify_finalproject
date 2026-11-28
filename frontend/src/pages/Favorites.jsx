import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { useApp } from '../contexts/AppContext';

export default function Favorites() {
  const navigate = useNavigate();
  const { isFavorited, items } = useApp();

  const favorites = items.filter(item => isFavorited(item.id));

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--line-1)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{
          padding: 4,
          color: 'var(--ink-1)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 0.75; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = ''; }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink-1)' }}>Favorites</span>
      </div>

      <div style={{ padding: '20px' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Heart size={48} color="var(--line-1)" style={{ margin: '0 auto 16px' }} fill="var(--line-1)" />
            <p style={{ color: 'var(--ink-3)', fontWeight: 600, fontSize: 16 }}>No favorites yet</p>
            <p style={{ color: 'var(--ink-4)', fontSize: 13, marginTop: 4 }}>Save items you love by tapping the heart</p>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: 20, width: 'auto' }}>
              Browse Items
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 16 }}>{favorites.length} saved items</p>
            <div className="rental-grid">
              {favorites.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
