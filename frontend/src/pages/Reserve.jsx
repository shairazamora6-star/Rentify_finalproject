import { useState } from 'react';
import { ChevronLeft, CalendarDays } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockItems } from '../data/mockData';
import { useApp } from '../contexts/AppContext';
import { apiFetch } from '../lib/api';

// Custom date range picker
function DateRangePicker({ startDate, endDate, onSelect }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return d;
  });
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const isSelected = (d) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end && date >= start && date <= end) return true;
    if (start && date.getTime() === start.getTime()) return true;
    if (end && date.getTime() === end.getTime()) return true;
    return false;
  };

  const isStart = (d) => {
    if (!startDate) return false;
    return new Date(viewDate.getFullYear(), viewDate.getMonth(), d).getTime() === new Date(startDate).getTime();
  };
  const isEnd = (d) => {
    if (!endDate) return false;
    return new Date(viewDate.getFullYear(), viewDate.getMonth(), d).getTime() === new Date(endDate).getTime();
  };

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 16, color: '#0F172A' }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{monthName}</span>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 16, color: '#0F172A' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4, textAlign: 'center' }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <span key={d} style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, padding: '4px 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>{d}</span>
        ))}
        {days.map((d, i) => d ? (() => {
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
          const isToday = date.toDateString() === today.toDateString();
          const selected = isSelected(d);
          const start = isStart(d);
          const end = isEnd(d);
          return (
            <button key={i} onClick={() => {
              const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
              if (!startDate || (endDate && date <= endDate) || !endDate) {
                if (!startDate || (startDate && endDate)) {
                  onSelect({ start: date.toISOString(), end: null });
                } else if (!endDate) {
                  if (date < new Date(startDate)) {
                    onSelect({ start: date.toISOString(), end: new Date(startDate) });
                  } else {
                    onSelect({ start: startDate, end: date.toISOString() });
                  }
                }
              }
            }} style={{
              width: '100%', maxWidth: 38, height: 38, borderRadius: selected ? 12 : 10,
              fontSize: 13, fontWeight: 500,
              background: selected ? '#2563EB' : isToday ? '#EEF2FF' : 'transparent',
              color: selected ? 'white' : isToday ? '#2563EB' : '#0F172A',
              border: isToday && !selected ? '1.5px solid #BFDBFE' : '1.5px solid transparent',
              cursor: 'pointer', margin: '2px auto', position: 'relative',
            }}>
              {d}
              {start && <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'white' }} />}
              {end && <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'white' }} />}
            </button>
          );
        })() : (
          <div key={i} style={{ padding: '2px 0' }} />
        ))}
      </div>
      {startDate && endDate && (
        <div style={{ marginTop: 16, padding: '12px 14px', background: '#EEF2FF', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarDays size={16} color="#2563EB" />
          <span style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600 }}>
            {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Reserve() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, user, addRental } = useApp();
  const item = items.find(i => i.id === parseInt(id)) || mockItems.find(i => i.id === parseInt(id));
  const [step, setStep] = useState(1);
  const [dates, setDates] = useState({ start: null, end: null });
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return <div>Item not found</div>;

  const days = dates.start && dates.end
    ? Math.ceil((new Date(dates.end) - new Date(dates.start)) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = days * item.price;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const steps = ['Select Dates', 'Review & Agree', 'Payment'];

  const confirmRental = async () => {
    setBookingError('');
    if (!dates.start || !dates.end || days < 1) {
      setBookingError('Choose a valid rental date range before continuing.');
      setStep(1);
      return;
    }
    if (!user?.id) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          itemId: item.id,
          startDate: dates.start,
          endDate: dates.end,
          total,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save this reservation.');
      addRental({
        id: result.id,
        item,
        startDate: dates.start,
        endDate: dates.end,
        total,
        status: 'upcoming',
      });
      navigate(`/booking-confirmation/${id}`, {
        state: { total, startDate: dates.start, endDate: dates.end, bookingId: result.id },
      });
    } catch (error) {
      setBookingError(error.message || 'Unable to save this reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid #F1F5F9',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 18, color: '#0F172A' }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>Reserve</span>
        <div style={{ flex: 1, display: 'flex', gap: 5, justifyContent: 'flex-end', paddingRight: 8 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 2, flex: 1,
              background: i + 1 <= step ? '#2563EB' : '#E2E8F0',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          {steps.map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                background: i + 1 < step ? '#2563EB' : i + 1 === step ? '#EEF2FF' : '#F1F5F9',
                color: i + 1 <= step ? '#2563EB' : '#94A3B8',
                border: i + 1 === step ? '2px solid #2563EB' : '2px solid transparent',
                transition: 'all 0.3s',
              }}>{i + 1}</div>
              <span style={{ fontSize: 11, fontWeight: i + 1 === step ? 600 : 400, color: i + 1 <= step ? '#0F172A' : '#94A3B8' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Item Summary */}
        <div style={{
          display: 'flex', gap: 14, padding: '14px 16px',
          background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <img src={item.image} alt={item.title} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 4 }}>{item.title}</p>
            <p style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {item.location}
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#2563EB', marginTop: 6 }}>${item.price}<span style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>/day</span></p>
          </div>
        </div>

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <>
            <DateRangePicker startDate={dates.start} endDate={dates.end} onSelect={setDates} />
            {days > 0 && (
              <div style={{ marginTop: 16, padding: '14px 16px', background: '#EEF2FF', borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>Duration</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF' }}>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>Dates</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1E40AF' }}>
                    {new Date(dates.start).toLocaleDateString()} → {new Date(dates.end).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
            <button onClick={() => setStep(2)} disabled={!dates.start || !dates.end || days < 1}
              className="btn-primary" style={{ marginTop: 24, opacity: dates.start && dates.end && days > 0 ? 1 : 0.5, cursor: dates.start && dates.end && days > 0 ? 'pointer' : 'not-allowed' }}>
              Continue
            </button>
          </>
        )}

        {/* Step 2: Review & Agreement */}
        {step === 2 && (
          <>
            <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px', border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#0F172A' }}>Price Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: '#64748B' }}>${item.price} × {days} days</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: '#64748B' }}>Service fee</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${serviceFee}</span>
              </div>
              <div style={{ height: 1, background: '#F1F5F9', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#2563EB' }}>${total}</span>
              </div>
            </div>

            <div style={{
              background: 'white', borderRadius: 16, padding: '18px 16px',
              border: '1px solid #E2E8F0', marginBottom: 20, maxHeight: 180, overflowY: 'auto',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#0F172A' }}>Rental Agreement</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.8 }}>
                By confirming this reservation, you agree to the following terms:<br/><br/>
                1. You are responsible for the item during the entire rental period.<br/>
                2. The item must be returned in the same condition as received.<br/>
                3. Late returns may incur additional daily charges.<br/>
                4. Damages will be deducted from your security deposit.<br/>
                5. Both parties agree to resolve disputes through mediation.<br/>
                6. Cancellation policies apply as stated in the cancellation terms.
              </p>
            </div>

            <label style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              background: agreed ? '#EEF2FF' : 'white',
              border: `1.5px solid ${agreed ? '#2563EB' : '#E2E8F0'}`,
              borderRadius: 14, cursor: 'pointer', marginBottom: 24,
              transition: 'all 0.15s',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                border: `2px solid ${agreed ? '#2563EB' : '#CBD5E1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: agreed ? '#2563EB' : 'white',
                transition: 'all 0.15s',
              }}>
                {agreed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ display: 'none' }} />
              <span style={{ fontSize: 14, color: '#0F172A', fontWeight: 500 }}>I have read and agree to the Rental Agreement</span>
            </label>

            <button onClick={() => setStep(3)} disabled={!agreed}
              className="btn-primary" style={{ opacity: agreed ? 1 : 0.5, cursor: agreed ? 'pointer' : 'not-allowed' }}>
              Continue to Payment
            </button>
          </>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <>
            <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px', border: '1px solid #E2E8F0', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: '#64748B' }}>${item.price} × {days} days</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: '#64748B' }}>Service fee</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${serviceFee}</span>
              </div>
              <div style={{ height: 1, background: '#F1F5F9', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>${total}</span>
              </div>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#0F172A' }}>Payment Method</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              {[
                { label: 'Visa', suffix: '•••• 4242', icon: '💳' },
                { label: 'Mastercard', suffix: '•••• 8888', icon: '💳' },
                { label: 'PayPal', suffix: 'j***@email.com', icon: '🅿️' },
              ].map((method, i) => (
                <button key={i} onClick={() => setPaymentMethod(i)} style={{
                  flex: 1, padding: '14px 8px', borderRadius: 14,
                  border: paymentMethod === i ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                  background: paymentMethod === i ? '#EEF2FF' : 'white',
                  fontSize: 12, fontWeight: 600, color: '#0F172A',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{method.icon}</div>
                  {method.label}
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{method.suffix}</div>
                </button>
              ))}
            </div>

            {bookingError && <p role="alert" style={{ marginBottom: 14, color: '#B42318', fontSize: 13 }}>{bookingError}</p>}
            <button onClick={confirmRental} disabled={isSubmitting} className="btn-primary" style={{ opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Saving reservation…' : `Confirm reservation · $${total}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
