import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Upload, Mic, BarChart3, Brain, CheckCircle, Sparkles, Target, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F', name: 'Blaze' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92', name: 'Sprout' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4', name: 'Rosie' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF', name: 'Drift' },
];

const NAV_LINKS = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Practice', id: 'practice' },
  { label: 'About', id: 'about' },
];

const TRANSITION_MS = 650;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;

type Role = 'center' | 'left' | 'right' | 'back';

export default function Hero() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { IMAGES.forEach(({ src }) => { const img = new Image(); img.src = src; }); }, []);
  useEffect(() => { const check = () => setIsMobile(window.innerWidth < 640); check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check); }, []);

  const handleNavigate = useCallback((dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4);
    lockRef.current = setTimeout(() => setIsAnimating(false), TRANSITION_MS);
  }, [isAnimating]);

  useEffect(() => () => { if (lockRef.current) clearTimeout(lockRef.current); }, []);
  useEffect(() => { const interval = setInterval(() => { handleNavigate('next'); }, 4000); return () => clearInterval(interval); }, [handleNavigate]);

  const roles: Record<number, Role> = { [activeIndex]: 'center', [(activeIndex + 3) % 4]: 'left', [(activeIndex + 1) % 4]: 'right', [(activeIndex + 2) % 4]: 'back' };

  const getRoleStyle = (role: Role): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', aspectRatio: '0.6 / 1', transition: [`transform ${TRANSITION_MS}ms ${EASING}`, `filter ${TRANSITION_MS}ms ${EASING}`, `opacity ${TRANSITION_MS}ms ${EASING}`, `left ${TRANSITION_MS}ms ${EASING}`, `bottom ${TRANSITION_MS}ms ${EASING}`, `height ${TRANSITION_MS}ms ${EASING}`].join(', '), willChange: 'transform, filter, opacity' };
    switch (role) {
      case 'center': return { ...base, transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`, filter: 'blur(0px)', opacity: 1, zIndex: 20, left: '50%', height: isMobile ? '60%' : '92%', bottom: isMobile ? '22%' : '0' };
      case 'left': return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '20%' : '30%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' };
      case 'right': return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '80%' : '70%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' };
      case 'back': return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(4px)', opacity: 1, zIndex: 5, left: '50%', height: isMobile ? '13%' : '22%', bottom: isMobile ? '32%' : '12%' };
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  /* ─── Shared section styles ─── */
  const sectionStyle: React.CSSProperties = { padding: '80px 24px', maxWidth: 900, margin: '0 auto' };
  const sectionTitle: React.CSSProperties = { fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 5vw, 44px)', color: 'white', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 12, textAlign: 'center' };
  const sectionSub: React.CSSProperties = { color: '#8b949e', fontSize: 14, lineHeight: 1.6, textAlign: 'center', maxWidth: 500, margin: '0 auto 40px' };
  const cardStyle: React.CSSProperties = { padding: '28px 24px', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ════════ HERO SECTION ════════ */}
      <div style={{ backgroundColor: IMAGES[activeIndex].bg, transition: `background-color ${TRANSITION_MS}ms ${EASING}`, position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50, opacity: 0.4, backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />

        {/* Ghost text */}
        <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', zIndex: 2, top: '18%' }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(90px, 28vw, 380px)', fontWeight: 900, color: 'white', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>3D SHAPE</span>
        </div>

        {/* ─── NAV BAR ─── */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '16px 16px' : '20px 40px', zIndex: 60 }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 2.5vw, 30px)', color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase' }}>TOONHUB</span>
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: 16,
                    fontWeight: 400,
                    color: 'white',
                    opacity: 0.9,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 200ms, transform 200ms',
                    padding: '4px 0',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}
          <button onClick={() => navigate('/upload')} style={{ padding: '8px 20px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 200ms', letterSpacing: '0.02em' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}>
            Get Started
          </button>
        </div>

        {/* Tagline */}
        {!isMobile && (
          <div style={{ position: 'absolute', top: 68, right: 40, zIndex: 60 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'white', opacity: 0.7, letterSpacing: '0.18em', textTransform: 'uppercase' }}>AI MOCK INTERVIEW © 2025. PRACTICE MAKES PERFECT.</span>
          </div>
        )}

        {/* Carousel */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {IMAGES.map((item, i) => (
            <div key={i} style={getRoleStyle(roles[i])}>
              <img src={item.src} alt={`${item.name} figurine`} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
            </div>
          ))}
        </div>

        {/* Bottom-left */}
        <div style={{ position: 'absolute', bottom: isMobile ? 24 : 80, left: isMobile ? 16 : 96, zIndex: 60, maxWidth: 360 }}>
          <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: isMobile ? 8 : 12, fontSize: isMobile ? 16 : 22, color: 'white', opacity: 0.95 }}>AI MOCK INTERVIEW</p>
          {!isMobile && <p style={{ fontSize: 14, color: 'white', opacity: 0.85, lineHeight: 1.6, marginBottom: 20 }}>Practice interviews with AI. Upload your resume, get personalized questions, and receive instant feedback to ace your next interview.</p>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => handleNavigate('prev')} style={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64, borderRadius: '50%', background: 'transparent', border: '2px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 150ms, background-color 150ms' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'transparent'; }}><ArrowLeft size={26} strokeWidth={2.25} /></button>
            <button onClick={() => handleNavigate('next')} style={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64, borderRadius: '50%', background: 'transparent', border: '2px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 150ms, background-color 150ms' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'transparent'; }}><ArrowRight size={26} strokeWidth={2.25} /></button>
          </div>
        </div>

        {/* Bottom-right CTA */}
        <button onClick={() => navigate('/upload')} style={{ position: 'absolute', bottom: isMobile ? 24 : 80, right: isMobile ? 16 : 40, zIndex: 60, fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 4vw, 56px)', color: 'white', opacity: 0.95, letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 200ms' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.95'; }}>
          START NOW
          <span style={{ width: isMobile ? 32 : 48, height: isMobile ? 32 : 48, border: '2px solid white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ArrowRight size={isMobile ? 16 : 24} strokeWidth={2.25} /></span>
        </button>
      </div>

      {/* ════════ FEATURES SECTION ════════ */}
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
                  <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${f.color}15`, marginBottom: 16 }}>
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <p style={{ color: 'white', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</p>
                  <p style={{ color: '#8b949e', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════ HOW IT WORKS ════════ */}
      <div id="how-it-works" style={{ backgroundColor: '#0a0e14', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>How It <span style={{ color: '#6BBF7A' }}>Works</span></h2>
          <p style={sectionSub}>Three simple steps to ace your next interview.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '01', icon: Upload, color: '#F4845F', title: 'Upload Your Resume', desc: 'Drop your PDF resume and our AI will extract your skills, experience, projects, and suggest a target role.' },
              { step: '02', icon: Mic, color: '#6EB5FF', title: 'Take the Interview', desc: 'Choose your mode — Technical, HR/Behavioral, or Mixed. Answer questions using voice or text with AI-powered follow-ups.' },
              { step: '03', icon: BarChart3, color: '#6BBF7A', title: 'Get Your Results', desc: 'Receive detailed scores, AI feedback, ideal answers, and a personalized improvement roadmap to keep growing.' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '32px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${s.color}12`, border: `2px solid ${s.color}30` }}>
                    <Icon size={24} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 14, color: s.color, letterSpacing: '0.1em' }}>STEP {s.step}</span>
                      <p style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{s.title}</p>
                    </div>
                    <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.65, maxWidth: 500 }}>{s.desc}</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <button onClick={() => navigate('/upload')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 48px', borderRadius: 14, backgroundColor: '#F4845F', border: 'none', color: 'white', fontSize: 17, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms', fontFamily: "'Anton', sans-serif", letterSpacing: '0.04em', textTransform: 'uppercase' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.backgroundColor = '#e07350'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#F4845F'; }}>
              Start Interview <ArrowRight size={20} />
            </button>
            <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
              {['Free to use', 'No sign-up needed', 'Instant results'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} style={{ color: '#6BBF7A' }} />
                  <span style={{ color: '#8b949e', fontSize: 13 }}>{t}</span>
                </div>
              ))}
            </div>
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
        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ color: '#8b949e', fontSize: 12, opacity: 0.6 }}>© 2025 ToonHub. Built with React, Groq AI & ❤️</p>
        </div>
      </div>
    </div>
  );
}
