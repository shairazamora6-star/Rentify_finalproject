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
        background: 'var(--surface)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Profile</span>
        <button onClick={() => setShowShareMenu(!showShareMenu)} style={{ padding: 4, position: 'relative', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <Share2 size={22} color="var(--ink-1)" />
        </button>

        {/* Share Menu Dropdown */}
        {showShareMenu && (
          <>
            <div onClick={() => setShowShareMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
            <div style={{
              position: 'absolute', top: 48, right: 20, background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 200, minWidth: 180, overflow: 'hidden',
              border: '1px solid var(--line-1)',
            }}>
              {[
                { icon: copied ? '✓' : '🔗', label: copied ? 'Link Copied!' : 'Copy Link', action: handleShare },
                { icon: '💬', label: 'Share via Chat', action: () => { navigate('/messages'); setShowShareMenu(false); } },
              ].map(({ icon, label, action }) => (
                <button key={label} onClick={action} style={{
                  width: '100%', padding: '14px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', fontSize: 14, display: 'flex', gap: 10, alignItems: 'center',
                  borderBottom: '1px solid var(--line-2)',
                  transition: 'all 0.15s',
                  color: 'var(--ink-1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; }}
                >{icon} {label}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Profile Hero */}
      <div style={{ padding: '24px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--line-1)' }}>
        {/* Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3978D5, #73A7E5)', // avatar gradient exception
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 28,
            }}>{ownerInitials}</div>
            <button style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--surface)', cursor: 'pointer',
              transition: 'all 0.15s',
            }} onClick={handleAvatarUpload}
            onMouseEnter={e => { e.currentTarget.style.background = '#255ea7'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = ''; }}>
              <Camera size={14} color="var(--surface)" />
            </button>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-1)' }}>{owner.name}</h1>
              {owner.verified && (
                <ShieldCheck size={22} color="var(--accent)" fill="var(--accent-soft)" />
              )}
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 8 }}>{owner.username}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} color="var(--ink-4)" />
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{owner.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={14} fill="#F59E0B" stroke="#F59E0B" /> {/* star-rating exception */}
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-1)' }}>{owner.rating}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>({owner.totalReviews})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: 'var(--line-1)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 16,
        }}>
          {[
            { label: 'Listings', value: `${owner.itemsForRent}` },
            { label: 'Rentals', value: owner.completedRentals.toString() },
            { label: 'Response', value: owner.responseRate },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--surface)', padding: '14px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)' }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 16 }}>{owner.memberSince}</div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleSendMessage}>
            <MessageSquare size={16} /> Send Message
          </button>
          <button className={followed ? 'btn-primary' : 'btn-outline'} style={{ flex: 1 }} onClick={handleFollow}>
            <Heart size={16} fill={followed ? 'var(--accent)' : 'none'} stroke="var(--accent)" /> {followed ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div style={{ background: 'var(--surface)', padding: '20px', borderBottom: '1px solid var(--line-2)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--ink-1)' }}>Rating Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topRatings.map(rating => (
            <div key={rating.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{rating.category}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>{rating.value}</span>
              </div>
              <div style={{ height: 6, background: 'var(--line-1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${(rating.value / 5) * 100}%`, height: '100%',
                  background: 'var(--primary)', borderRadius: 3, transition: 'width 0.5s',
                }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 12 }}>
          Response rate: {owner.responseRate} · Response time: {owner.responseTime}
        </p>
      </div>

      {/* About Section */}
      <div style={{ padding: '20px', background: 'var(--surface-2)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--ink-1)' }}>About Me</h3>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: 24 }}>{owner.bio}</p>

        {/* My Listings */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-1)' }}>My Listings ({owner.itemsForRent})</h3>
            <button style={{ fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }} onClick={handleViewAll}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = ''; }}>
              View All
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {myItems.map(item => (
              <div key={item.id} style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                border: '1px solid var(--line-1)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3, color: 'var(--ink-1)' }}>{item.title}</p>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>${item.price}<span style={{ fontSize: 11, color: 'var(--ink-4)' }}>/{item.pricePeriod}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 24, border: '1px solid var(--line-1)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--ink-1)' }}>Contact Info</h3>
          {[
            { icon: MapPin, label: 'Location', value: owner.location },
            { icon: MessageSquare, label: 'Response Time', value: owner.responseTime },
            { icon: ShieldCheck, label: 'Verified Member', value: 'ID Verified' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Icon size={16} color="var(--ink-4)" />
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{label}:</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-1)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}