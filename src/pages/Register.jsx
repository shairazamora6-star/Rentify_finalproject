import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(null);

  const inputStyle = (key, extra = {}) => ({
    ...extra,
    fontSize: 15, borderRadius: 14, padding: '13px 42px 13px 42px', width: '100%',
    border: focused === key ? '1.5px solid #7C3AED' : '1.5px solid #E2E8F0',
    background: focused === key ? '#FAF8FF' : '#F8FAFC',
    boxShadow: focused === key ? '0 0 0 4px rgba(124,58,237,0.08)' : 'none',
    transition: 'border 0.15s, box-shadow 0.15s, background 0.15s',
    outline: 'none',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!agree) { setError('Please accept the terms & conditions'); return; }
    login({ name, email });
    navigate('/');
  };

  const field = (key, icon, label, value, setValue, type, ph, extraStyle = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
          {icon}
        </span>
        <input type={type} value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
          placeholder={ph} className="input-field" style={inputStyle(key, extraStyle)} />
        {type === 'password' && (
          <button type="button" onClick={() => setShowPass(!showPass)} style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            padding: 4, display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
          }}>
            {showPass ? <EyeOff size={17} color="#64748B" /> : <Eye size={17} color="#94A3B8" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes rf-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rf-fade { from { opacity: 0; } to { opacity: 1; } }
        .rf-header { animation: rf-fade 0.4s ease-out both; }
        .rf-card { animation: rf-rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
      `}</style>

      {/* Gradient Header */}
      <div className="rf-header" style={{
        height: 200,
        background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 60%, #0891B2 100%)',
        borderRadius: '0 0 32px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', filter: 'blur(50px)', bottom: -70, left: -40 }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle at 70% 60%, white 1px, transparent 1px)' }} />
        <div style={{
          width: 52, height: 52, borderRadius: 15,
          background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 12,
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}>R</div>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, margin: 0, position: 'relative' }}>Create account</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4, fontWeight: 500, position: 'relative' }}>Start renting today</p>
      </div>

      {/* Form Card */}
      <div className="rf-card" style={{ padding: '0 24px 32px', marginTop: -32, position: 'relative' }}>
        <div style={{
          background: 'white', borderRadius: 24, padding: '28px 24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
        }}>
          <form onSubmit={handleSubmit}>
            {field('name', <User size={16} color={focused === 'name' ? '#7C3AED' : '#94A3B8'} />, 'Full Name', name, setName, 'text', 'John Doe')}
            {field('email', <Mail size={16} color={focused === 'email' ? '#7C3AED' : '#94A3B8'} />, 'Email', email, setEmail, 'email', 'you@example.com')}
            {field('password', <Lock size={16} color={focused === 'password' ? '#7C3AED' : '#94A3B8'} />, 'Password', password, setPassword, showPass ? 'text' : 'password', 'Min. 6 characters', { paddingRight: 44 })}

            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12,
                padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            {/* Terms agreement */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 12, color: '#64748B', marginBottom: 18, lineHeight: 1.5 }}>
              <div onClick={() => setAgree(!agree)} style={{
                width: 18, height: 18, borderRadius: 5, border: agree ? 'none' : '2px solid #CBD5E1',
                background: agree ? 'linear-gradient(135deg, #7C3AED, #2563EB)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0, marginTop: 1,
              }}>
                {agree && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span>I agree to the <span style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'underline' }}>Terms & Conditions</span> and <span style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</span></span>
            </label>

            <button type="submit" className="btn-primary" style={{ borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' }}>
              <UserPlus size={17} /> Create Account
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>or sign up with</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {['Google', 'Apple'].map(provider => (
              <button key={provider} style={{
                flex: 1, padding: '12px', borderRadius: 14,
                border: '1.5px solid #E2E8F0', background: 'white',
                fontSize: 13, fontWeight: 600, color: '#0F172A',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                transition: 'background 0.15s',
              }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                {provider === 'Google'
                  ? <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                }
                {provider}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 22 }}>
            <ShieldCheck size={14} color="#22C55E" />
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Your data is encrypted & never shared</span>
          </div>

          <p style={{ textAlign: 'center', marginTop: 14, fontSize: 14, color: '#64748B' }}>
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} style={{ color: '#7C3AED', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0 }}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
