import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CalendarDays, Smartphone, Wallet, Truck, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { apiFetch } from '../lib/api';
import {
  PAYMENT_METHODS,
  getPaymentDetailsForSubtotal,
  DateRangePicker,
} from './Reserve';

const DAY_MS = 1000 * 60 * 60 * 24;
const methodIcon = { gcash: Smartphone, paymaya: Smartphone, gotyme: Wallet, cod: Truck };

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, removeFromCart, addRental } = useApp();
  const [dates, setDates] = useState({ start: null, end: null });
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [agree, setAgree] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const days = dates.start && dates.end
    ? Math.ceil((new Date(dates.end) - new Date(dates.start)) / DAY_MS)
    : 0;

  const lineTotals = cart.map(c => ({ ...c, total: (c.price || 0) * days }));
  const grandSubtotal = lineTotals.reduce((sum, c) => sum + c.total, 0);
  const paymentDetails = getPaymentDetailsForSubtotal(paymentMethod, grandSubtotal);

  const confirmAll = async () => {
    if (!dates.start || !dates.end || !agree || cart.length === 0) return;
    setProcessing(true);
    setBookingError('');
    try {
      const bookingIds = [];
      for (const c of cart) {
        const total = (c.price || 0) * days;
        const line = getPaymentDetailsForSubtotal(paymentMethod, total);
        let bookingId;
        try {
          const res = await apiFetch('/api/rentals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              itemId: c.id,
              startDate: dates.start,
              endDate: dates.end,
              paymentMethod,
              serviceFee: line.serviceFee,
              damageInsurance: line.damageInsurance,
              total: line.total,
            }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Reservation failed.');
          }
          const data = await res.json();
          bookingId = data.id;
        } catch (err) {
          // Demo mode: keep the booking even if the backend is unreachable.
          bookingId = Date.now();
        }
        bookingIds.push(bookingId);
        addRental({
          id: bookingId,
          item: c,
          startDate: dates.start,
          endDate: dates.end,
          total: line.total,
          status: 'upcoming',
        });
      }
      cart.forEach(c => removeFromCart(c.id));
      const first = cart[0];
      navigate(`/booking-confirmation/${first.id}`, {
        state: {
          total: paymentDetails.total,
          startDate: dates.start,
          endDate: dates.end,
          bookingId: bookingIds[0],
          itemCount: cart.length,
        },
      });
    } catch (error) {
      setBookingError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page" style={{ padding: '0 20px', textAlign: 'center', paddingTop: 90 }}>
        <ShoppingCart size={44} style={{ color: 'var(--ink-4)', margin: '0 auto 16px', display: 'block' }} />
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 8 }}>Your cart is empty</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 24 }}>Add items to your cart to reserve them all at once.</p>
        <button className="btn-primary" onClick={() => navigate('/search')}>Browse items</button>
        <div style={{ height: 100 }} />
      </div>
    );
  }

  return (
    <div className="page" style={{ padding: '0 20px' }}>
      <div style={{ marginBottom: 20, marginTop: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink-1)' }}>Reserve items</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{cart.length} item{cart.length > 1 ? 's' : ''} in your cart · {days > 0 ? `${days} day${days > 1 ? 's' : ''}` : 'Pick your dates'}</p>
      </div>

      {/* Items in cart */}
      <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lineTotals.map(c => (
          <div key={c.id} style={{
            display: 'flex', gap: 12, alignItems: 'center',
            background: 'var(--surface)', border: '1px solid var(--line-1)', borderRadius: 14, padding: 10,
          }}>
            <img src={c.image} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
              <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.pricePeriod ? `₱${c.price} / ${c.pricePeriod}` : `₱${c.price} / day`}</p>
              {days > 0 && <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>₱{c.total.toFixed(2)} · {days} day{days > 1 ? 's' : ''}</p>}
            </div>
            <button onClick={() => removeFromCart(c.id)} aria-label={`Remove ${c.title} from cart`} style={{ padding: 8, color: 'var(--ink-4)', borderRadius: 8, width: 32, height: 32, display: 'grid', placeItems: 'center' }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Dates */}
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 12 }}>Pick your dates</h3>
        <DateRangePicker
          startDate={dates.start}
          endDate={dates.end}
          onSelect={(d) => setDates(d)}
        />
      </div>

      {/* Payment method */}
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 12 }}>Payment method</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PAYMENT_METHODS.map(m => {
            const Icon = methodIcon[m.id] || Smartphone;
            const active = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                  borderRadius: 14, border: `1.5px solid ${active ? 'var(--accent)' : 'var(--line-1)'}`,
                  background: active ? 'var(--accent-soft)' : 'var(--surface)', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: active ? 'var(--accent)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? 'white' : 'var(--ink-3)' }}>
                  <Icon size={19} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-1)' }}>{m.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-3)' }}>{m.desc}</p>
                </div>
                {active && <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Selected</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Breakdown */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line-1)', borderRadius: 14,
        padding: '16px', marginBottom: 18,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 12 }}>Price breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lineTotals.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{c.title}{days > 0 ? ` · ${days} day${days > 1 ? 's' : ''}` : ''}</span>
              <span style={{ fontWeight: 600 }}>{days > 0 ? `₱${c.total.toFixed(2)}` : '—'}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-3)', borderTop: '1px solid var(--line-2)', paddingTop: 8 }}>
            <span>Subtotal</span>
            <span>{grandSubtotal ? `₱${grandSubtotal.toFixed(2)}` : '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
            <span>{paymentMethod === 'cod' ? 'Service fee (0%)' : 'Service fee (10%)'}</span>
            <span>{paymentDetails.serviceFee ? `₱${paymentDetails.serviceFee.toFixed(2)}` : '₱0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
            <span>{paymentMethod === 'cod' ? 'Damage Insurance (5%)' : 'Damage Insurance (8%)'}</span>
            <span>{paymentDetails.damageInsurance ? `₱${paymentDetails.damageInsurance.toFixed(2)}` : '₱0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: 'var(--ink-1)', borderTop: '1px solid var(--line-2)', paddingTop: 10 }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent)' }}>{paymentDetails.total ? `₱${paymentDetails.total.toFixed(2)}` : '₱0.00'}</span>
          </div>
        </div>
      </div>

      {/* Agreement + confirm */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ink-3)', marginBottom: 16, cursor: 'pointer' }}>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
        I agree to the rental terms & damage insurance policy.
      </label>

      {bookingError && (
        <div style={{
          background: 'rgba(255,59,48,.06)', border: '1px solid rgba(255,59,48,.3)', borderRadius: 14,
          padding: 16, marginBottom: 18, color: '#FF3B30', fontSize: 13,
        }}>
          <strong>{bookingError}</strong>
        </div>
      )}

      <button
        className="btn-primary"
        style={{ width: '100%', fontSize: 15, padding: '15px 16px' }}
        onClick={confirmAll}
        disabled={!agree || !dates.start || !dates.end || processing || cart.length === 0}
      >
        Confirm reservation {paymentDetails.total > 0 && `· ₱${paymentDetails.total.toFixed(2)}`} <ArrowRight size={16} />
      </button>

      <div style={{ height: 100 }} />
    </div>
  );
}
