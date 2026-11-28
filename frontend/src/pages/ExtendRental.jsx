import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, Loader2, ChevronLeft, CreditCard, Smartphone, Wallet, Truck } from 'lucide-react';
import { mockItems } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

export default function ExtendRental() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rentals, addNotification, updateRental } = useApp();

  const rental = rentals.find(r => r.id === parseInt(id));
  const item = rental ? mockItems.find(i => i.id === rental.itemId || i.title === rental.item) : null;

  const [step, setStep] = useState(1); // 1: dates, 2: review, 3: payment
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [processing, setProcessing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selecting, setSelecting] = useState('start');

  // Parse the rental end date correctly - handle both string formats
  const parseRentalEndDate = (dateStr) => {
    if (!dateStr) return null;
    // Try parsing as ISO string first
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Try parsing as "Nov 28" format with current year
      date = new Date(`${dateStr}, ${new Date().getFullYear()}`);
    }
    if (isNaN(date.getTime())) {
      // Try parsing with year
      date = new Date(dateStr);
    }
    return date;
  };

  const rentalEndDate = parseRentalEndDate(rental?.endDate);

  useEffect(() => {
    if (rentalEndDate) {
      const start = new Date(rentalEndDate);
      const end = new Date(rentalEndDate);
      end.setDate(end.getDate() + 1);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
      calculateTotal();
    }
  }, [rentalEndDate]);

  const calculateTotal = () => {
    if (startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Calculate days: end date - start date (e.g., Nov 29 to Nov 30 = 1 day)
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalDays(days > 0 ? days : 0);
      setTotalPrice(days > 0 ? days * item.price : 0);
    }
  };

  const getPaymentDetails = (method) => {
    const subtotal = totalPrice;
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

  const handleExtend = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));

    // Update rental with extension in context (demo mode persistence)
    if (rental) {
      updateRental(rental.id, {
        endDate: new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        extendedEndDate: new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        extensionStatus: 'pending',
        extended: true,
        extensionPending: true,
      });
    }

    addNotification({
      type: 'extension_requested',
      title: 'Extension Requested',
      message: `Your extension request for ${item?.title} has been sent to the owner.`,
    });

    setProcessing(false);
    navigate(`/extend-rental-pending/${id}`);
  };

  const renderCalendar = () => {
    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const startDay = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = rentalEndDate || today;
    minDate.setHours(0, 0, 0, 0);

    const days = [];
    // Empty cells for start of month
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} />);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), d);
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < minDate;
      const isStart = dateStr === startDate;
      const isEnd = dateStr === endDate;
      const isInRange = startDate && endDate && date > new Date(startDate) && date < new Date(endDate);
      const isSelected = isStart || isEnd;

      days.push(
        <button
          key={d}
          onClick={() => !isPast && handleDateSelect(dateStr)}
          disabled={isPast}
          style={{
            width: 36, height: 36,
            border: 'none',
            fontSize: 13, fontWeight: isSelected ? 700 : 500,
            color: isPast ? '#CBD5E1' : isSelected ? 'white' : isInRange ? '#2563EB' : '#0F172A',
            backgroundColor: isStart ? '#2563EB' : isEnd ? '#2563EB' : isInRange ? '#EFF6FF' : 'transparent',
            borderRadius: isStart ? '8px 0 0 8px' : isEnd ? '0 8px 8px 0' : isInRange ? 0 : 8,
            cursor: isPast ? 'not-allowed' : 'pointer',
          }}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const handleDateSelect = (dateStr) => {
    if (selecting === 'start') {
      setStartDate(dateStr);
      setSelecting('end');
      // Auto-set end date to next day
      const next = new Date(dateStr);
      next.setDate(next.getDate() + 1);
      setEndDate(next.toISOString().split('T')[0]);
    } else {
      if (new Date(dateStr) <= new Date(startDate)) {
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
      setSelecting('start');
      calculateTotal();
    }
  };

  if (!rental || !item) return <div className="page">Loading...</div>;

  const steps = [
    { num: 1, label: 'Dates' },
    { num: 2, label: 'Review' },
    { num: 3, label: 'Payment' },
  ];

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
        <span style={{ fontWeight: 700, fontSize: 18 }}>Extend Rental</span>
      </div>

      {/* Progress Steps with connector lines */}
      <div style={{ padding: '16px 20px 8px', background: 'white', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ flex: 1, textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: 10, left: 'calc(50% + 11px)', right: 'calc(50% + 11px)',
                  height: 2, background: step > i + 1 ? '#2563EB' : '#E2E8F0', zIndex: 0,
                }} />
              )}
              <div style={{
                width: 22, height: 22, borderRadius: '50%', margin: '0 auto 6px',
                background: step >= s.num ? '#2563EB' : '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 11, fontWeight: 700, position: 'relative', zIndex: 1,
              }}>{s.num}</div>
              <p style={{ fontSize: 11, fontWeight: 600, color: step >= s.num ? '#2563EB' : '#94A3B8' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Item Info - Fixed horizontal alignment */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 20,
          padding: 12, background: '#F8FAFC', borderRadius: 12,
          alignItems: 'center',
        }}>
          <img src={item.image} alt={item.title}
            style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
            <p style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Current rental ends: {new Date(rental.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: '#FEF3C7', color: '#92400E',
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>Active</span>
        </div>

        {/* Step 1: Select Dates */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select Extension Dates</h3>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                onClick={() => { setSelecting('start'); setShowCalendar(true); }}
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: 12,
                  border: `2px solid ${selecting === 'start' ? '#2563EB' : '#E2E8F0'}`,
                  background: 'white', textAlign: 'left',
                }}
              >
                <p style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Start Date</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>
                  {startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select'}
                </p>
              </button>
              <button
                onClick={() => { setSelecting('end'); setShowCalendar(true); }}
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: 12,
                  border: `2px solid ${selecting === 'end' ? '#2563EB' : '#E2E8F0'}`,
                  background: 'white', textAlign: 'left',
                }}
              >
                <p style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>End Date</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>
                  {endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select'}
                </p>
              </button>
            </div>

            {showCalendar && (
              <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto',
                background: 'white', borderRadius: '20px 20px 0 0', padding: '20px',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.15)', zIndex: 100,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>
                    {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button onClick={() => setShowCalendar(false)} style={{ padding: 8 }}>
                    <XCircle size={24} color="#64748B" />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4, marginBottom: 8 }}>
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94A3B8', padding: '8px 0' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4 }}>
                  {renderCalendar()}
                </div>
                <div style={{ height: 'env(safe-area-inset-bottom)' }} />
              </div>
            )}

            {totalDays > 0 && (
              <div style={{
                padding: '16px', background: '#EFF6FF', borderRadius: 12, marginBottom: 20,
              }}>
                <p style={{ fontSize: 13, color: '#1E40AF', marginBottom: 4 }}>
                  Extension: <strong>{totalDays} day{totalDays !== 1 ? 's' : ''}</strong>
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#2563EB' }}>
                  Additional: ${totalPrice}
                </p>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={() => setStep(2)}
              disabled={!startDate || !endDate || totalDays <= 0}
              style={{ opacity: startDate && endDate && totalDays > 0 ? 1 : 0.5 }}
            >
              Continue to Review
            </button>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Review Extension</h3>

            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748B' }}>{totalDays} day{totalDays !== 1 ? 's' : ''} extension</span>
                <span style={{ fontWeight: 600 }}>${totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748B' }}>Service fee (10%)</span>
                <span style={{ fontWeight: 600 }}>${paymentDetails.serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748B' }}>Tax (8%)</span>
                <span style={{ fontWeight: 600 }}>${paymentDetails.tax.toFixed(2)}</span>
              </div>
              <hr style={{ borderColor: '#F1F5F9', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#2563EB' }}>
                  ${paymentDetails.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 10, padding: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <AlertCircle size={18} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginBottom: 4 }}>
                    Owner approval required
                  </p>
                  <p style={{ fontSize: 12, color: '#92400E' }}>
                    This extension request will be sent to the owner for approval. Your rental continues until they respond.
                  </p>
                </div>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ width: 20, height: 20, accentColor: '#2563EB', marginTop: 2 }}
              />
              <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                I agree to the <a href="#" style={{ color: '#2563EB' }}>Rental Extension Terms</a> and authorize the additional charge.
              </span>
            </label>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
              <button className="btn-primary" onClick={() => setStep(3)} disabled={!agreed} style={{ flex: 1, opacity: agreed ? 1 : 0.5 }}>
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Payment Method</h3>

            {[
              { id: 'gcash', label: 'GCash', icon: <Smartphone size={20} />, desc: 'Home delivery • 10% Service fee • 8% Tax' },
              { id: 'paymaya', label: 'PayMaya', icon: <Smartphone size={20} />, desc: 'Home delivery • 10% Service fee • 8% Tax' },
              { id: 'gotyme', label: 'GoTyme', icon: <Wallet size={20} />, desc: 'Home delivery • 10% Service fee • 8% Tax' },
              { id: 'cod', label: 'Cash on Delivery (COD)', icon: <Truck size={20} />, desc: 'Face-to-face pickup • No delivery fee • 5% Damage Insurance' },
            ].map(method => {
              const details = getPaymentDetails(method.id);
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px', borderRadius: 12, marginBottom: 12,
                    border: `2px solid ${paymentMethod === method.id ? '#2563EB' : '#E2E8F0'}`,
                    background: paymentMethod === method.id ? '#EFF6FF' : 'white',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    border: `2px solid ${paymentMethod === method.id ? '#2563EB' : '#CBD5E1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: paymentMethod === method.id ? '#EEF2FF' : '#F8FAFC',
                    color: paymentMethod === method.id ? '#2563EB' : '#64748B',
                    flexShrink: 0,
                  }}>
                    {method.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {method.label}
                    </p>
                    <p style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {method.desc}
                    </p>
                  </div>
                  {paymentMethod === method.id && (
                    <CheckCircle size={22} color="#2563EB" />
                  )}
                </button>
              );
            })}

            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#64748B' }}>Extension ({totalDays} days)</span>
                <span style={{ fontWeight: 600 }}>${paymentDetails.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#64748B' }}>
                  {paymentMethod === 'cod' ? 'Damage Insurance (5%)' : 'Service fee (10%)'}
                </span>
                <span style={{ fontWeight: 600 }}>${paymentDetails.serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#64748B' }}>
                  {paymentMethod === 'cod' ? 'Tax' : 'Tax (8%)'}
                </span>
                <span style={{ fontWeight: 600 }}>${paymentDetails.tax.toFixed(2)}</span>
              </div>
              <hr style={{ borderColor: '#F1F5F9', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Total to Pay</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#2563EB' }}>
                  ${paymentDetails.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleExtend}
              disabled={processing}
              style={{ width: '100%' }}
            >
              {processing ? (
                <> <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
              ) : (
                `Confirm & Pay $${paymentDetails.total.toFixed(2)}`
              )}
            </button>

            <style>{`
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}