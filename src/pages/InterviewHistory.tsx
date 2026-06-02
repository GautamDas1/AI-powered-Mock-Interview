import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Clock, ArrowRight, Loader2, TrendingUp, Target, Trophy, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserInterviews, type InterviewSession } from '../services/firestore';
import UserMenu from '../components/UserMenu';

const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;

function getScoreColor(score: number) {
  if (score >= 80) return '#6BBF7A';
  if (score >= 60) return '#6EB5FF';
  if (score >= 40) return '#F4845F';
  return '#ff4b4b';
}

function getModeColor(mode: string) {
  if (mode === 'technical') return { bg: 'rgba(110,181,255,0.1)', text: '#6EB5FF' };
  if (mode === 'hr') return { bg: 'rgba(232,130,180,0.1)', text: '#E882B4' };
  return { bg: 'rgba(107,191,122,0.1)', text: '#6BBF7A' };
}

export default function InterviewHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getUserInterviews(user.uid)
      .then(sessions => setInterviews(sessions))
      .catch(() => setError('Could not load interview history.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  /* ── Stats ── */
  const totalInterviews = interviews.length;
  const avgScore = totalInterviews
    ? Math.round(interviews.reduce((s, i) => s + i.avgScore, 0) / totalInterviews)
    : 0;
  const bestScore = totalInterviews
    ? Math.max(...interviews.map(i => i.avgScore))
    : 0;
  const totalQuestions = interviews.reduce((s, i) => s + i.questionCount, 0);

  const cardBg: React.CSSProperties = {
    backgroundColor: 'rgba(22, 27, 34, 0.95)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', fontFamily: "'Inter', sans-serif", color: '#e6edf3' }}>
      {/* Grain */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.15, backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: '200px 200px' }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        backgroundColor: 'rgba(13,17,23,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>InterviewAI</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/upload')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, backgroundColor: '#F4845F', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            New Interview <ArrowRight size={13} />
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px 60px', position: 'relative', zIndex: 10 }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(110,181,255,0.1)' }}>
              <History size={18} style={{ color: '#6EB5FF' }} />
            </div>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 5vw, 42px)', color: 'white', letterSpacing: '-0.01em', lineHeight: 1.1, textTransform: 'uppercase' }}>
              YOUR <span style={{ color: '#6EB5FF' }}>HISTORY</span>
            </h1>
          </div>
          <p style={{ color: '#8b949e', fontSize: 13 }}>Track your interview progress over time</p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '60px 0' }}>
            <Loader2 size={22} className="animate-spin" style={{ color: '#F4845F' }} />
            <p style={{ color: '#8b949e', fontSize: 14 }}>Loading your history...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{ textAlign: 'center', color: '#ff6b6b', fontSize: 13, padding: '40px 0' }}>{error}</p>
        )}

        {/* Empty state */}
        {!isLoading && !error && interviews.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(110,181,255,0.08)', margin: '0 auto 16px' }}>
              <History size={28} style={{ color: '#6EB5FF', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, color: 'white', textTransform: 'uppercase', marginBottom: 8 }}>No Interviews Yet</h2>
            <p style={{ color: '#8b949e', fontSize: 13, lineHeight: 1.65, maxWidth: 320, margin: '0 auto 24px' }}>
              Complete your first mock interview to start tracking your progress and see your improvement over time.
            </p>
            <button
              onClick={() => navigate('/upload')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 12, backgroundColor: '#F4845F', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start Your First Interview <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Stats + List */}
        {!isLoading && interviews.length > 0 && (
          <>
            {/* ── STATS CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'INTERVIEWS', value: totalInterviews, icon: Target, color: '#6EB5FF' },
                { label: 'AVG SCORE', value: `${avgScore}%`, icon: Trophy, color: '#F4845F' },
                { label: 'BEST SCORE', value: `${bestScore}%`, icon: TrendingUp, color: '#6BBF7A' },
                { label: 'QUESTIONS', value: totalQuestions, icon: BarChart3, color: '#E882B4' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ ...cardBg, padding: '14px 14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Icon size={12} style={{ color: card.color }} />
                      <span style={{ color: '#8b949e', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>{card.label}</span>
                    </div>
                    <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 4vw, 28px)', color: 'white', lineHeight: 1 }}>{card.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* ── INTERVIEW LIST ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {interviews.map((session, i) => {
                const date = session.completedAt
                  ? new Date((session.completedAt as unknown as { seconds: number }).seconds * 1000)
                  : null;
                const modeColors = getModeColor(session.interviewMode);

                return (
                  <motion.div
                    key={session.id ?? i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    style={{
                      ...cardBg,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'border-color 200ms',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
                  >
                    {/* Score circle */}
                    <div style={{
                      flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: `${getScoreColor(session.avgScore)}15`,
                      border: `2px solid ${getScoreColor(session.avgScore)}`,
                    }}>
                      <span style={{ color: getScoreColor(session.avgScore), fontSize: 15, fontWeight: 900 }}>{session.avgScore}%</span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          backgroundColor: modeColors.bg, color: modeColors.text,
                        }}>
                          {session.interviewMode}
                        </span>
                        <span style={{ color: '#8b949e', fontSize: 12 }}>{session.questionCount} questions</span>
                        <span style={{ color: '#8b949e', fontSize: 12 }}>·</span>
                        <span style={{ color: '#8b949e', fontSize: 12 }}>Best: <strong style={{ color: '#e6edf3' }}>{session.bestScore}/10</strong></span>
                      </div>
                      {date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8b949e', fontSize: 11 }}>
                          <Clock size={11} />
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          {' · '}
                          {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>

                    {/* Score trend indicator */}
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: `${getScoreColor(session.avgScore)}10`,
                      }}>
                        <TrendingUp size={16} style={{ color: getScoreColor(session.avgScore) }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
