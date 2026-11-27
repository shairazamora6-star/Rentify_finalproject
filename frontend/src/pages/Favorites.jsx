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
        background: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Favorites</span>
      </div>

      <div style={{ padding: '20px' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Heart size={48} color="#E2E8F0" style={{ margin: '0 auto 16px' }} fill="#E2E8F0" />
            <p style={{ color: '#64748B', fontWeight: 600, fontSize: 16 }}>No favorites yet</p>
            <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>Save items you love by tapping the heart</p>
            <button onClick={() => navigate('/')} style={{
              marginTop: 20,
              padding: '12px 24px',
              borderRadius: 10,
              background: '#2563EB',
              color: 'white',
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
            }}>
              Browse Items
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 16 }}>{favorites.length} saved items</p>
            <div className="rental-grid">
              {favorites.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
