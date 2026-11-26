import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LifeBuoy, MessageSquare, Phone, Mail, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpSupport() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([
    {
      question: 'How do I create an account?',
      answer: 'Click the Sign Up button, enter your email and password, and verify your email address.',
      open: false,
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, and bank transfers.',
      open: false,
    },
    {
      question: 'How do I cancel a booking?',
      answer: 'Go to My Rentals, select the booking, and click Cancel. Follow the prompts for cancellation reasons.',
      open: false,
    },
    {
      question: 'What if I have an issue with my rental?',
      answer: 'Contact the owner directly via Messages or call our support team at +1 (800) 555-1234.',
      open: false,
    },
    {
      question: 'How do I become an owner?',
      answer: 'Go to Account Settings > Become an Owner and complete the verification process.',
      open: false,
    },
  ]);

  const toggleFAQ = (index) => {
    setFaqs(faqs.map((faq, i) => (
      i === index ? { ...faq, open: !faq.open } : faq
    )));
  };

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
        <span style={{ fontWeight: 700, fontSize: 18 }}>Help & Support</span>
      </div>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
        padding: '32px 20px', textAlign: 'center', color: 'white',
      }}>
        <LifeBuoy size={48} strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Need Help?</h1>
        <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 24 }}>We're here to assist you with any questions or issues.</p>
        <button className="btn-primary" style={{
          background: 'white', color: '#2563EB', padding: '12px 24px',
          borderRadius: 8, fontWeight: 600,
        }}>
          Contact Support
        </button>
      </div>

      {/* FAQ Section */}
      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently Asked Questions</h2>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%', padding: '16px 20px', background: 'white', border: 'none',
                  borderBottom: index < faqs.length - 1 ? '1px solid #F1F5F9' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  textAlign: 'left', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 500, color: '#0F172A' }}>{faq.question}</span>
                {faq.open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {faq.open && (
                <div style={{
                  padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9',
                }}>
                  <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Options */}
      <div style={{ padding: '0 20px 24px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Contact Us</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { icon: MessageSquare, label: 'Live Chat', desc: 'Available 24/7', action: () => navigate('/messages') },
            { icon: Phone, label: 'Call Us', desc: '+1 (800) 555-1234', action: () => window.location.href = 'tel:+18005551234' },
            { icon: Mail, label: 'Email Support', desc: 'support@rentify.app', action: () => window.location.href = 'mailto:support@rentify.app' },
            { icon: FileText, label: 'Submit a Request', desc: 'Get help via email', action: () => navigate('/submit-request') },
          ].map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px', background: 'white', borderRadius: 12,
                border: '1px solid #E2E8F0', width: '100%', cursor: 'pointer',
              }}
            >
              <option.icon size={24} color="#2563EB" />
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>{option.label}</p>
                <p style={{ fontSize: 14, color: '#64748B' }}>{option.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}