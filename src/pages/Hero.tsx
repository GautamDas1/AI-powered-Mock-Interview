import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Upload, Mic, BarChart3, Brain, CheckCircle, Sparkles, Target, MessageSquare, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CHARACTERS = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', name: 'Blaze', accent: '#F4845F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', name: 'Sprout', accent: '#6BBF7A' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', name: 'Rosie', accent: '#E882B4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', name: 'Drift', accent: '#6EB5FF' },
];

const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;

const NAV_LINKS = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Practice', id: 'practice' },
  { label: 'About', id: 'about' },
];

export default function Hero() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [charFade, setCharFade] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { CHARACTERS.forEach(({ src }) => { const img = new Image(); img.src = src; }); }, []);
  useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);

  /* Auto-rotate characters */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCharFade(false);
      setTimeout(() => { setCharIndex(p => (p + 1) % CHARACTERS.length); setCharFade(true); }, 300);
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const activeChar = CHARACTERS[charIndex];

  const sectionStyle: React.CSSProperties = { padding: '80px 24px', maxWidth: 900, margin: '0 auto' };
  const sectionTitle: React.CSSProperties = { fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 5vw, 44px)', color: 'white', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 12, textAlign: 'center' };
  const sectionSub: React.CSSProperties = { color: '#8b949e', fontSize: 14, lineHeight: 1.6, textAlign: 'center', maxWidth: 500, margin: '0 auto 40px' };
  const cardStyle: React.CSSProperties = { padding: '28px 24px', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#0d1117' }}>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes pulseRing { 0% { transform: scale(0.8); opacity:0.6; } 100% { transform: scale(2.2); opacity:0; } }
        @keyframes fadeSlideIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ════════ HERO ════════ */}
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingTop: 64 }}>
        {/* BG layers */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12, backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: '200px 200px' }} />
        <div className="absolute pointer-events-none" style={{ width: 700, height: 700, borderRadius: '50%', right: -100, top: -100, background: `radial-gradient(circle, ${activeChar.accent}18 0%, transparent 70%)`, filter: 'blur(80px)', transition: 'background 800ms ease' }} />
        <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', left: -100, bottom: -100, background: 'radial-gradient(circle, rgba(110,181,255,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        {/* NAV — fixed */}
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '14px 16px' : '16px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 2.5vw, 28px)', color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase' }}>TOONHUB</span>
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {NAV_LINKS.map(link => (
                <button key={link.id} onClick={() => scrollTo(link.id)} style={{ fontFamily: "'Anton', sans-serif", fontSize: 15, color: 'white', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'none', border: 'none', cursor: 'pointer', transition: 'opacity 200ms, color 200ms', padding: '4px 0' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#F4845F'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.color = 'white'; }}>{link.label}</button>
              ))}
            </nav>
          )}
          <button onClick={() => navigate('/upload')} style={{ padding: '9px 22px', borderRadius: 10, backgroundColor: '#F4845F', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>Get Started</button>
        </header>

        {/* HERO CONTENT — split layout */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: isMobile ? '32px 20px' : '0 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 48, maxWidth: 1100, width: '100%', flexDirection: isMobile ? 'column' : 'row' }}>

            {/* LEFT — Text */}
            <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left', animation: 'fadeSlideIn 0.7s ease forwards' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, backgroundColor: 'rgba(244,132,95,0.08)', border: '1px solid rgba(244,132,95,0.2)', marginBottom: 24 }}>
                <Sparkles size={14} style={{ color: '#F4845F' }} />
                <span style={{ color: '#F4845F', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Powered by Groq AI</span>
              </div>

              <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', color: 'white', lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 18 }}>
                ACE YOUR NEXT<br /><span style={{ color: '#F4845F' }}>INTERVIEW</span> WITH AI
              </h1>

              <p style={{ color: '#8b949e', fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: 1.65, maxWidth: 460, margin: isMobile ? '0 auto 28px' : '0 0 28px 0' }}>
                Upload your resume, practice with personalized AI questions, speak your answers, and get instant feedback with a detailed improvement roadmap.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap', marginBottom: 24 }}>
                <button onClick={() => navigate('/upload')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 12, backgroundColor: '#F4845F', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(244,132,95,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  Start Interview <ArrowRight size={18} />
                </button>
                <button onClick={() => scrollTo('how-it-works')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 200ms' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}>
                  How It Works
                </button>
              </div>

              <div style={{ display: 'flex', gap: 20, justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
                {['Free to use', 'No sign-up', 'Instant results'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle size={13} style={{ color: '#6BBF7A' }} />
                    <span style={{ color: '#8b949e', fontSize: 12 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Character showcase */}
            <div style={{ flex: isMobile ? 'none' : '0 0 380px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: isMobile ? 32 : 0, position: 'relative' }}>
              {/* Glow ring behind character */}
              <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${activeChar.accent}20 0%, transparent 70%)`, transition: 'background 600ms', filter: 'blur(40px)' }} />
              {/* Spinning orbit ring */}
              <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px dashed rgba(255,255,255,0.06)', animation: 'spinSlow 30s linear infinite' }} />

              {/* Character image */}
              <div style={{ position: 'relative', width: isMobile ? 240 : 340, height: isMobile ? 320 : 440, animation: 'float 4s ease-in-out infinite' }}>
                <img
                  src={activeChar.src}
                  alt={activeChar.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center',
                    opacity: charFade ? 1 : 0,
                    transform: charFade ? 'scale(1)' : 'scale(0.95)',
                    transition: 'opacity 300ms ease, transform 300ms ease',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
                  }}
                />
              </div>

              {/* Character selector dots */}
              <div style={{ display: 'flex', gap: 10, marginTop: 12, position: 'relative', zIndex: 5 }}>
                {CHARACTERS.map((ch, i) => (
                  <button
                    key={ch.name}
                    onClick={() => { setCharFade(false); setTimeout(() => { setCharIndex(i); setCharFade(true); }, 250); }}
                    style={{
                      width: charIndex === i ? 28 : 10, height: 10, borderRadius: 5,
                      backgroundColor: charIndex === i ? ch.accent : 'rgba(255,255,255,0.15)',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 300ms ease',
                    }}
                    aria-label={ch.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Scroll indicator */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
          <button onClick={() => scrollTo('features')} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.5, transition: 'opacity 200ms' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Explore</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* ════════ FEATURES ════════ */}
      <div id="features" style={{ backgroundColor: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>Powerful <span style={{ color: '#F4845F' }}>Features</span></h2>
          <p style={sectionSub}>Everything you need to prepare for your dream job interview, powered by cutting-edge AI.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { icon: Brain, color: '#6EB5FF', title: 'AI-Powered Questions', desc: 'Groq AI generates personalized interview questions tailored to your resume, skills, and target role.' },
              { icon: Mic, color: '#6BBF7A', title: 'Voice Interaction', desc: 'Speak your answers naturally. Speech recognition captures your response in real-time.' },
              { icon: MessageSquare, color: '#E882B4', title: 'AI Interviewer Voice', desc: 'Natural text-to-speech reads questions aloud, simulating a real interview experience.' },
              { icon: BarChart3, color: '#F4845F', title: 'Detailed Analytics', desc: 'Get scored on clarity, depth, relevance and communication with per-question breakdowns.' },
              { icon: Target, color: '#6EB5FF', title: 'Improvement Roadmap', desc: 'AI generates a personalized week-by-week study plan based on your performance gaps.' },
              { icon: Sparkles, color: '#6BBF7A', title: 'Resume Analysis', desc: 'Upload your PDF resume and AI extracts skills, projects, and experience level automatically.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={cardStyle}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${f.color}15`, marginBottom: 16 }}><Icon size={22} style={{ color: f.color }} /></div>
                  <p style={{ color: 'white', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</p>
                  <p style={{ color: '#8b949e', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════ HOW IT WORKS — with characters ════════ */}
      <div id="how-it-works" style={{ backgroundColor: '#0a0e14', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>How It <span style={{ color: '#6BBF7A' }}>Works</span></h2>
          <p style={sectionSub}>Three simple steps to ace your next interview.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '01', icon: Upload, color: '#F4845F', title: 'Upload Your Resume', desc: 'Drop your PDF resume and our AI will extract your skills, experience, projects, and suggest a target role.', charIdx: 0 },
              { step: '02', icon: Mic, color: '#6EB5FF', title: 'Take the Interview', desc: 'Choose your mode — Technical, HR/Behavioral, or Mixed. Answer questions using voice or text with AI-powered follow-ups.', charIdx: 3 },
              { step: '03', icon: BarChart3, color: '#6BBF7A', title: 'Get Your Results', desc: 'Receive detailed scores, AI feedback, ideal answers, and a personalized improvement roadmap to keep growing.', charIdx: 1 },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ display: 'flex', gap: isMobile ? 16 : 28, alignItems: 'center', padding: '28px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', flexDirection: isMobile ? 'column' : (i % 2 === 0 ? 'row' : 'row-reverse') }}>
                  {/* Character thumbnail */}
                  <div style={{ flexShrink: 0, width: isMobile ? 100 : 140, height: isMobile ? 130 : 180, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${s.color}12 0%, transparent 70%)`, filter: 'blur(20px)' }} />
                    <img src={CHARACTERS[s.charIdx].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' }} />
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${s.color}12`, border: `1.5px solid ${s.color}30` }}><Icon size={18} style={{ color: s.color }} /></div>
                      <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, color: s.color, letterSpacing: '0.1em' }}>STEP {s.step}</span>
                    </div>
                    <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{s.title}</p>
                    <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.65, maxWidth: 450 }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════ PRACTICE CTA ════════ */}
      <div id="practice" style={{ backgroundColor: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ ...sectionStyle, textAlign: 'center' }}>
          <h2 style={sectionTitle}>Ready to <span style={{ color: '#E882B4' }}>Practice?</span></h2>
          <p style={sectionSub}>Start your AI mock interview now. It only takes a few minutes.</p>
          {/* Character row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
            {CHARACTERS.map((ch, i) => (
              <div key={ch.name} style={{ width: isMobile ? 56 : 80, height: isMobile ? 72 : 105, opacity: 0.7, transition: 'all 300ms', cursor: 'default' }}>
                <img src={ch.src} alt={ch.name} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom', filter: `drop-shadow(0 4px 12px ${ch.accent}40)`, animation: `float ${3.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/upload')} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 48px', borderRadius: 14, backgroundColor: '#F4845F', border: 'none', color: 'white', fontSize: 17, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms', fontFamily: "'Anton', sans-serif", letterSpacing: '0.04em', textTransform: 'uppercase' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
            Start Interview <ArrowRight size={20} />
          </button>
          <div style={{ display: 'flex', gap: 24, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Free to use', 'No sign-up needed', 'Instant results'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} style={{ color: '#6BBF7A' }} />
                <span style={{ color: '#8b949e', fontSize: 13 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ ABOUT ════════ */}
      <div id="about" style={{ backgroundColor: '#0a0e14', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ ...sectionStyle, paddingBottom: 40 }}>
          <h2 style={sectionTitle}>About <span style={{ color: '#6EB5FF' }}>ToonHub</span></h2>
          <p style={{ ...sectionSub, maxWidth: 600 }}>ToonHub is an AI-powered mock interview platform built to help developers, engineers, and professionals practice and improve their interview skills. Powered by Groq's Llama 3.3 70B model for intelligent, context-aware feedback.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 500, margin: '0 auto' }}>
            {[{ n: '100%', l: 'Free' }, { n: 'AI', l: 'Powered' }, { n: '3', l: 'Interview Modes' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 28, color: '#F4845F' }}>{s.n}</p>
                <p style={{ color: '#8b949e', fontSize: 12, marginTop: 4 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ color: '#8b949e', fontSize: 12, opacity: 0.6 }}>© 2025 ToonHub. Built with React, Groq AI & ❤️</p>
        </div>
      </div>
    </div>
  );
}
