import { Heart, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorited } = useApp();
  const favorited = isFavorited(item.id);

  return (
    <div
      onClick={() => navigate(`/item/${item.id}`)}
      style={{
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={item.image}
          alt={item.title}
          style={{ width: '100%', height: 140, objectFit: 'cover' }}
        />
        {/* Favorite button only */}
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(item.id); }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
        >
          <Heart size={16} fill={favorited ? '#EF4444' : 'none'} stroke={favorited ? '#EF4444' : '#64748B'} />
        </button>
        {item.featured && (
          <span style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: '#2563EB',
            color: 'white',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 20,
          }}>Featured</span>
        )}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#0F172A', lineHeight: 1.3 }}>
          {item.title}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <Star size={12} fill="#F59E0B" stroke="#F59E0B" />
          <span style={{ fontSize: 12, color: '#64748B' }}>{item.rating} ({item.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <MapPin size={12} color="#94A3B8" />
          <span style={{ fontSize: 12, color: '#94A3B8' }}>{item.distance}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#2563EB' }}>${item.price}</span>
          <span style={{ fontSize: 12, color: '#64748B' }}>/{item.pricePeriod}</span>
        </div>
      </div>
    </div>
  );
}
