import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mic, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;

const FEATURES = [
  { icon: Brain, label: 'AI-Powered Questions', color: '#F4845F' },
  { icon: Mic, label: 'Voice Responses', color: '#6BBF7A' },
  { icon: BarChart3, label: 'Performance Analytics', color: '#6EB5FF' },
  { icon: Shield, label: 'Secure & Private', color: '#E882B4' },
];

/* Google "G" SVG icon */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

export default function Login() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState('');

  /* Redirect if already logged in */
  useEffect(() => {
    if (!loading && user) navigate('/upload', { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/upload');
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background layers */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.13, backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: '200px 200px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: -300, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, borderRadius: '50%', opacity: 0.1, background: 'radial-gradient(circle, #F4845F 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -300, left: -200, width: 700, height: 700, borderRadius: '50%', opacity: 0.07, background: 'radial-gradient(circle, #6EB5FF 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -200, right: -100, width: 600, height: 600, borderRadius: '50%', opacity: 0.07, background: 'radial-gradient(circle, #E882B4 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      {/* Nav */}
      <header style={{ padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <button
          onClick={() => navigate('/')}
          style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          InterviewAI
        </button>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}
          >
            <span style={{
              padding: '6px 18px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(244,132,95,0.12)',
              color: '#F4845F',
              border: '1px solid rgba(244,132,95,0.25)',
            }}>
              AI-Powered Mock Interviews
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{ textAlign: 'center', marginBottom: 36 }}
          >
            <h1 style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(32px, 6vw, 48px)',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              marginBottom: 12,
            }}>
              PRACTICE. IMPROVE.<br />
              <span style={{ color: '#F4845F' }}>GET HIRED.</span>
            </h1>
            <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.65, maxWidth: 320, margin: '0 auto' }}>
              Sign in with Google to unlock AI mock interviews personalized to your resume.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            style={{
              backgroundColor: 'rgba(22,27,34,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '32px 28px',
              marginBottom: 24,
            }}
          >
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '14px 20px',
                borderRadius: 12,
                backgroundColor: isSigningIn ? 'rgba(255,255,255,0.04)' : 'white',
                border: '1px solid rgba(255,255,255,0.12)',
                color: isSigningIn ? '#8b949e' : '#0d1117',
                fontSize: 15,
                fontWeight: 700,
                cursor: isSigningIn ? 'not-allowed' : 'pointer',
                transition: 'all 200ms',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => { if (!isSigningIn) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isSigningIn ? (
                <>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#F4845F', animation: 'spin 0.8s linear infinite' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Signing in...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            {error && (
              <p style={{ marginTop: 12, color: '#ff6b6b', fontSize: 12, textAlign: 'center' }}>{error}</p>
            )}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
              <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
              <span style={{ color: '#8b949e', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }}>WHAT YOU GET</span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {FEATURES.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 10,
                    backgroundColor: `${color}0D`,
                    border: `1px solid ${color}20`,
                  }}
                >
                  <Icon size={14} style={{ color, flexShrink: 0 }} />
                  <span style={{ color: '#c9d1d9', fontSize: 11, fontWeight: 500, lineHeight: 1.3 }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', color: '#8b949e', fontSize: 11, lineHeight: 1.7 }}
          >
            By signing in, you agree to our{' '}
            <button onClick={() => navigate('/terms')} style={{ color: '#F4845F', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, padding: 0 }}>Terms</button>
            {' '}and{' '}
            <button onClick={() => navigate('/privacy')} style={{ color: '#F4845F', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, padding: 0 }}>Privacy Policy</button>.
            <br />Your resume data is processed securely and never stored on our servers.
          </motion.p>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}
          >
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#8b949e',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e6edf3'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; }}
            >
              ← Back to home
            </button>
          </motion.div>

        </div>
      </main>

      {/* Floating arrow hint */}
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#F4845F',
          opacity: 0.4,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          pointerEvents: 'none',
        }}
      >
        <ArrowRight size={14} />
      </motion.div>
    </div>
  );
}
