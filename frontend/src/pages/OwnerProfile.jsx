import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, MessageSquare, Share2, Camera, Heart, ShieldCheck, Users, ChevronLeft, Phone, Mail, Clock } from 'lucide-react';
import { mockItems } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

export default function OwnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followed, setFollowed] = useState(false);

  // Find owner from mockItems by matching owner name or use id to find items
  // The :id param can be owner name (lowercase with hyphens) or numeric
  const ownerName = useMemo(() => {
    // Try to find items with owner matching the id param (case-insensitive, hyphenated)
    const matchingItem = mockItems.find(item =>
      item.owner.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
    return matchingItem?.owner || 'Sarah Chen'; // fallback
  }, [id]);

  // Derive owner data from their items
  const ownerItems = useMemo(() => mockItems.filter(item => item.owner === ownerName), [ownerName]);
  const firstItem = ownerItems[0];

  // Generate consistent avatar initials from owner name
  const ownerInitials = ownerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const owner = {
    id: firstItem?.ownerId || 101,
    name: ownerName,
    username: '@' + ownerName.toLowerCase().replace(/\s+/g, ''),
    joined: 'March 2023',
    location: firstItem?.location || 'San Francisco, CA',
    rating: 4.92,
    totalReviews: ownerItems.reduce((sum, item) => sum + (item.reviews || 0), 0),
    responseRate: 98,
    responseTime: '< 1 hour',
    verified: true,
    memberSince: 'Member since March 2023',
    itemsForRent: ownerItems.length,
    completedRentals: 156,
    bio: "Outdoor enthusiast and gear collector. I love sharing my equipment with the community! From camera gear to camping essentials, I've got you covered.",
  };

  const topRatings = [
    { category: 'Accuracy', value: 4.9 },
    { category: 'Communication', value: 5.0 },
    { category: 'Cleanliness', value: 4.8 },
    { category: 'Reliability', value: 4.9 },
  ];

  const myItems = ownerItems.slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(`https://rentify.app/owner/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  const handleSendMessage = () => {
    if (!ownerName) return;
    // Navigate to messages with a conversation context
    navigate('/messages', { state: { conversation: { ownerId: owner.id, ownerName: owner.name, itemId: firstItem?.id } } });
  };

  const handleFollow = () => {
    setFollowed(!followed);
    addNotification({
      type: followed ? 'unfollowed' : 'followed',
      title: followed ? 'Unfollowed' : 'Followed',
      message: `You ${followed ? 'unfollowed' : 'are now following'} ${owner.name}.`,
    });
  };

  const handleViewAll = () => {
    navigate('/search', { state: { ownerFilter: owner.name } });
  };

  const handleAvatarUpload = () => {
    // Demo: create a file input and simulate upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        addNotification({
          type: 'avatar_updated',
          title: 'Avatar Updated',
          message: 'Your profile photo has been updated (demo mode).',
        });
      }
    };
    input.click();
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white', padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}>
          <ChevronLeft size={24} color="#0F172A" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Profile</span>
        <button onClick={() => setShowShareMenu(!showShareMenu)} style={{ padding: 4, position: 'relative' }}>
          <Share2 size={22} color="#0F172A" />
        </button>

        {/* Share Menu Dropdown */}
        {showShareMenu && (
          <>
            <div onClick={() => setShowShareMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
            <div style={{
              position: 'absolute', top: 48, right: 20, background: 'white', borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 200, minWidth: 180, overflow: 'hidden',
            }}>
              {[
                { icon: copied ? '✓' : '🔗', label: copied ? 'Link Copied!' : 'Copy Link', action: handleShare },
                { icon: '💬', label: 'Share via Chat', action: () => { navigate('/messages'); setShowShareMenu(false); } },
              ].map(({ icon, label, action }) => (
                <button key={label} onClick={action} style={{
                  width: '100%', padding: '14px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', fontSize: 14, display: 'flex', gap: 10, alignItems: 'center',
                  borderBottom: '1px solid #F1F5F9',
                }}>{icon} {label}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Profile Hero */}
      <div style={{ padding: '24px 20px', background: 'white', borderBottom: '1px solid #E2E8F0' }}>
        {/* Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3978D5, #73A7E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 28,
            }}>{ownerInitials}</div>
            <button style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white', cursor: 'pointer',
            }} onClick={handleAvatarUpload}>
              <Camera size={14} color="white" />
            </button>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>{owner.name}</h1>
              {owner.verified && (
                <ShieldCheck size={22} color="#2563EB" fill="#DBEAFE" />
              )}
            </div>
            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 8 }}>{owner.username}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} color="#94A3B8" />
                <span style={{ fontSize: 13, color: '#64748B' }}>{owner.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{owner.rating}</span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>({owner.totalReviews})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: '#E2E8F0', borderRadius: 12, overflow: 'hidden', marginBottom: 16,
        }}>
          {[
            { label: 'Listings', value: `${owner.itemsForRent}` },
            { label: 'Rentals', value: owner.completedRentals.toString() },
            { label: 'Response', value: owner.responseRate },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', padding: '14px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: '#64748B' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>{owner.memberSince}</div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleSendMessage}>
            <MessageSquare size={16} /> Send Message
          </button>
          <button className={followed ? 'btn-primary' : 'btn-outline'} style={{ flex: 1 }} onClick={handleFollow}>
            <Heart size={16} fill={followed ? '#2563EB' : 'none'} stroke={followed ? '#2563EB' : '#2563EB'} /> {followed ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div style={{ background: 'white', padding: '20px', borderBottom: '1px solid #F1F5F9' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Rating Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topRatings.map(rating => (
            <div key={rating.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#334155' }}>{rating.category}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{rating.value}</span>
              </div>
              <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${(rating.value / 5) * 100}%`, height: '100%',
                  background: '#2563EB', borderRadius: 3, transition: 'width 0.5s',
                }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 12 }}>
          Response rate: {owner.responseRate} · Response time: {owner.responseTime}
        </p>
      </div>

      {/* About Section */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>About Me</h3>
        <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, marginBottom: 24 }}>{owner.bio}</p>

        {/* My Listings */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>My Listings ({owner.itemsForRent})</h3>
            <button style={{ fontSize: 13, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={handleViewAll}>View All</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {myItems.map(item => (
              <div key={item.id} style={{
                background: 'white', borderRadius: 12, overflow: 'hidden',
                border: '1px solid #E2E8F0',
              }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{item.title}</p>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#2563EB' }}>${item.price}<span style={{ fontSize: 11, color: '#94A3B8' }}>/{item.pricePeriod}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Contact Info</h3>
          {[
            { icon: MapPin, label: 'Location', value: owner.location },
            { icon: MessageSquare, label: 'Response Time', value: owner.responseTime },
            { icon: ShieldCheck, label: 'Verified Member', value: 'ID Verified' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Icon size={16} color="#94A3B8" />
              <span style={{ fontSize: 13, color: '#64748B' }}>{label}:</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}