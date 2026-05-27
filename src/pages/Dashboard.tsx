import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Trophy, Target, TrendingUp, BookOpen, ArrowRight, Loader2, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { generateRoadmap } from '../services/groq';

const COLORS = ['#F4845F', '#6BBF7A', '#E882B4', '#6EB5FF'];

function getScoreColor(score: number) {
  if (score >= 8) return '#6BBF7A';
  if (score >= 6) return '#6EB5FF';
  if (score >= 4) return '#F4845F';
  return '#ff4b4b';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { results, resumeData, roadmap, setRoadmap, resetInterview } = useInterview();
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  useEffect(() => {
    if (!results.length) { navigate('/setup'); return; }
    if (!roadmap) {
      setIsLoadingRoadmap(true);
      generateRoadmap(results as unknown as Record<string, unknown>[], resumeData as unknown as Record<string, unknown>)
        .then((data) => setRoadmap(data))
        .catch(() => {})
        .finally(() => setIsLoadingRoadmap(false));
    }
  }, [results, resumeData, roadmap, setRoadmap, navigate]);

  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length * 10) : 0;

  const radarData = results.length ? [
    { subject: 'Clarity', value: Math.round(results.reduce((s, r) => s + (r.confidenceIndicators?.clarity ?? 0), 0) / results.length) },
    { subject: 'Depth', value: Math.round(results.reduce((s, r) => s + (r.confidenceIndicators?.depth ?? 0), 0) / results.length) },
    { subject: 'Relevance', value: Math.round(results.reduce((s, r) => s + (r.confidenceIndicators?.relevance ?? 0), 0) / results.length) },
    { subject: 'Communication', value: Math.round(results.reduce((s, r) => s + (r.confidenceIndicators?.communication ?? 0), 0) / results.length) },
  ] : [];

  const barData = results.map((r, i) => ({ name: `Q${i + 1}`, score: r.score, fill: COLORS[i % COLORS.length] }));

  const handleRetry = () => { resetInterview(); navigate('/setup'); };

  /* ─── Inline styles for consistency ─── */
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#0d1117',
    fontFamily: "'Inter', sans-serif",
    color: '#e6edf3',
  };
  const cardBg: React.CSSProperties = {
    backgroundColor: 'rgba(22, 27, 34, 0.95)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
  };
  const sectionLabel: React.CSSProperties = {
    color: '#8b949e',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom: 12,
  };

  return (
    <div style={pageStyle}>
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.15, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      {/* ─── HEADER ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        backgroundColor: 'rgba(13,17,23,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleRetry} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e6edf3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><RotateCcw size={13} /> Retry</button>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e6edf3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Home size={13} /> Home</button>
        </div>
        <button onClick={() => navigate('/')} style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase' as const, background: 'none', border: 'none', cursor: 'pointer' }}>TOONHUB</button>
      </header>

      {/* ─── CENTERED CONTENT ─── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 60px', position: 'relative', zIndex: 10 }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(30px, 5vw, 44px)', color: 'white', letterSpacing: '-0.01em', lineHeight: 1.1, textTransform: 'uppercase' }}>
            YOUR <span style={{ color: '#F4845F' }}>RESULTS</span>
          </h1>
          <p style={{ marginTop: 6, color: '#8b949e', fontSize: 13 }}>Interview performance analysis powered by AI</p>
        </motion.div>

        {/* ─── SCORE CARDS ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'OVERALL SCORE', value: `${avgScore}%`, icon: Trophy, color: '#F4845F' },
            { label: 'QUESTIONS', value: `${results.length}`, icon: Target, color: '#6EB5FF' },
            { label: 'BEST SCORE', value: `${Math.max(...results.map(r => r.score))}/10`, icon: TrendingUp, color: '#6BBF7A' },
            { label: 'AVG SCORE', value: `${(results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1)}/10`, icon: BookOpen, color: '#E882B4' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ ...cardBg, padding: '14px 14px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Icon size={12} style={{ color: card.color }} />
                  <span style={{ color: '#8b949e', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>{card.label}</span>
                </div>
                <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(22px, 4vw, 30px)', color: 'white', lineHeight: 1 }}>{card.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── CHARTS ROW ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {/* Radar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ ...cardBg, padding: 16 }}>
            <p style={sectionLabel}>Confidence Analysis</p>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="68%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#F4845F" fill="#F4845F" fillOpacity={0.18} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ ...cardBg, padding: 16 }}>
            <p style={sectionLabel}>Per Question Score</p>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#8b949e', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#e6edf3', fontSize: 12 }} />
                  <Bar dataKey="score" radius={[5, 5, 0, 0]} barSize={30}>
                    {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ─── DETAILED BREAKDOWN ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginBottom: 16 }}>
          <p style={sectionLabel}>Detailed Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((r, i) => (
              <div key={i} style={{ ...cardBg, overflow: 'hidden' }}>
                {/* Question row */}
                <button
                  onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 16px', background: 'none', border: 'none', color: '#e6edf3',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {/* Score circle */}
                  <div style={{
                    flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: `${getScoreColor(r.score)}15`,
                    border: `2px solid ${getScoreColor(r.score)}`,
                  }}>
                    <span style={{ color: getScoreColor(r.score), fontSize: 13, fontWeight: 900 }}>{r.score}</span>
                  </div>
                  {/* Question text */}
                  <p style={{ flex: 1, fontSize: 13, fontWeight: 500, lineHeight: 1.55, opacity: 0.9, paddingTop: 2 }}>{r.question}</p>
                  {/* Chevron */}
                  <div style={{ flexShrink: 0, paddingTop: 4, opacity: 0.3 }}>
                    {expandedQ === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </button>

                {/* Expanded details */}
                {expandedQ === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 16px 16px', marginLeft: 46 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* Your answer */}
                      <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <p style={{ color: '#8b949e', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Your Answer</p>
                        <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.8, wordBreak: 'break-word' }}>{r.answer}</p>
                      </div>

                      {/* AI Feedback */}
                      <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(110,181,255,0.04)', border: '1px solid rgba(110,181,255,0.1)' }}>
                        <p style={{ color: '#6EB5FF', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>AI Feedback</p>
                        <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.8 }}>{r.feedback}</p>
                      </div>

                      {/* Strengths / Improvements */}
                      <div style={{ display: 'grid', gridTemplateColumns: r.strengths?.length && r.improvements?.length ? '1fr 1fr' : '1fr', gap: 8 }}>
                        {r.strengths?.length > 0 && (
                          <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(107,191,122,0.05)', border: '1px solid rgba(107,191,122,0.12)' }}>
                            <p style={{ color: '#6BBF7A', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Strengths</p>
                            {r.strengths.map((s, j) => <p key={j} style={{ fontSize: 11, opacity: 0.75, lineHeight: 1.5, marginBottom: 2 }}>• {s}</p>)}
                          </div>
                        )}
                        {r.improvements?.length > 0 && (
                          <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(244,132,95,0.05)', border: '1px solid rgba(244,132,95,0.12)' }}>
                            <p style={{ color: '#F4845F', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>To Improve</p>
                            {r.improvements.map((s, j) => <p key={j} style={{ fontSize: 11, opacity: 0.75, lineHeight: 1.5, marginBottom: 2 }}>• {s}</p>)}
                          </div>
                        )}
                      </div>

                      {/* Ideal answer */}
                      {r.sampleAnswer && (
                        <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(107,191,122,0.03)', border: '1px solid rgba(107,191,122,0.1)' }}>
                          <p style={{ color: '#6BBF7A', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Ideal Answer</p>
                          <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.8 }}>{r.sampleAnswer}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── IMPROVEMENT ROADMAP ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ ...cardBg, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(244,132,95,0.1)' }}>
              <TrendingUp size={14} style={{ color: '#F4845F' }} />
            </div>
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, color: 'white', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Improvement Roadmap</h2>
          </div>

          {isLoadingRoadmap ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 0' }}>
              <Loader2 size={20} className="animate-spin" style={{ color: '#F4845F' }} />
              <p style={{ color: '#8b949e', fontSize: 13 }}>Generating your personalized roadmap...</p>
            </div>
          ) : roadmap ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ color: '#e6edf3', opacity: 0.75, fontSize: 13, lineHeight: 1.65 }}>{roadmap.overallFeedback}</p>

              {/* Weeks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(roadmap.roadmap || []).map((week, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${COLORS[i % COLORS.length]}15`, border: `2px solid ${COLORS[i % COLORS.length]}` }}>
                      <span style={{ color: COLORS[i % COLORS.length], fontSize: 10, fontWeight: 900 }}>W{week.week}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{week.focus}</p>
                      {(week.tasks || []).map((task, j) => (
                        <p key={j} style={{ color: '#8b949e', fontSize: 11, lineHeight: 1.5, marginBottom: 1 }}>• {task}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {(roadmap.tips || []).length > 0 && (
                <div style={{ padding: 14, borderRadius: 12, backgroundColor: 'rgba(244,132,95,0.04)', border: '1px solid rgba(244,132,95,0.1)' }}>
                  <p style={{ color: '#F4845F', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Pro Tips</p>
                  {(roadmap.tips || []).map((tip, i) => (
                    <p key={i} style={{ color: '#e6edf3', opacity: 0.75, fontSize: 12, lineHeight: 1.55, marginBottom: 3 }}>💡 {tip}</p>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </motion.div>

        {/* ─── ACTION BUTTONS ─── */}
        <div style={{ display: 'flex', gap: 10, paddingBottom: 20 }}>
          <button
            onClick={handleRetry}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
          >
            <RotateCcw size={15} /> Practice Again
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 12, backgroundColor: '#F4845F', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e07350'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F4845F'; }}
          >
            Back to Home <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
