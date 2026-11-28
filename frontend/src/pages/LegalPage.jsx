import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';

const DOCS = {
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'We respect your privacy and only collect the data needed to run Rentify. This policy explains what we collect and how it is used.',
    sections: [
      { h: 'What we collect', p: 'Profile information, rental history, messages and device data are stored to power your account and match you with nearby items.' },
      { h: 'How we use it', p: 'Your data is used to improve search results, keep transactions safe and provide customer support. We never sell your personal data.' },
      { h: 'Location data', p: 'Location is only used while you are actively browsing or arranging a meetup, and you can turn it off in Data Permissions at any time.' },
      { h: 'Your rights', p: 'You can download or delete your data at any time from Data Permissions. Requests are honored within 30 days.' },
    ],
  },
  'terms-of-service': {
    title: 'Terms of Service',
    intro: 'By using Rentify you agree to these terms. They govern rentals, payments and the behavior expected from all members.',
    sections: [
      { h: 'Rentals & deposits', p: 'Rental agreements are binding between renter and owner. Damage beyond normal wear is covered by protection, subject to the policy in place at time of booking.' },
      { h: 'Payments', p: 'Payments are processed securely. Renters are charged on confirmation; owners are paid 48 hours after return is confirmed.' },
      { h: 'Conduct', p: 'Be respectful, accurate and on time. Listing misleading items or no-shows can result in account suspension.' },
      { h: 'Liability', p: 'Rentify facilitates the transaction and is not liable for damage or loss of rented items beyond the protection program.' },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    intro: 'We use cookies and similar technologies to keep you signed in, remember preferences and improve the service.',
    sections: [
      { h: 'Essential cookies', p: 'Required for core features like sign-in and security. These cannot be disabled.' },
      { h: 'Analytics cookies', p: 'Anonymous usage data that helps us understand which features matter. You can opt out in Data Permissions.' },
      { h: 'Managing cookies', p: 'You can clear site data from your browser settings at any time; essential cookies will be set again when you return.' },
    ],
  },
  'dpa': {
    title: 'Data Processing Addendum',
    intro: 'This addendum describes how Rentify processes data on behalf of business customers, including sub-processors and security controls.',
    sections: [
      { h: 'Roles', p: 'Where Rentify acts as a processor for a business tenant, this addendum defines the processing scope, confidentiality and security obligations.' },
      { h: 'Sub-processors', p: 'We use a limited set of sub-processors for hosting and payments. Material changes to the sub-processor list are announced 30 days in advance.' },
      { h: 'Security', p: 'Data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access is role-based and logged.' },
      { h: 'Data residency', p: 'Standard accounts are processed in the EU region. Enterprise tenants can pin data to a specific region at onboarding.' },
    ],
  },
};

export default function LegalPage({ type }) {
  const navigate = useNavigate();
  const doc = DOCS[type] || DOCS['privacy-policy'];

  return (
    <div className="page" style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <div style={{
        background: 'var(--surface)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--line-1)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
          <ChevronLeft size={24} color="var(--ink-1)" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>{doc.title}</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line-1)', padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-softer)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink-1)', margin: 0 }}>{doc.title}</h2>
              <p style={{ fontSize: 12, color: 'var(--ink-4)', margin: '2px 0 0' }}>Last updated: October 2026</p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>{doc.intro}</p>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line-1)', padding: 20 }}>
          {doc.sections.map(s => (
            <div key={s.h} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-1)', margin: '0 0 6px' }}>{s.h}</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
