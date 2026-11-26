import { useNavigate } from 'react-router-dom';
import {
  Zap, ShieldCheck, MapPin, Star, Users, Clock, ArrowRight, Sparkles,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif',
      overflowX: 'hidden',
    }}>
      {/* ───────── Hero ───────── */}
      <div style={{
        background: 'linear-gradient(160deg, #2563EB 0%, #7C3AED 55%, #EC4899 100%)',
        borderRadius: '0 0 48px 48px',
        padding: '64px 28px 96px',
        position: 'relative', overflow: 'hidden',
        color: 'white', textAlign: 'center',
      }}>
        {/* decorative glows */}
        <div style={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)', filter: 'blur(60px)',
          top: -80, left: -60,
        }} />
        <div style={{
          position: 'absolute', width: 240, height: 240, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', filter: 'blur(60px)',
          bottom: -60, right: -40,
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: '0 auto',
            background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, fontWeight: 900,
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: -8, borderRadius: 28,
              background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
              filter: 'blur(6px)', zIndex: -1,
            }} />
            R
          </div>
        </div>

        <h1 style={{
          fontSize: 34, fontWeight: 800, letterSpacing: -1, lineHeight: 1.15,
          margin: 0, marginBottom: 14,
        }}>
          Rent anything.<br /><span style={{ opacity: 0.85 }}>Anywhere. Anytime.</span>
        </h1>
        <p style={{
          fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)',
          maxWidth: 300, margin: '0 auto 32px',
        }}>
          The marketplace where neighbors list everything — cameras, tools, bikes,
          drones and more — and you grab it in minutes.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300, margin: '0 auto' }}>
          <button onClick={() => navigate('/register')} style={{
            padding: '16px 24px', borderRadius: 16, border: 'none',
            background: 'white', color: '#2563EB',
            fontSize: 16, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            transition: 'transform 0.15s',
          }}>
            <Sparkles size={18} /> Get started — it's free
          </button>
          <button onClick={() => navigate('/login')} style={{
            padding: '14px 24px', borderRadius: 16,
            border: '1.5px solid rgba(255,255,255,0.45)',
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
            color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            I already have an account <ArrowRight size={16} />
          </button>
        </div>

        {/* trust stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 24,
          marginTop: 36, position: 'relative',
        }}>
          {[
            { n: '50k+', l: 'members' },
            { n: '12k', l: 'items listed' },
            { n: '4.9', l: 'avg. rating' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────── How it works ───────── */}
      <div style={{ padding: '40px 24px 24px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', textAlign: 'center', margin: '0 0 24px' }}>
          How it works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: MapPin, title: 'Find it nearby', desc: 'Browse verified items within a few blocks of your location.' },
            { icon: Clock, title: 'Pick your dates', desc: 'Reserve by the hour or by the day — flexible, like the rest of Rentify.' },
            { icon: ShieldCheck, title: 'Meet & enjoy', desc: 'Pick up in person from trusted owners, backed by our protection program.' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'white', borderRadius: 20, padding: '18px 20px',
              boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
              border: '1px solid #F1F5F9',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={22} color="#2563EB" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: '#0F172A', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800,
              }}>{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────── Social proof ───────── */}
      <div style={{ padding: '16px 24px 48px' }}>
        <div style={{
          background: 'white', borderRadius: 24, padding: '24px 22px',
          boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
          border: '1px solid #F1F5F9', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 12 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />)}
          </div>
          <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 16px' }}>
            "I rented a drone for the weekend for less than a third of buying one.
            Picking it up took five minutes — like renting a movie, but for everything."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 13,
            }}>MJ</div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0 }}>Maya Johnson</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>Member since 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Bottom CTA ───────── */}
      <div style={{ padding: '0 24px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 16 }}>
          Ready to stop owning and start sharing?
        </p>
        <button onClick={() => navigate('/register')} style={{
          width: '100%', padding: '16px', borderRadius: 16, border: 'none',
          background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
          color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
        }}>
          Create your free account <Zap size={17} />
        </button>
        <p style={{
          fontSize: 11, color: '#94A3B8', marginTop: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Users size={12} /> Join 50,000+ neighbors who already share
        </p>
      </div>
    </div>
  );
}
