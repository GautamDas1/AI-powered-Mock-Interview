import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, ArrowRight, Loader2, Clock, MessageSquare } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { evaluateAnswer } from '../services/groq';
import { startListening, stopListening, speak, stopSpeaking, isSpeechSupported } from '../services/speech';

const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;
const COLORS = ['#F4845F', '#6BBF7A', '#E882B4', '#6EB5FF'];

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { questions, addResult } = useInterview();
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<Record<string, unknown> | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typedTextRef = useRef('');

  const question = questions[currentQ];
  const isLastQuestion = currentQ === questions.length - 1;
  const accent = COLORS[currentQ % COLORS.length];

  useEffect(() => { timerRef.current = setInterval(() => setTimer(t => t + 1), 1000); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [currentQ]);

  useEffect(() => {
    if (question) {
      setTimer(0); setAnswer(''); typedTextRef.current = '';
      setShowFeedback(false); setLastFeedback(null);
      setIsSpeaking(true);
      speak(question.question, () => setIsSpeaking(false));
    }
    return () => stopSpeaking();
  }, [currentQ, question]);

  useEffect(() => { if (!questions.length) navigate('/setup'); }, [questions, navigate]);

  const toggleVoice = () => {
    if (isListening) {
      stopListening(); setIsListening(false); typedTextRef.current = answer;
    } else {
      typedTextRef.current = answer; setIsListening(true);
      startListening(
        (result) => { const parts = [typedTextRef.current]; if (result.finalTranscript) parts.push(result.finalTranscript); if (result.interimTranscript) parts.push(result.interimTranscript); setAnswer(parts.filter(Boolean).join(' ').trim()); },
        () => { setIsListening(false); typedTextRef.current = answer; },
        () => { setIsListening(false); typedTextRef.current = answer; },
      );
    }
  };

  const toggleSpeak = () => {
    if (isSpeaking) { stopSpeaking(); setIsSpeaking(false); }
    else if (question) { setIsSpeaking(true); speak(question.question, () => setIsSpeaking(false)); }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !question) return;
    stopListening(); setIsListening(false); setIsEvaluating(true);
    try {
      const evaluation = await evaluateAnswer(question.question, answer, question.expectedPoints || []);
      addResult({
        questionId: question.id,
        question: question.question,
        answer: answer.trim(),
        score: evaluation.score ?? 5,
        feedback: evaluation.feedback ?? '',
        strengths: evaluation.strengths ?? [],
        improvements: evaluation.improvements ?? [],
        confidenceIndicators: {
          clarity: evaluation.confidenceIndicators?.clarity ?? 5,
          depth: evaluation.confidenceIndicators?.depth ?? 5,
          relevance: evaluation.confidenceIndicators?.relevance ?? 5,
          communication: evaluation.confidenceIndicators?.communication ?? 5,
        },
        sampleAnswer: evaluation.sampleAnswer ?? '',
      });
      setLastFeedback(evaluation); setShowFeedback(true);
    } catch {
      setLastFeedback({ score: 0, feedback: 'Evaluation unavailable', strengths: [], improvements: [] }); setShowFeedback(true);
    } finally { setIsEvaluating(false); }
  };

  const handleNext = () => { if (isLastQuestion) navigate('/dashboard'); else setCurrentQ(q => q + 1); };
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!question) return null;

  /* ─── Styles ─── */
  const cardBg: React.CSSProperties = { backgroundColor: 'rgba(22,27,34,0.95)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 };
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none" style={{ opacity: 0.12, backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: '200px 200px' }} />
      <div className="fixed pointer-events-none" style={{ top: -200, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, borderRadius: '50%', opacity: 0.12, background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, filter: 'blur(100px)', transition: 'background 600ms' }} />

      {/* ─── Header ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px',
        backgroundColor: 'rgba(13,17,23,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase' as const, background: 'none', border: 'none', cursor: 'pointer' }}>TOONHUB</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Clock size={14} style={{ color: accent }} />
            <span style={{ color: 'white', fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatTime(timer)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <MessageSquare size={14} style={{ color: accent }} />
            <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{currentQ + 1}<span style={{ opacity: 0.4 }}>/{questions.length}</span></span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ width: '100%', height: 3, backgroundColor: 'rgba(255,255,255,0.04)' }}>
        <motion.div animate={{ width: `${((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', backgroundColor: accent, borderRadius: '0 2px 2px 0' }} />
      </div>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 680 }}>

          {/* ── Question Card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              style={{ ...cardBg, padding: '28px 28px 24px', marginBottom: 20 }}
            >
              {/* Badges + speaker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: `${accent}18`, color: accent }}>{question.type}</span>
                <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.05)', color: '#8b949e' }}>{question.difficulty}</span>
                <button onClick={toggleSpeak} aria-label={isSpeaking ? 'Stop speaking' : 'Read question aloud'} title={isSpeaking ? 'Stop speaking' : 'Read question aloud'} style={{ marginLeft: 'auto', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: isSpeaking ? `${accent}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${isSpeaking ? `${accent}40` : 'rgba(255,255,255,0.06)'}`, color: isSpeaking ? accent : '#8b949e', transition: 'all 200ms' }}>
                  {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              {/* Question text */}
              <p style={{ color: 'white', fontSize: 19, fontWeight: 600, lineHeight: 1.65, marginBottom: question.topic ? 14 : 0 }}>{question.question}</p>

              {/* Topic tag */}
              {question.topic && (
                <p style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Topic: {question.topic}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Answer Area ── */}
          {!showFeedback && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={isListening ? '🎤 Listening... speak your answer' : 'Type your answer here or use the microphone...'}
                  rows={6}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '20px 56px 20px 20px',
                    borderRadius: 14,
                    backgroundColor: 'rgba(22,27,34,0.95)',
                    border: `2px solid ${isListening ? accent : 'rgba(255,255,255,0.06)'}`,
                    color: 'white', fontSize: 15, lineHeight: 1.65,
                    fontFamily: "'Inter', sans-serif",
                    resize: 'none', outline: 'none',
                    transition: 'border-color 200ms',
                  }}
                  onFocus={e => { e.target.style.borderColor = accent; }}
                  onBlur={e => { if (!isListening) e.target.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                />
                {/* Mic button */}
                {isSpeechSupported() && (
                  <button
                    onClick={toggleVoice}
                    aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                    title={isListening ? 'Stop recording' : 'Start voice input'}
                    style={{
                      position: 'absolute', bottom: 16, right: 16,
                      width: 40, height: 40, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: isListening ? accent : 'rgba(255,255,255,0.06)',
                      border: isListening ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      color: 'white', cursor: 'pointer',
                      transition: 'all 200ms',
                      boxShadow: isListening ? `0 0 20px ${accent}40` : 'none',
                    }}
                  >
                    {isListening ? <Mic size={18} className="animate-pulse" /> : <MicOff size={18} />}
                  </button>
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || isEvaluating}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '16px 0', borderRadius: 14,
                  backgroundColor: !answer.trim() || isEvaluating ? '#222' : accent,
                  border: 'none', color: 'white',
                  fontSize: 15, fontWeight: 700,
                  cursor: !answer.trim() || isEvaluating ? 'not-allowed' : 'pointer',
                  opacity: !answer.trim() ? 0.5 : 1,
                  transition: 'all 200ms',
                }}
                onMouseEnter={e => { if (answer.trim() && !isEvaluating) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {isEvaluating ? <><Loader2 size={18} className="animate-spin" /> Evaluating with AI...</> : <><Send size={16} /> Submit Answer</>}
              </button>
            </motion.div>
          )}

          {/* ── Feedback Card ── */}
          <AnimatePresence>
            {showFeedback && lastFeedback && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ ...cardBg, padding: '28px' }}>
                {/* Score circle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${accent}15`, border: `3px solid ${accent}` }}>
                    <span style={{ color: accent, fontSize: 26, fontWeight: 900 }}>{(lastFeedback as { score?: number }).score}</span>
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 3 }}>
                      {((lastFeedback as { score?: number }).score || 0) >= 8 ? 'Excellent!' : ((lastFeedback as { score?: number }).score || 0) >= 6 ? 'Good job!' : ((lastFeedback as { score?: number }).score || 0) >= 4 ? 'Needs improvement' : 'Keep practicing'}
                    </p>
                    <p style={{ color: '#8b949e', fontSize: 13 }}>Score: {(lastFeedback as { score?: number }).score}/10</p>
                  </div>
                </div>

                {/* Feedback text */}
                <p style={{ color: '#c9d1d9', fontSize: 14, lineHeight: 1.7, marginBottom: 22, padding: '14px 18px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  {(lastFeedback as { feedback?: string }).feedback}
                </p>

                {/* Strengths & Improvements */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                  {((lastFeedback as { strengths?: string[] }).strengths || []).length > 0 && (
                    <div style={{ padding: '18px', borderRadius: 14, backgroundColor: 'rgba(107,191,122,0.06)', border: '1px solid rgba(107,191,122,0.15)' }}>
                      <p style={{ ...labelStyle, color: '#6BBF7A' }}>Strengths</p>
                      {((lastFeedback as { strengths?: string[] }).strengths || []).map((s: string, i: number) => (
                        <p key={i} style={{ color: '#c9d1d9', fontSize: 13, lineHeight: 1.55, marginBottom: 6 }}>• {s}</p>
                      ))}
                    </div>
                  )}
                  {((lastFeedback as { improvements?: string[] }).improvements || []).length > 0 && (
                    <div style={{ padding: '18px', borderRadius: 14, backgroundColor: 'rgba(244,132,95,0.06)', border: '1px solid rgba(244,132,95,0.15)' }}>
                      <p style={{ ...labelStyle, color: '#F4845F' }}>To Improve</p>
                      {((lastFeedback as { improvements?: string[] }).improvements || []).map((s: string, i: number) => (
                        <p key={i} style={{ color: '#c9d1d9', fontSize: 13, lineHeight: 1.55, marginBottom: 6 }}>• {s}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '16px 0', borderRadius: 14,
                    backgroundColor: accent, border: 'none',
                    color: 'white', fontSize: 15, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 200ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {isLastQuestion ? 'View Results Dashboard' : 'Next Question'} <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
