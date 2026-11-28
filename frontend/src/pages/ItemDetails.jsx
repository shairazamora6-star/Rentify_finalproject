import { useState } from 'react';
import { ChevronLeft, Heart, Share2, MapPin, Star, ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockItems } from '../data/mockData';
import { useApp } from '../contexts/AppContext';
import ShareSheet from '../components/ShareSheet';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorited, isLoggedIn, addNotification, items, addToCart, isInCart } = useApp();
  const isFavoritedItem = (itemId) => isFavorited(itemId);

  const item = items.find(i => i.id === parseInt(id)) || mockItems.find(i => i.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  if (!item) return <div className="page">Item not found</div>;

  const images = item.images && item.images.length ? item.images : [item.image];
  const features = item.features || ['High quality', 'Good condition', 'Available now'];
  const reviewList = Array.isArray(item.reviews) ? item.reviews : (item.reviewList || []);
  const reviewCount = Array.isArray(item.reviews) ? item.reviews.length : (item.reviews || reviewList.length || 0);

  const handleShare = () => setShowShareSheet(true);

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      {/* Image Header */}
      <div style={{ position: 'relative' }}>
        <img src={images[selectedImage]} alt={item.title} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)',
        }} />

        {/* Back + Actions */}
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={() => navigate(-1)} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}>
            <ChevronLeft size={20} color="#0F172A" />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => toggleFavorite(item.id)} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            }}>
              <Heart size={18} color={isFavoritedItem(item.id) ? '#EF4444' : '#64748B'} fill={isFavoritedItem(item.id) ? '#EF4444' : 'none'} />
            </button>
            <button onClick={handleShare} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            }}>
              <Share2 size={18} color="#64748B" />
            </button>
          </div>
        </div>

        {/* Image thumbnails */}
        <div style={{
          position: 'absolute', bottom: 16, left: 0, right: 0,
          display: 'flex', gap: 8, justifyContent: 'center', padding: '0 20px',
        }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setSelectedImage(i)} style={{
              width: 56, height: 56, borderRadius: 12, overflow: 'hidden',
              border: selectedImage === i ? '2px solid white' : '2px solid transparent',
              opacity: selectedImage === i ? 1 : 0.6,
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', background: 'white' }}>
        {/* Price & Title */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>{item.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{item.rating}</span>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>({reviewCount})</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <MapPin size={14} color="#64748B" />
            <span style={{ fontSize: 14, color: '#64748B' }}>{item.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#2563EB' }}>${item.price}</span>
            <span style={{ fontSize: 15, color: '#64748B' }}>/day</span>
          </div>
        </div>

        {/* Owner Card */}
        <div className="card card-hoverable" style={{ padding: 16, marginBottom: 20, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3978D5, #73A7E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0,
            }}>
              {(typeof item.owner === 'object' ? item.owner.name : item.owner).split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{typeof item.owner === 'object' ? item.owner.name : item.owner}</span>
                {(typeof item.owner !== 'object' || item.owner.verified) && (
                  <span style={{ background: '#EEF2FF', borderRadius: 6, padding: '2px 6px', fontSize: 11, fontWeight: 600, color: '#2563EB' }}>Verified</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                Member since {typeof item.owner === 'object' ? item.owner.memberSince : '2023'} · {typeof item.owner === 'object' ? item.owner.responseRate : '98%'} response rate
              </p>
            </div>
            <button onClick={() => navigate(`/owner-profile/${item.ownerId || item.id}`)} style={{
              padding: '8px 14px', borderRadius: 10,
              border: '1.5px solid #E2E8F0', background: 'white',
              fontSize: 13, fontWeight: 600, color: '#0F172A',
            }}>Profile</button>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0F172A' }}>Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 12,
                background: '#F8FAFC', border: '1px solid #F1F5F9',
                fontSize: 13, color: '#334155', fontWeight: 500,
              }}>
                ✓ {f}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Preview */}
        {(reviewList.length > 0 || reviewCount > 0) && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Reviews</h3>
              {reviewList.length > 2 && (
                <button onClick={() => setShowAllReviews(v => !v)} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showAllReviews ? 'See less' : `See all (${reviewList.length})`}
                </button>
              )}
            </div>
            {reviewList.length === 0 ? (
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                {reviewCount > 0 ? `Rated ${item.rating} by ${reviewCount} renter${reviewCount === 1 ? '' : 's'}` : 'No reviews yet'} — details after your rental.
              </p>
            ) : (
              reviewList.slice(0, showAllReviews ? undefined : 2).map((review, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#2563EB',
                  }}>
                    {review.author[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{review.author}</span>
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#94A3B8' }}>{review.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} color={j < review.rating ? '#F59E0B' : '#E2E8F0'} fill={j < review.rating ? '#F59E0B' : 'none'} />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: 0 }}>{review.text}</p>
              </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div style={{
        position: 'fixed', bottom: 64, left: 0, right: 0, maxWidth: 480, margin: '0 auto',
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid #F1F5F9', padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 12, zIndex: 40,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#64748B' }}>Total price</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>${item.price}<span style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>/day</span></div>
        </div>
        <button onClick={() => {
          if (!isLoggedIn) {
            navigate('/login');
          } else {
            addToCart(item);
            addNotification({ type: 'system', title: 'Added to cart', message: `${item.title} has been added to your cart` });
          }
        }} style={{
          padding: '14px 20px', borderRadius: 14, fontSize: 15, fontWeight: 600,
          border: '1.5px solid #E2E8F0', background: isInCart(item.id) ? '#EEF2FF' : 'white',
          color: isInCart(item.id) ? '#2563EB' : '#0F172A',
          display: 'flex', alignItems: 'center', gap: 8, minWidth: 140, justifyContent: 'center',
        }}>
          {isInCart(item.id) ? <Check size={18} /> : <ShoppingCart size={18} />}
          {isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
        </button>
        <button onClick={() => { if (!isLoggedIn) navigate('/login'); else navigate(`/reserve/${id}`); }} className="btn-primary" style={{ padding: '14px 28px', borderRadius: 14, fontSize: 15, fontWeight: 700 }}>
          Reserve Now
        </button>
      </div>

      {/* Share Sheet */}
      {showShareSheet && (
        <ShareSheet item={item} onClose={() => setShowShareSheet(false)} />
      )}
    </div>
  );
}
