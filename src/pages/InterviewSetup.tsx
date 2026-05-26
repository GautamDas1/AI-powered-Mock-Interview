import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, Shuffle, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { generateQuestions } from '../services/groq';

const MODES = [
  { id: 'technical' as const, label: 'TECHNICAL', icon: Code2, color: '#6EB5FF', desc: 'Data structures, algorithms, system design, coding concepts', bg: 'rgba(110,181,255,0.1)', border: 'rgba(110,181,255,0.3)' },
  { id: 'hr' as const, label: 'HR / BEHAVIORAL', icon: Users, color: '#6BBF7A', desc: 'Teamwork, leadership, communication, situational questions', bg: 'rgba(107,191,122,0.1)', border: 'rgba(107,191,122,0.3)' },
  { id: 'mixed' as const, label: 'MIXED', icon: Shuffle, color: '#E882B4', desc: 'Combination of technical and behavioral questions', bg: 'rgba(232,130,180,0.1)', border: 'rgba(232,130,180,0.3)' },
];

const QUESTION_COUNTS = [3, 5, 8, 10];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { resumeData, interviewMode, setInterviewMode, setQuestions } = useInterview();
  const [selectedMode, setSelectedMode] = useState(interviewMode);
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = async () => {
    if (!resumeData) {
      navigate('/upload');
      return;
    }
    setIsGenerating(true);
    try {
      setInterviewMode(selectedMode);
      const data = await generateQuestions(resumeData as unknown as Record<string, unknown>, selectedMode, questionCount);
      setQuestions(data.questions || []);
      navigate('/interview');
    } catch (err) {
      console.error('Failed to generate questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.2, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />
      <div className="fixed top-[-300px] right-[-200px] w-[700px] h-[700px] rounded-full pointer-events-none" style={{ opacity: 0.12, background: 'radial-gradient(circle, #E882B4 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="fixed bottom-[-300px] left-[-200px] w-[700px] h-[700px] rounded-full pointer-events-none" style={{ opacity: 0.08, background: 'radial-gradient(circle, #6EB5FF 0%, transparent 70%)', filter: 'blur(100px)' }} />

      {/* ─── NAV ─── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase' as const, background: 'none', border: 'none', cursor: 'pointer' }}>TOONHUB</button>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#8b949e', letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>STEP 2 OF 3</span>
      </header>

      {/* ─── MAIN CONTENT (fills remaining height, centers vertically) ─── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 24px 40px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ width: '100%', maxWidth: 760 }}>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(34px, 6vw, 56px)', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'uppercase' }}>
              CHOOSE YOUR <span style={{ color: '#E882B4' }}>MODE</span>
            </h1>
            <p style={{ marginTop: 10, color: '#8b949e', fontSize: 14, lineHeight: 1.6, maxWidth: 440, margin: '10px auto 0' }}>
              Select interview type and number of questions. AI will tailor questions based on your resume.
            </p>
          </motion.div>

          {/* ─── Mode cards ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
            {MODES.map((mode, i) => {
              const Icon = mode.icon;
              const selected = selectedMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  onClick={() => setSelectedMode(mode.id)}
                  style={{
                    position: 'relative',
                    padding: '24px 20px',
                    borderRadius: 14,
                    backgroundColor: selected ? mode.bg : 'rgba(255,255,255,0.025)',
                    border: `2px solid ${selected ? mode.border : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 300ms ease',
                    transform: selected ? 'scale(1.02)' : 'scale(1)',
                    color: '#e6edf3',
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${mode.color}18`, marginBottom: 14 }}>
                    <Icon size={22} style={{ color: mode.color }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, color: 'white' }}>{mode.label}</p>
                  <p style={{ fontSize: 12, lineHeight: 1.55, color: '#8b949e', opacity: selected ? 1 : 0.8 }}>{mode.desc}</p>
                  {selected && <div style={{ position: 'absolute', top: 12, right: 12, width: 10, height: 10, borderRadius: '50%', backgroundColor: mode.color }} />}
                </motion.button>
              );
            })}
          </div>

          {/* ─── Question count ─── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: 28 }}>
            <p style={{ textAlign: 'center', color: '#8b949e', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 14 }}>Number of Questions</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {QUESTION_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  style={{
                    width: 60, height: 60, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: questionCount === count ? '#F4845F' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${questionCount === count ? '#F4845F' : 'rgba(255,255,255,0.08)'}`,
                    color: 'white', fontSize: 20, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 200ms',
                    transform: questionCount === count ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: questionCount === count ? '0 4px 24px rgba(244,132,95,0.35)' : 'none',
                  }}
                >
                  {count}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ─── Resume summary ─── */}
          {resumeData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{
              padding: '18px 22px',
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Zap size={14} style={{ color: '#F4845F' }} />
                <span style={{ color: '#8b949e', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Interviewing As</span>
              </div>
              <p style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>{resumeData.name}</p>
              <p style={{ color: '#8b949e', fontSize: 13, marginTop: 3 }}>{resumeData.suggestedRole} • {resumeData.experienceLevel}</p>
            </motion.div>
          )}

          {/* ─── Start button ─── */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleStart}
            disabled={isGenerating}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '16px 0',
              borderRadius: 14,
              backgroundColor: isGenerating ? '#444' : '#F4845F',
              border: 'none',
              color: 'white', fontSize: 16, fontWeight: 700,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating ? 0.7 : 1,
              transition: 'all 200ms',
            }}
            onMouseEnter={e => { if (!isGenerating) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.backgroundColor = '#e07350'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = isGenerating ? '#444' : '#F4845F'; }}
          >
            {isGenerating ? <><Loader2 size={20} className="animate-spin" /> Generating Questions...</> : <>Start Interview <ArrowRight size={18} /></>}
          </motion.button>

        </div>
      </main>
    </div>
  );
}
