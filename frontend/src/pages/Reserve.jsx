import { useState } from 'react';
import { ChevronLeft, CalendarDays, Smartphone, Wallet, Truck } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockItems } from '../data/mockData';
import { useApp } from '../contexts/AppContext';
import { apiFetch } from '../lib/api';

// Custom date range picker
function DateRangePicker({ startDate, endDate, onSelect, minDate }) {
  const today = minDate || new Date();
  today.setHours(0, 0, 0, 0);
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

  const isPast = (d) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '18px 16px', border: '1px solid var(--line-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', border: '1px solid var(--line-1)', fontSize: 16, color: 'var(--ink-1)' }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-1)' }}>{monthName}</span>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', border: '1px solid var(--line-1)', fontSize: 16, color: 'var(--ink-1)' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4, textAlign: 'center' }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <span key={d} style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 600, padding: '4px 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>{d}</span>
        ))}
        {days.map((d, i) => d ? (() => {
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
          const isToday = date.toDateString() === today.toDateString();
          const selected = isSelected(d);
          const start = isStart(d);
          const end = isEnd(d);
          const past = isPast(d);
          return (
            <button
              key={i}
              onClick={() => {
                if (past) return;
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
              }}
              disabled={past}
              style={{
                width: '100%', maxWidth: 38, height: 38, borderRadius: selected ? 12 : 10,
                fontSize: 13, fontWeight: 500,
                background: selected ? 'var(--accent)' : isToday ? 'var(--accent-soft)' : past ? 'var(--surface-2)' : 'transparent',
                color: selected ? 'white' : isToday ? 'var(--accent)' : past ? 'var(--ink-4)' : 'var(--ink-1)',
                border: isToday && !selected ? '1.5px solid var(--accent-line)' : past ? '1.5px solid var(--line-2)' : '1.5px solid transparent',
                cursor: past ? 'not-allowed' : 'pointer', margin: '2px auto', position: 'relative',
                opacity: past ? 0.5 : 1,
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
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarDays size={16} color="var(--accent)" />
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
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

  const getPaymentDetails = (method) => {
    let serviceFee = 0;
    let tax = 0;
    let label = '';
    let icon = null;
    let description = '';

    switch (method) {
      case 'cod':
        // COD: No service fee (F2F pickup), Insurance fee (tax) = 5%
        serviceFee = 0;
        tax = subtotal * 0.05;
        label = 'Cash on Delivery (COD)';
        icon = <Truck size={20} />;
        description = 'Face-to-face pickup • No delivery fee • 5% Damage Insurance';
        break;
      case 'gcash':
        // E-Wallets: 10% delivery fee + 8% tax
        serviceFee = subtotal * 0.10;
        tax = subtotal * 0.08;
        label = 'GCash';
        icon = <Smartphone size={20} />;
        description = 'Home delivery • 10% Service fee • 8% Tax';
        break;
      case 'paymaya':
        serviceFee = subtotal * 0.10;
        tax = subtotal * 0.08;
        label = 'PayMaya';
        icon = <Smartphone size={20} />;
        description = 'Home delivery • 10% Service fee • 8% Tax';
        break;
      case 'gotyme':
        serviceFee = subtotal * 0.10;
        tax = subtotal * 0.08;
        label = 'GoTyme';
        icon = <Wallet size={20} />;
        description = 'Home delivery • 10% Service fee • 8% Tax';
        break;
      default:
        serviceFee = subtotal * 0.10;
        tax = subtotal * 0.08;
        label = 'GCash';
        icon = <Smartphone size={20} />;
        description = 'Home delivery • 10% Service fee • 8% Tax';
    }

    return { subtotal, serviceFee, tax, total: subtotal + serviceFee + tax, label, icon, description };
  };

  const paymentDetails = getPaymentDetails(paymentMethod);

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
        background: 'var(--surface)', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--line-2)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line-1)', background: 'var(--surface-2)', fontSize: 18, color: 'var(--ink-1)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; e.currentTarget.style.background = 'var(--surface)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink-1)' }}>Reserve</span>
        <div style={{ flex: 1, display: 'flex', gap: 5, justifyContent: 'flex-end', paddingRight: 8 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 2, flex: 1,
              background: i + 1 <= step ? 'var(--accent)' : 'var(--line-1)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Step Indicator with connector lines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          {steps.map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  background: i + 1 < step ? 'var(--accent)' : i + 1 === step ? 'var(--accent-soft)' : 'var(--line-2)',
                  color: i + 1 <= step ? 'var(--accent)' : 'var(--ink-4)',
                  border: i + 1 === step ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'all 0.3s',
                  zIndex: 1,
                }}>{i + 1}</div>
                <span style={{ fontSize: 11, fontWeight: i + 1 === step ? 600 : 400, color: i + 1 <= step ? 'var(--ink-1)' : 'var(--ink-4)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: 15, left: 'calc(50% + 16px)', right: 'calc(50% + 16px)',
                  height: 2, background: i + 1 < step ? 'var(--accent)' : 'var(--line-1)', zIndex: 0,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Item Summary */}
        <div style={{
          display: 'flex', gap: 14, padding: '14px 16px',
          background: 'var(--surface-1)', borderRadius: 14, border: '1px solid var(--line-1)', marginBottom: 24,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <img src={item.image} alt={item.title} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-1)', marginBottom: 4 }}>{item.title}</p>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {item.location}
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', marginTop: 6 }}>${item.price}<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-3)' }}>/day</span></p>
          </div>
        </div>

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <>
            <DateRangePicker startDate={dates.start} endDate={dates.end} onSelect={setDates} minDate={new Date()} />
            {days > 0 && (
              <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--accent-soft)', borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>Duration</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>Dates</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
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
            <div style={{ background: 'var(--surface-1)', borderRadius: 16, padding: '18px 16px', border: '1px solid var(--line-1)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--ink-1)' }}>Price Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>${item.price} × {days} days</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${paymentDetails.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  {paymentMethod === 'cod' ? 'Damage Insurance (5%)' : 'Service fee (10%)'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${paymentDetails.serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  {paymentMethod === 'cod' ? 'Tax' : 'Tax (8%)'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${paymentDetails.tax.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: 'var(--line-2)', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>${paymentDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{
              background: 'var(--surface-1)', borderRadius: 16, padding: '18px 16px',
              border: '1px solid var(--line-1)', marginBottom: 20, maxHeight: 180, overflowY: 'auto',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--ink-1)' }}>Rental Agreement</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.8 }}>
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
              background: agreed ? 'var(--accent-soft)' : 'var(--surface)',
              border: `1.5px solid ${agreed ? 'var(--accent)' : 'var(--line-1)'}`,
              borderRadius: 14, cursor: 'pointer', marginBottom: 24,
              transition: 'all 0.15s',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                border: `2px solid ${agreed ? 'var(--accent)' : 'var(--line-1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: agreed ? 'var(--accent)' : 'var(--surface)',
                transition: 'all 0.15s',
              }}>
                {agreed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ display: 'none' }} />
              <span style={{ fontSize: 14, color: 'var(--ink-1)', fontWeight: 500 }}>I have read and agree to the Rental Agreement</span>
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
            <div style={{ background: 'var(--surface-1)', borderRadius: 16, padding: '18px 16px', border: '1px solid var(--line-1)', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>${item.price} × {days} days</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${paymentDetails.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  {paymentMethod === 'cod' ? 'Damage Insurance (5%)' : 'Service fee (10%)'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${paymentDetails.serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  {paymentMethod === 'cod' ? 'Tax' : 'Tax (8%)'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${paymentDetails.tax.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: 'var(--line-2)', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)' }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>${paymentDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--ink-1)' }}>Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {[
                { id: 'gcash', label: 'GCash', icon: <Smartphone size={20} />, desc: 'Home delivery • 10% Service fee • 8% Tax' },
                { id: 'paymaya', label: 'PayMaya', icon: <Smartphone size={20} />, desc: 'Home delivery • 10% Service fee • 8% Tax' },
                { id: 'gotyme', label: 'GoTyme', icon: <Wallet size={20} />, desc: 'Home delivery • 10% Service fee • 8% Tax' },
                { id: 'cod', label: 'Cash on Delivery (COD)', icon: <Truck size={20} />, desc: 'Face-to-face pickup • No delivery fee • 5% Damage Insurance' },
              ].map((method) => {
                const details = getPaymentDetails(method.id);
                return (
                  <button key={method.id} onClick={() => setPaymentMethod(method.id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px', borderRadius: 12,
                    border: `2px solid ${paymentMethod === method.id ? 'var(--accent)' : 'var(--line-1)'}`,
                    background: paymentMethod === method.id ? 'var(--accent-softer)' : 'var(--surface)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      border: `2px solid ${paymentMethod === method.id ? 'var(--accent)' : 'var(--line-1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: paymentMethod === method.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                      color: paymentMethod === method.id ? 'var(--accent)' : 'var(--ink-3)',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}>
                      {method.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {method.label}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {method.desc}
                      </p>
                    </div>
                    {paymentMethod === method.id && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                );
              })}
            </div>

            {bookingError && <p role="alert" style={{ marginBottom: 14, color: 'var(--danger)', fontSize: 13 }}>{bookingError}</p>}
            <button onClick={confirmRental} disabled={isSubmitting} className="btn-primary" style={{ opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Saving reservation…' : `Confirm reservation · $${paymentDetails.total.toFixed(2)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
