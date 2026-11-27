import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Camera, Send, ChevronLeft, CheckCircle, Image, Smile, Meh, Frown, XCircle } from 'lucide-react';
import { mockItems } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

export default function ReturnReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rentals, addNotification, updateRental } = useApp();

  const rental = rentals.find(r => r.id === parseInt(id));
  const item = rental ? mockItems.find(i => i.id === rental.itemId || i.title === rental.item) : null;

  const [step, setStep] = useState(1); // 1: return confirmation, 2: review
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [checklist, setChecklist] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [detailedRatings, setDetailedRatings] = useState({
    'Condition Accuracy': 4,
    'Owner Communication': 4,
    'Pickup/Return Process': 4,
    'Value for Money': 4,
  });

  const handleSubmitReview = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    // Mark rental as rated in context (demo mode persistence)
    if (rental) {
      updateRental(rental.id, { rated: true });
    }

    addNotification({
      type: 'review_submitted',
      title: 'Review Submitted',
      message: `Your review for ${item?.title} has been posted.`,
    });

    setSubmitting(false);
    navigate('/my-rentals');
  };

  const handleReturnConfirm = () => {
    setStep(2);
  };

  const toggleChecklist = (index) => {
    setChecklist(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const setDetailRating = (category, value) => {
    setDetailedRatings(prev => ({ ...prev, [category]: value }));
  };

  // Guard: if rental not found, show not found
  if (!rental || !item) {
    return (
      <div className="page" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Rental Not Found</h2>
        <p style={{ color: '#64748B', marginBottom: 24 }}>This rental doesn't exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/my-rentals')}>
          Back to My Rentals
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }}>
          <ChevronLeft size={24} color="#0F172A" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Return & Review</span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Item Info */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 24,
          padding: 12, background: '#F8FAFC', borderRadius: 12,
        }}>
          <img src={item.image} alt={item.title}
            style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
            <p style={{ fontSize: 12, color: '#64748B' }}>Rental ended: {new Date(rental.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: '#FEF2F2', color: '#DC2626',
          }}>Completed</span>
        </div>

        {/* Step 1: Return Confirmation */}
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#E7F7F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle size={40} color="#087F73" />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Confirm Return</h2>
            <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              Please confirm that you have returned <strong>{item.title}</strong> to the owner in good condition.
              Once confirmed, you'll be able to leave a review for your rental experience.
            </p>

            <div style={{
              background: 'white', border: '1px solid #E2E8F0', borderRadius: 12,
              padding: 16, marginBottom: 24, textAlign: 'left',
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Return Checklist</p>
              {[
                'Item is clean and undamaged',
                'All accessories returned',
                'Met owner at agreed location',
                'Received confirmation from owner',
              ].map((check, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checklist[i]}
                    onChange={() => toggleChecklist(i)}
                    style={{ width: 20, height: 20, accentColor: '#2563EB' }}
                  />
                  <span style={{ fontSize: 14, color: '#334155' }}>{check}</span>
                </label>
              ))}
            </div>

            <button className="btn-primary" onClick={handleReturnConfirm} style={{ width: '100%' }}>
              Confirm Return & Write Review
            </button>
          </div>
        )}

        {/* Step 2: Write Review */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>How was your experience?</h3>

            {/* Overall Rating */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Overall Rating</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      padding: 4, background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <Star
                      size={36}
                      fill={star <= rating ? '#F59E0B' : 'none'}
                      stroke={star <= rating ? '#F59E0B' : '#E2E8F0'}
                      strokeWidth={star <= rating ? 0 : 2}
                    />
                  </button>
                ))}
              </div>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 8 }}>
                {rating === 0 ? 'Tap to rate' : ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'][rating - 1]}
              </p>
            </div>

            {/* Detailed Ratings */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Detailed Ratings</p>
              {['Condition Accuracy', 'Owner Communication', 'Pickup/Return Process', 'Value for Money'].map((cat, i) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#334155' }}>{cat}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setDetailRating(cat, star)}
                          style={{ padding: 2, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Star
                            size={20}
                            fill={star <= detailedRatings[cat] ? '#F59E0B' : 'none'}
                            stroke={star <= detailedRatings[cat] ? '#F59E0B' : '#E2E8F0'}
                            strokeWidth={star <= detailedRatings[cat] ? 0 : 1.5}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Text */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Your Review</p>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience... (optional)"
                style={{
                  width: '100%', minHeight: 100, padding: 12, borderRadius: 10,
                  border: '1px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit',
                  resize: 'vertical', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 6, textAlign: 'right' }}>
                {reviewText.length}/500 characters
              </p>
            </div>

            {/* Photos */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Add Photos (optional)</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {photos.map((photo, i) => (
                  <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 10, overflow: 'hidden' }}>
                    <img src={photo} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{
                      position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <XCircle size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <label style={{
                    width: 80, height: 80, borderRadius: 10,
                    border: '2px dashed #E2E8F0', background: '#F8FAFC',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 4, cursor: 'pointer',
                  }}>
                    <Image size={24} color="#94A3B8" />
                    <input type="file" accept="image/*" multiple onChange={e => {
                      Array.from(e.target.files).slice(0, 4 - photos.length).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = ev => setPhotos(prev => [...prev, ev.target.result]);
                        reader.readAsDataURL(file);
                      });
                    }} style={{ display: 'none' }} />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>Add</span>
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              className="btn-primary"
              onClick={handleSubmitReview}
              disabled={submitting || rating === 0}
              style={{ width: '100%', opacity: rating === 0 ? 0.5 : 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 16 }}>
              Your review will be visible to other renters after submission.
            </p>
          </div>
        )}

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}